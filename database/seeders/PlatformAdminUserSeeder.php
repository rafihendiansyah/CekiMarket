<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PlatformAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'platformadmin@cekicekimart.test'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('password123'), // ganti kalau mau
                'role' => 'platform_admin',
            ]
        );
    }
}
