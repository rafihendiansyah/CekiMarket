<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    /**
     * Simpan komentar + rating dari pengunjung (tanpa login).
     */
    public function store(Request $request, Product $product)
    {
        // Pastikan produk & toko masih ACTIVE
        if (
            $product->status !== 'ACTIVE' ||
            !$product->seller ||
            $product->seller->status !== 'ACTIVE'
        ) {
            abort(404);
        }

        $validated = $request->validate([
            'visitor_name' => ['required', 'string', 'max:255'],
            'rating'       => ['required', 'integer', 'min:1', 'max:5'],
            'comment'      => ['nullable', 'string'],
        ]);

        $product->reviews()->create($validated);

        return redirect()
            ->route('products.show', $product->id)
            ->with('success', 'Terima kasih, komentar dan rating Anda telah dikirim.');
    }
}
