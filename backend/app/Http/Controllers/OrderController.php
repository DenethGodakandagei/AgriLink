<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the authenticated user's orders.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Admins/farmers can see all orders; buyers see only their own
        if ($user->role === 'admin') {
            return Order::with(['user', 'product'])->get();
        }

        return Order::where('user_id', $user->id)
            ->with(['user', 'product'])
            ->get();
    }

    /**
     * Store a newly created order in MongoDB.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'product_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
        ]);

        // Fetch the product to calculate total price
        $product = Product::findOrFail($fields['product_id']);

        if ($product->quantity < $fields['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'product_id' => $fields['product_id'],
            'quantity' => $fields['quantity'],
            'total_price' => $product->price * $fields['quantity'],
            'status' => 'pending',
            'shipping_address' => $fields['shipping_address'],
        ]);

        // Decrement product stock
        $product->quantity -= $fields['quantity'];
        $product->save();

        return response()->json($order->load(['user', 'product']), 201);
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'product', 'transaction'])->findOrFail($id);

        // Only the order owner or admin can view
        if (auth()->id() !== (string) $order->user_id && auth()->user()->role !== 'admin') {
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
        $order = Order::findOrFail($id);

        if (auth()->id() !== (string) $order->user_id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled'], 422);
        }

        // Restore product stock
        $product = Product::find($order->product_id);
        if ($product) {
            $product->quantity += $order->quantity;
            $product->save();
        }

        $order->delete();

        return response()->json(['message' => 'Order cancelled successfully'], 200);
    }
}
