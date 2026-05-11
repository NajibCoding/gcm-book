<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Detailing Motor',
                'slug' => 'detailing-motor',
                'description' => 'Layanan detailing motor profesional untuk menjaga tampilan motor Anda tetap bersih, mengilap, dan terlindungi. Meliputi cuci, poles, dan perlindungan bodi.',
                'base_price' => 150000.00,
                'is_bookable' => true,
                'is_invoiceable' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Jasa Pindahan Rumah',
                'slug' => 'jasa-pindahan',
                'description' => 'Layanan pindahan rumah lengkap dengan armada kendaraan dan tenaga profesional. Aman, cepat, dan terpercaya untuk segala kebutuhan pindahan Anda.',
                'base_price' => 500000.00,
                'is_bookable' => true,
                'is_invoiceable' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Motor',
                'slug' => 'cuci-motor',
                'description' => 'Layanan cuci motor cepat dan bersih. Tersedia walk-in tanpa perlu booking terlebih dahulu.',
                'base_price' => 25000.00,
                'is_bookable' => false,
                'is_invoiceable' => true,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
