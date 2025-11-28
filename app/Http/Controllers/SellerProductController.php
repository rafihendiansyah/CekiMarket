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

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'status' => $product->status,
                    'imageUrl' => $firstImage ? '/storage/'.$firstImage : null,
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

        return Inertia::render('Seller/Products/Create');
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
    'name'        => ['required', 'string', 'max:255'],
    'category'    => ['required', 'string', 'max:255'],
    'condition'   => ['required', 'in:BARU,BEKAS'],
    'price'       => ['required', 'integer', 'min:0'],
    'stock'       => ['required', 'integer', 'min:0'],
    'description' => ['nullable', 'string'],
    'images'      => ['nullable', 'array', 'max:5'],
    'images.*'    => ['file', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
]);


        $imagePaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $imagePaths[] = $imageFile->store('products', 'public');
            }
        }

        $product = $seller->products()->create([
    'name'        => $validated['name'],
    'category'    => $validated['category'],
    'condition'   => $validated['condition'],
    'price'       => $validated['price'],
    'stock'       => $validated['stock'],
    'description' => $validated['description'] ?? null,
    'images'      => $imagePaths,
    'status'      => 'ACTIVE',
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
        'id'          => $product->id,
        'name'        => $product->name,
        'category'    => $product->category,
        'condition'   => $product->condition,
        'price'       => $product->price,
        'stock'       => $product->stock,
        'description' => $product->description,
        'images'      => $product->images ?? [],
        'status'      => $product->status,
    ],
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
            'name'        => ['required', 'string', 'max:255'],
            'category'    => ['required', 'string', 'max:255'],
            'price'       => ['required', 'integer', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'images'      => ['nullable', 'array', 'max:5'],
            'images.*'    => ['file', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
        ]);

        $imagePaths = $product->images ?? [];

        // Kalau upload gambar baru, kita overwrite semua gambar lama
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $imageFile) {
                $imagePaths[] = $imageFile->store('products', 'public');
            }
        }

        $product->update([
    'name'        => $validated['name'],
    'category'    => $validated['category'],
    'condition'   => $validated['condition'],
    'price'       => $validated['price'],
    'stock'       => $validated['stock'],
    'description' => $validated['description'] ?? null,
    'images'      => $imagePaths,
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
