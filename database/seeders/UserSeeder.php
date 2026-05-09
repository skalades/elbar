<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = Role::where('name', 'Superadmin')->first();
        $owner = Role::where('name', 'Owner')->first();
        $kasir = Role::where('name', 'Kasir')->first();
        $teknisi = Role::where('name', 'Teknisi')->first();

        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@elbar.com',
                'password' => Hash::make('password'),
                'role_to_assign' => $superadmin
            ],
            [
                'name' => 'Owner',
                'email' => 'owner@elbar.com',
                'password' => Hash::make('password'),
                'role_to_assign' => $owner
            ],
            [
                'name' => 'Kasir Utama',
                'email' => 'kasir@elbar.com',
                'password' => Hash::make('password'),
                'role_to_assign' => $kasir
            ],
            [
                'name' => 'Teknisi Handal',
                'email' => 'teknisi@elbar.com',
                'password' => Hash::make('password'),
                'role_to_assign' => $teknisi
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role_to_assign'];
            unset($userData['role_to_assign']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            if ($role) {
                $user->assignRole($role);
            }
        }
    }
}

