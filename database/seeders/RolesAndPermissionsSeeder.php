<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage-bookings',
            'manage-invoices',
            'manage-services',
            'manage-promos',
            'manage-users',
            'view-reports',
            'manage-queue',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $customer = Role::firstOrCreate(['name' => 'customer']);

        $staff = Role::firstOrCreate(['name' => 'staff']);
        $staff->syncPermissions(['manage-bookings', 'manage-queue']);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions([
            'manage-bookings',
            'manage-invoices',
            'manage-services',
            'manage-promos',
            'manage-users',
            'view-reports',
            'manage-queue',
        ]);

        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdmin->syncPermissions(Permission::all());

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@gcmbook.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('Admin@1234'),
                'email_verified_at' => now(),
            ]
        );

        $adminUser->assignRole('super-admin');
    }
}
