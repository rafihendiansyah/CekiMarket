<?php

namespace App\Http\Controllers;

use App\Mail\ReviewThankYouMail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ProductReviewController extends Controller
{
    /**
     * Simpan komentar + rating dari pengunjung (tanpa login),
     * dan kirim email ucapan terima kasih.
     */
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

        // Validasi sesuai SRS-06
        $validated = $request->validate([
            'visitor_name'  => ['required', 'string', 'max:255'],
            'visitor_phone' => ['required', 'string', 'max:30'],
            'visitor_email' => ['required', 'email', 'max:255'],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'comment'       => ['nullable', 'string'],
        ]);

        // Simpan review
        $review = $product->reviews()->create($validated);

        // Kirim Email (menggunakan versi yang sudah terbukti bekerja dari teman)
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
