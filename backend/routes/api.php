<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SavedItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public product browsing
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/search/{name}', [ProductController::class, 'search']);
Route::get('/products/{id}/feedback', [FeedbackController::class, 'index']);

// ─── Protected Routes (Sanctum) ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());
    Route::get('/my-products', [ProductController::class, 'myProducts']);

    // Products (create / update / delete — authenticated farmers/admins)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/{id}/feedback', [FeedbackController::class, 'store']);

    // Orders
    Route::get('/seller-orders', [OrderController::class, 'sellerOrders']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

    // Saved Items
    Route::get('/saved-items', [SavedItemController::class, 'index']);
    Route::post('/saved-items', [SavedItemController::class, 'store']);
    Route::delete('/saved-items/{productId}', [SavedItemController::class, 'destroy']);

    // ─── Stripe ────────────────────────────────────────────────────────────────
    Route::get('/stripe/key', [\App\Http\Controllers\StripeController::class, 'publicKey']);
    Route::post('/stripe/payment-intent', [\App\Http\Controllers\StripeController::class, 'createPaymentIntent']);
});

// Stripe Webhook — must be outside auth middleware (Stripe calls this directly)
Route::post('/stripe/webhook', [\App\Http\Controllers\StripeController::class, 'webhook']);
