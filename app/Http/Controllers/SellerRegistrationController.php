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

        $seller = $user->seller;
        
        // Tentukan apakah foto wajib atau tidak
        // Wajib jika: seller belum ada ATAU seller ada tapi tidak punya foto sebelumnya
        $isNewSeller = !$seller;
        $hasExistingPhoto = $seller && $seller->picPhotoPath;
        $hasExistingKtp = $seller && $seller->picKtpPath;
        
        $photoRequired = $isNewSeller || !$hasExistingPhoto;
        $ktpRequired = $isNewSeller || !$hasExistingKtp;

        $validated = $request->validate([
            // Data Toko
            'storeName'        => ['required', 'string', 'max:255'],
            'storeDescription' => ['nullable', 'string'],

            // Data PIC
            'picName'  => ['required', 'string', 'max:255'],
            'picPhone' => ['required', 'string', 'regex:/^[0-9]{10,13}$/'],
            'picEmail' => ['required', 'email', 'max:255'],

            // Alamat
            'picStreet'   => ['required', 'string', 'max:255'],
            'picRT'       => ['required', 'string', 'max:10'],
            'picRW'       => ['required', 'string', 'max:10'],
            'picVillage'  => ['required', 'string', 'max:255'],
            'picCity'     => ['required', 'string', 'max:255'],
            'picProvince' => ['required', 'string', 'max:255'],

            // Dokumen Identitas
            'picNumber'    => ['required', 'string', 'regex:/^[0-9]{16}$/'], // No KTP PIC harus tepat 16 digit
            'picPhoto'     => [
                $photoRequired ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048'
            ],
            'picKtpPhoto'  => [
                $ktpRequired ? 'required' : 'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:5120'
            ],
        ], [
            'picPhone.regex' => 'Nomor HP harus berupa angka dengan panjang 10-13 digit (format nomor HP Indonesia).',
            'picNumber.regex' => 'No KTP harus berupa angka dengan tepat 16 digit.',
            'picPhoto.required' => 'Foto PIC wajib diunggah.',
            'picKtpPhoto.required' => 'Foto/File KTP PIC wajib diunggah.',
        ]);

        // Upload foto PIC
        if ($request->hasFile('picPhoto')) {
            $validated['picPhotoPath'] = $request->file('picPhoto')->store('seller/photos', 'public');
        } elseif ($seller && $seller->picPhotoPath) {
            // Jika tidak ada file baru tapi ada file lama, pertahankan file lama
            $validated['picPhotoPath'] = $seller->picPhotoPath;
        }

        // Upload file/foto KTP
        if ($request->hasFile('picKtpPhoto')) {
            $validated['picKtpPath'] = $request->file('picKtpPhoto')->store('seller/ktp', 'public');
        } elseif ($seller && $seller->picKtpPath) {
            // Jika tidak ada file baru tapi ada file lama, pertahankan file lama
            $validated['picKtpPath'] = $seller->picKtpPath;
        }

        if ($seller) {
            // UPDATE data toko yang sudah ada
            // Jika status sebelumnya REJECTED, ubah ke PENDING dan increment submission_count
            if ($seller->status === 'REJECTED') {
                $validated['status'] = 'PENDING';
                $validated['submission_count'] = ($seller->submission_count ?? 1) + 1;
            }
            $seller->update($validated);
            $message = 'Data toko berhasil diperbarui.';
        } else {
            // CREATE data toko baru
            $validated['user_id'] = $user->id;
            $validated['status']  = 'PENDING';
            $validated['submission_count'] = 1;
            Seller::create($validated);
            $message = 'Data toko berhasil disimpan. Status: PENDING (menunggu verifikasi).';
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Akun penjual berhasil dibuat!');
    }
}
