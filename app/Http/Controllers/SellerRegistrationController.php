<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SellerRegistrationController extends Controller
{
    /**
     * Tampilkan form registrasi / edit data toko.
     */
    public function create(): Response
    {
        $user = Auth::user();

        if ($user->role !== 'penjual') {
            abort(403, 'Hanya pengguna dengan role penjual yang boleh mengisi data toko.');
        }

        $seller = $user->seller;

        return Inertia::render('Seller/Register', [
            'user' => $user,
            'existingSeller' => $seller ? [
                'id'             => $seller->id,
                'storeName'      => $seller->storeName,
                'storeDescription' => $seller->storeDescription,
                'picName'        => $seller->picName,
                'picPhone'       => $seller->picPhone,
                'picEmail'       => $seller->picEmail,
                'picStreet'      => $seller->picStreet,
                'picRT'          => $seller->picRT,
                'picRW'          => $seller->picRW,
                'picVillage'     => $seller->picVillage,
                'picCity'        => $seller->picCity,
                'picProvince'    => $seller->picProvince,
                'picNumber'      => $seller->picNumber,
                'picPhotoPath'   => $seller->picPhotoPath,
                'picKtpPath'     => $seller->picKtpPath,
                'status'         => $seller->status,
            ] : null,
        ]);
    }

    /**
     * Simpan atau update data toko.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'penjual') {
            abort(403, 'Hanya pengguna dengan role penjual yang boleh mengisi data toko.');
        }

        $validated = $request->validate([
            // Data Toko
            'storeName'        => ['required', 'string', 'max:255'],
            'storeDescription' => ['nullable', 'string'],

            // Data PIC
            'picName'  => ['required', 'string', 'max:255'],
            'picPhone' => ['required', 'string', 'max:20'],
            'picEmail' => ['required', 'email', 'max:255'],

            // Alamat
            'picStreet'   => ['required', 'string', 'max:255'],
            'picRT'       => ['required', 'string', 'max:10'],
            'picRW'       => ['required', 'string', 'max:10'],
            'picVillage'  => ['required', 'string', 'max:255'],
            'picCity'     => ['required', 'string', 'max:255'],
            'picProvince' => ['required', 'string', 'max:255'],

            // Dokumen Identitas
            'picNumber'    => ['required', 'string', 'max:50'], // No KTP PIC
            'picPhoto'     => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'picKtpPhoto'  => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $seller = $user->seller;

        // Upload foto PIC
        if ($request->hasFile('picPhoto')) {
            $validated['picPhotoPath'] = $request->file('picPhoto')->store('seller/photos', 'public');
        }

        // Upload file/foto KTP
        if ($request->hasFile('picKtpPhoto')) {
            $validated['picKtpPath'] = $request->file('picKtpPhoto')->store('seller/ktp', 'public');
        }

        if ($seller) {
            // UPDATE data toko yang sudah ada
            $seller->update($validated);
            $message = 'Data toko berhasil diperbarui.';
        } else {
            // CREATE data toko baru
            $validated['user_id'] = $user->id;
            $validated['status']  = 'PENDING';
            Seller::create($validated);
            $message = 'Data toko berhasil disimpan. Status: PENDING (menunggu verifikasi).';
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Akun penjual berhasil dibuat!');
    }
}
