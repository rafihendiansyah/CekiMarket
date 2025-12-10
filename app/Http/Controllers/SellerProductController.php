<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SellerProductController extends Controller
{
    /**
     * Helper: pastikan user punya toko ACTIVE.
     * Kalau belum, redirect ke dashboard dengan pesan error.
     */
    protected function ensureActiveSeller()
    {
        $user = Auth::user();

        if ($user->role !== 'penjual') {
            return [null, redirect()->route('dashboard')->with('error', 'Hanya penjual yang dapat mengelola produk.')];
        }

        $seller = $user->seller;

        if (!$seller) {
            return [null, redirect()->route('seller.register')->with('error', 'Lengkapi data toko terlebih dahulu sebelum mengelola produk.')];
        }

        if ($seller->status !== 'ACTIVE') {
            return [null, redirect()->route('dashboard')->with('error', 'Toko Anda belum ACTIVE. Menunggu verifikasi Platform Admin.')];
        }

        return [$seller, null];
    }

    /**
     * Daftar produk milik seller (ala dashboard Tokopedia).
     */
    public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        $products = $seller->products()
            ->latest()
            ->get()
            ->map(function (Product $product) {
                $firstImage = is_array($product->images) && count($product->images) > 0
                    ? $product->images[0]
                    : null;

                // Gunakan thumbnail_index jika ada, jika tidak gunakan foto pertama
                $thumbnailIndex = $product->thumbnail_index ?? 0;
                $thumbnailImage = null;
                if (is_array($product->images) && count($product->images) > 0) {
                    if (isset($product->images[$thumbnailIndex])) {
                        $thumbnailImage = $product->images[$thumbnailIndex];
                    } else {
                        $thumbnailImage = $product->images[0];
                    }
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'status' => $product->status,
                    'imageUrl' => $thumbnailImage ? '/storage/'.$thumbnailImage : null,
                ];
            });

        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Form tambah produk.
     */
    public function create(): Response|\Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        return Inertia::render('Seller/Products/Create', [
            'categories' => config('product_categories'),
        ]);
    }

    /**
     * Simpan produk baru.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'category'        => ['required', 'string', 'in:' . implode(',', config('product_categories'))],
            'condition'       => ['required', 'in:BARU,BEKAS'],
            'price'           => ['required', 'integer', 'min:0'],
            'stock'           => ['required', 'integer', 'min:0'],
            'description'     => ['nullable', 'string'],
            'images'          => ['nullable', 'array', 'max:5'],
            'images.*'        => ['file', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'imageOrder'      => ['nullable', 'array'], // urutan foto dari frontend
            'thumbnailIndex'  => ['nullable', 'integer', 'min:0'],
        ]);

        $imagePaths = [];

        // Upload foto baru
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $imagePaths[] = $imageFile->store('products', 'public');
            }
        }

        // Pastikan thumbnail_index valid
        $thumbnailIndex = $request->thumbnailIndex ?? 0;
        if (count($imagePaths) > 0 && $thumbnailIndex >= count($imagePaths)) {
            $thumbnailIndex = 0;
        }

        $product = $seller->products()->create([
            'name'            => $validated['name'],
            'category'        => $validated['category'],
            'condition'       => $validated['condition'],
            'price'           => $validated['price'],
            'stock'           => $validated['stock'],
            'description'     => $validated['description'] ?? null,
            'images'          => $imagePaths,
            'thumbnail_index' => $thumbnailIndex,
            'status'          => 'ACTIVE',
        ]);


        return redirect()
            ->route('seller.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Form edit produk.
     */
    public function edit(Product $product): Response|\Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        if ($product->seller_id !== $seller->id) {
            return redirect()->route('seller.products.index')->with('error', 'Anda tidak berhak mengedit produk ini.');
        }

        return Inertia::render('Seller/Products/Edit', [
            'product' => [
                'id'             => $product->id,
                'name'           => $product->name,
                'category'       => $product->category,
                'condition'      => $product->condition,
                'price'           => $product->price,
                'stock'          => $product->stock,
                'description'    => $product->description,
                'images'         => $product->images ?? [],
                'thumbnail_index' => $product->thumbnail_index ?? 0,
                'status'         => $product->status,
            ],
            'categories' => config('product_categories'),
        ]);

    }

    /**
     * Update produk.
     */
    public function update(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        if ($product->seller_id !== $seller->id) {
            return redirect()->route('seller.products.index')->with('error', 'Anda tidak berhak mengedit produk ini.');
        }

        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'category'        => ['required', 'string', 'in:' . implode(',', config('product_categories'))],
            'condition'      => ['required', 'in:BARU,BEKAS'],
            'price'           => ['required', 'integer', 'min:0'],
            'stock'           => ['required', 'integer', 'min:0'],
            'description'     => ['nullable', 'string'],
            'images'         => ['nullable', 'array', 'max:5'],
            'images.*'       => ['file', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'existingImages'  => ['nullable', 'array'], // foto lama yang tetap dipakai
            'imageOrder'     => ['nullable', 'array'], // urutan semua foto (lama + baru)
            'thumbnailIndex' => ['nullable', 'integer', 'min:0'],
        ]);

        // Mulai dengan existing images (yang sudah di-reorder oleh user di frontend)
        $imagePaths = $request->existingImages ?? ($product->images ?? []);

        // Tambahkan foto baru yang diupload di akhir
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $imagePaths[] = $imageFile->store('products', 'public');
            }
        }

        // Pastikan maksimal 5 foto
        $imagePaths = array_slice($imagePaths, 0, 5);

        // Pastikan thumbnail_index valid
        $thumbnailIndex = $request->thumbnailIndex ?? $product->thumbnail_index ?? 0;
        if ($thumbnailIndex >= count($imagePaths)) {
            $thumbnailIndex = 0;
        }

        $product->update([
            'name'            => $validated['name'],
            'category'        => $validated['category'],
            'condition'      => $validated['condition'],
            'price'           => $validated['price'],
            'stock'           => $validated['stock'],
            'description'     => $validated['description'] ?? null,
            'images'          => $imagePaths,
            'thumbnail_index' => $thumbnailIndex,
        ]);


        return redirect()
            ->route('seller.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Hapus produk.
     */
    public function destroy(Product $product): \Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        if ($product->seller_id !== $seller->id) {
            return redirect()->route('seller.products.index')->with('error', 'Anda tidak berhak menghapus produk ini.');
        }

        $product->delete();

        return redirect()
            ->route('seller.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Toggle status ACTIVE / INACTIVE (seperti nonaktifkan produk di Tokopedia).
     */
    public function toggleStatus(Product $product): \Illuminate\Http\RedirectResponse
    {
        [$seller, $redirect] = $this->ensureActiveSeller();
        if ($redirect) {
            return $redirect;
        }

        if ($product->seller_id !== $seller->id) {
            return redirect()->route('seller.products.index')->with('error', 'Anda tidak berhak mengubah status produk ini.');
        }

        $product->status = $product->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $product->save();

        return redirect()
            ->route('seller.products.index')
            ->with('success', 'Status produk berhasil diubah.');
    }
}
