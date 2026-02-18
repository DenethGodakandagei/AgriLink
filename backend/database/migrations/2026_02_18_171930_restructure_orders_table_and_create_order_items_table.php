<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing orders table
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['product_id', 'quantity']); // Remove specific product details from order

            // Add new columns for enhanced order details
            $table->string('payment_method')->default('cod');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('zip')->nullable();

            // Allow shipping_address to be longer (text) or keep string but ensure it's enough
            $table->text('shipping_address')->change();
        });

        // Create order_items table for multiple products per order
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->nullOnDelete(); // Keep record even if product deleted
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Price at time of purchase
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'first_name', 'last_name', 'email', 'phone', 'city', 'zip']);
            $table->string('shipping_address')->change();
            // Restoring product_id/quantity would be complex without data loss, omitting detailed rollback for simplicity in dev
            $table->foreignId('product_id')->nullable()->constrained();
            $table->integer('quantity')->nullable();
        });
    }
};
