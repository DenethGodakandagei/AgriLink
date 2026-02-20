<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        $feedback = Feedback::with('user')
            ->where('product_id', $product->id)
            ->latest()
            ->get();

        return response()->json([
            'average_rating' => $feedback->avg('rating') ?: 0,
            'total_reviews' => $feedback->count(),
            'feedback' => $feedback,
        ]);
    }

    public function store(Request $request, $productId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'You must be logged in to leave feedback'], 401);
        }

        $product = Product::findOrFail($productId);

        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $hasPurchased = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered'])
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'You can only review products you have purchased',
            ], 403);
        }

        $feedback = Feedback::updateOrCreate(
            [
                'user_id' => $user->id,
                'product_id' => $product->id,
            ],
            [
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]
        );

        $allFeedback = Feedback::where('product_id', $product->id)->get();

        return response()->json([
            'message' => 'Feedback saved successfully',
            'feedback' => $feedback->load('user'),
            'average_rating' => $allFeedback->avg('rating') ?: 0,
            'total_reviews' => $allFeedback->count(),
        ], 201);
    }

    public function canReview(Request $request, $productId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['can_review' => false]);
        }

        $product = Product::findOrFail($productId);

        $hasPurchased = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered'])
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        return response()->json(['can_review' => $hasPurchased]);
    }
}
