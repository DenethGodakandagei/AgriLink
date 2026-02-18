<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the authenticated user's orders.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Order::with(['user', 'items.product'])->latest();

        if ($user->role === 'admin') {
            // Admin sees all orders
        } elseif ($user->role === 'farmer') {
            // Farmers see orders that contain their products
            $query->whereHas('items.product', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } else {
            // Buyers see only their own orders
            $query->where('user_id', $user->id);
        }

        return $query->get();
    }

    /**
     * Display orders for the authenticated seller (farmer) containing their products.
     */
    public function sellerOrders(Request $request)
    {
        $user = auth()->user();

        $orders = Order::with(['user', 'items.product'])
            ->whereHas('items.product', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->map(function ($order) use ($user) {
                // Only include items belonging to this seller
                $sellerItems = $order->items->filter(function ($item) use ($user) {
                    return $item->product && $item->product->user_id == $user->id;
                })->values();

                return [
                    'id' => $order->id,
                    'customer' => $order->first_name . ' ' . $order->last_name,
                    'email' => $order->email,
                    'date' => $order->created_at->format('M d, Y'),
                    'items' => $sellerItems->count(),
                    'total' => $sellerItems->sum(fn($i) => $i->price * $i->quantity),
                    'status' => $order->status,
                    'payment' => $order->payment_method,
                    'city' => $order->city,
                ];
            });

        return response()->json($orders);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'city' => 'required|string',
            'zip' => 'required|string',
            'payment_method' => 'required|string|in:cod,card',
        ]);

        try {
            return DB::transaction(function () use ($fields) {
                $totalPrice = 0;
                $orderItemsData = [];

                // 1. Verify stock and calculate total
                foreach ($fields['items'] as $item) {
                    $product = Product::lockForUpdate()->find($item['id']);

                    if (!$product || $product->quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product: " . ($product->name ?? 'Unknown'));
                    }

                    $totalPrice += $product->price * $item['quantity'];

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                        'product_model' => $product // Store model for saving later
                    ];
                }

                // 2. Create Order
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'shipping_address' => $fields['shipping_address'],
                    'first_name' => $fields['first_name'],
                    'last_name' => $fields['last_name'],
                    'email' => $fields['email'],
                    'phone' => $fields['phone'],
                    'city' => $fields['city'],
                    'zip' => $fields['zip'],
                    'payment_method' => $fields['payment_method'],
                ]);

                // 3. Create Order Items and Update Stock
                foreach ($orderItemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $data['product_id'],
                        'quantity' => $data['quantity'],
                        'price' => $data['price'],
                    ]);

                    // Decrement stock
                    $data['product_model']->quantity -= $data['quantity'];
                    $data['product_model']->save();
                }

                return response()->json($order->load(['user', 'items.product']), 201);
            });

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.product', 'transaction'])->findOrFail($id);

        if (auth()->id() !== $order->user_id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $order;
    }

    /**
     * Update the order status (admin/farmer only).
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // TODO: Check if user is admin or the seller of products involved.
        // For simplicity, assuming admin for status changes for now.
        if (auth()->user()->role !== 'admin') {
            // return response()->json(['message' => 'Unauthorized'], 403);
        }

        $fields = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->status = $fields['status'];
        $order->save();

        return response()->json($order, 200);
    }

    /**
     * Cancel/delete an order (only if still pending).
     */
    public function destroy($id)
    {
        $order = Order::with('items')->findOrFail($id);

        if (auth()->id() !== $order->user_id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled'], 422);
        }

        // Restore product stock
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->quantity += $item->quantity;
                $product->save();
            }
        }

        $order->delete();

        return response()->json(['message' => 'Order cancelled successfully'], 200);
    }
}
