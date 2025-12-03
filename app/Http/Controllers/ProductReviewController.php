<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Mail\ReviewThankYouMail;
use Illuminate\Support\Facades\Mail;

class ProductReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        // Pastikan produk & toko ACTIVE
        if (
            $product->status !== 'ACTIVE' ||
            !$product->seller ||
            $product->seller->status !== 'ACTIVE'
        ) {
            abort(404);
        }

        // Validasi input
        $validated = $request->validate([
            'visitor_name'  => ['required', 'string', 'max:255'],
            'visitor_phone' => ['required', 'string', 'max:20'],
            'visitor_email' => ['required', 'email'],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'comment'       => ['nullable', 'string'],
        ]);

        // Simpan review
        $review = $product->reviews()->create($validated);

        // Kirim Email
        Mail::to($validated['visitor_email'])->send(
            new ReviewThankYouMail(
                $validated['visitor_name'],
                $product->name,
                $validated['rating']
            )
        );

        return redirect()
            ->route('products.show', $product->id)
            ->with('success', 'Terima kasih, komentar & rating Anda telah dikirim.');
    }
}
