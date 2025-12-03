<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    /**
     * Tampilkan form register (penjual).
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Proses penyimpanan user baru (penjual).
     */
    public function store(Request $request)
    {
        // Validasi input dasar
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Buat user baru dengan role PENJUAL
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'penjual', // <-- semua yang daftar adalah PENJUAL
        ]);

        event(new Registered($user));

        // Auto login
        Auth::login($user);

        // LANGSUNG arahkan ke form registrasi penjual (data toko)
        return redirect()
        ->route('dashboard')
        ->with('success', 'Pendaftaran akun berhasil!');
    }
}
