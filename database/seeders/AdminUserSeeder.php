<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@elevasi.id'],
            [
                'name' => 'Rafly',
                'password' => 'password',
                'role' => UserRole::Admin,
            ],
        );
    }
}
