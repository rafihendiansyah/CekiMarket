<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\SellerApprovedMail;
use App\Mail\SellerRejectedMail;

class PlatformAdminSellerController extends Controller
{
    /**
     * Daftar seller yang butuh verifikasi.
     */
    public function index(): Response
    {
        $user = Auth::user();

        if (!$user->isPlatformAdmin()) {
            abort(403, 'Hanya Platform Admin yang boleh mengakses halaman ini.');
        }

        $sellers = Seller::with('user')
            ->orderByRaw("FIELD(status, 'PENDING', 'ACTIVE', 'REJECTED')")
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($seller) {
                return [
                    'id' => $seller->id,
                    'storeName' => $seller->storeName,
                    'status' => $seller->status,
                    'createdAt' => $seller->created_at->format('d-m-Y H:i'),
                    'userName' => $seller->user?->name,
                    'userEmail' => $seller->user?->email,
                    'submissionCount' => $seller->submission_count ?? 1,
                ];
            });

        return Inertia::render('Admin/Sellers', [
            'sellers' => $sellers,
        ]);
    }

    /**
     * Detail seller untuk verifikasi.
     */
    public function show(Seller $seller): Response
    {
        $user = Auth::user();

        if (!$user->isPlatformAdmin()) {
            abort(403, 'Hanya Platform Admin yang boleh mengakses halaman ini.');
        }

        $seller->load('user');

        return Inertia::render('Admin/SellerDetail', [
            'seller' => [
                'id' => $seller->id,
                'storeName' => $seller->storeName,
                'storeDescription' => $seller->storeDescription,
                'picName' => $seller->picName,
                'picPhone' => $seller->picPhone,
                'picEmail' => $seller->picEmail,
                'picStreet' => $seller->picStreet,
                'picRT' => $seller->picRT,
                'picRW' => $seller->picRW,
                'picVillage' => $seller->picVillage,
                'picCity' => $seller->picCity,
                'picProvince' => $seller->picProvince,
                'picNumber' => $seller->picNumber,
                'picPhotoPath' => $seller->picPhotoPath,
                'picKtpPath' => $seller->picKtpPath,
                'status' => $seller->status,
                'createdAt' => $seller->created_at->format('d-m-Y H:i'),
                'userName' => $seller->user->name,
                'userEmail' => $seller->user->email,
                'submissionCount' => $seller->submission_count ?? 1,
            ]
        ]);
    }

    /**
     * APPROVE SELLER → Kirim email persetujuan
     */
    public function approve(Seller $seller): RedirectResponse
    {
        $user = Auth::user();

        if (!$user->isPlatformAdmin()) {
            abort(403, 'Hanya Platform Admin yang boleh melakukan verifikasi.');
        }

        $seller->update([
            'status' => 'ACTIVE',
        ]);

        // === KIRIM EMAIL APPROVED ===
        Mail::to($seller->user->email)->send(
            new SellerApprovedMail(
                $seller->user->name,
                $seller->storeName
            )
        );

        return redirect()
            ->route('admin.sellers.index')
            ->with('success', 'Seller berhasil diset menjadi ACTIVE dan email telah dikirim.');
    }

    /**
     * REJECT SELLER → Kirim email penolakan
     */
    public function reject(Seller $seller): RedirectResponse
    {
        $user = Auth::user();

        if (!$user->isPlatformAdmin()) {
            abort(403, 'Hanya Platform Admin yang boleh melakukan penolakan.');
        }

        $seller->update([
            'status' => 'REJECTED',
        ]);

        // === KIRIM EMAIL REJECTED ===
        // Alasan penolakan (bisa dikembangkan untuk input dari admin)
        $rejectionReason = 'Data yang Anda berikan belum memenuhi syarat administrasi sebagai penjual. Silakan lengkapi kembali data toko dan ajukan ulang.';
        
        Mail::to($seller->user->email)->send(
            new SellerRejectedMail(
                $seller->user->name,
                $rejectionReason
            )
        );

        return redirect()
            ->route('admin.sellers.index')
            ->with('success', 'Seller berhasil diset menjadi REJECTED dan email telah dikirim.');
    }
}