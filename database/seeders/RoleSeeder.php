<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $superadmin = Role::firstOrCreate(['name' => 'Superadmin']);
        $owner = Role::firstOrCreate(['name' => 'Owner']);
        $kasir = Role::firstOrCreate(['name' => 'Kasir']);
        $teknisi = Role::firstOrCreate(['name' => 'Teknisi']);

        // Create permissions
        $permissions = [
            'view dashboard',
            'create orders',
            'edit orders',
            'delete orders',
            'manage services',
            'update queue status',
            'manage employees',
            'manage inventory',
            'manage vouchers',
            'manage membership'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign permissions to roles
        $superadmin->givePermissionTo(Permission::all());
        $owner->givePermissionTo(['view dashboard', 'manage employees', 'manage inventory', 'manage vouchers', 'manage services', 'manage membership']);
        $kasir->givePermissionTo(['create orders', 'view dashboard', 'update queue status']);
        $teknisi->givePermissionTo(['update queue status']);

        // Create test users
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@elbar.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        $adminUser->assignRole($superadmin);

        $kasirUser = User::firstOrCreate(
            ['email' => 'kasir@elbar.com'],
            [
                'name' => 'Kasir Utama',
                'password' => Hash::make('password'),
            ]
        );
        $kasirUser->assignRole($kasir);
    }
}
