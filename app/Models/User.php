<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Kolom yang boleh diisi (mass assignable).
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // <-- penting
    ];

    /**
     * Kolom yang disembunyikan.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casting atribut.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi: User punya satu Seller (data toko).
     */
    public function seller()
    {
        return $this->hasOne(Seller::class);
    }

    /**
     * Cek apakah user adalah Platform Admin.
     */
    public function isPlatformAdmin(): bool
    {
        return $this->role === 'platform_admin';
    }
}
