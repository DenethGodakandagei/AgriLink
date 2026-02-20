<?php

namespace App\Http\Controllers;

use App\Models\SavedItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $savedItems = SavedItem::with('product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        // Return just the products to match frontend expectation (list of products)
        // Or return the saved item wrapper? 
        // Frontend expects list of products in Saved.jsx: "savedItems.map(product => ...)"
        // But the product data is inside `product` relation.
        // Let's transform it.

        $products = $savedItems->map(function ($item) {
            $product = $item->product;
            // Add saved_item_id if needed, but we mostly care about product details
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $item = SavedItem::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Item saved successfully', 'item' => $item]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($productId)
    {
        // We accept product_id for convenience in toggling
        $deleted = SavedItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Item removed from saved']);
        }

        return response()->json(['message' => 'Item not found'], 404);
    }
}
