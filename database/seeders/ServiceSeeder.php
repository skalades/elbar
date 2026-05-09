<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \App\Models\Service::truncate();
        \App\Models\ServiceCategory::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $categories = [
            [
                'name' => 'Cuci Mobil Express',
                'slug' => 'cuci-mobil-express',
                'type' => 'mobil',
                'services' => [
                    ['name' => 'Mobil Kecil', 'price' => 30000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Mobil Sedang', 'price' => 35000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Mobil Besar', 'price' => 40000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Mobil Lux / XL', 'price' => 50000, 'vehicle_size' => 'Lux / XL'],
                ]
            ],
            [
                'name' => 'Cuci Mobil Hydraulic',
                'slug' => 'cuci-mobil-hydraulic',
                'type' => 'mobil',
                'services' => [
                    ['name' => 'Mobil Kecil', 'price' => 35000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Mobil Sedang', 'price' => 40000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Mobil Besar', 'price' => 50000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Mobil Lux / XL', 'price' => 60000, 'vehicle_size' => 'Lux / XL'],
                ]
            ],
            [
                'name' => 'Cuci Motor',
                'slug' => 'cuci-motor',
                'type' => 'motor',
                'services' => [
                    ['name' => 'Motor Kecil', 'price' => 10000, 'vehicle_size' => 'Kecil', 'description' => 'Beat, Mio, Supra, Vario 110, Sonic, Satria'],
                    ['name' => 'Motor Medium', 'price' => 20000, 'vehicle_size' => 'Medium', 'description' => 'Vespa, Nmax, Pcx, Vario 125/150, Mx King, Ninja SS, etc'],
                    ['name' => 'Motor Besar', 'price' => 25000, 'vehicle_size' => 'Besar', 'description' => 'R15, CB150, Ninja 250, Zx25, Xmax, etc'],
                    ['name' => 'XL / Big Bike', 'price' => 30000, 'vehicle_size' => 'XL / Big Bike', 'description' => '250cc UP'],
                ]
            ],
            [
                'name' => 'Salon & Detailing (Mobil)',
                'slug' => 'salon-detailing-mobil',
                'type' => 'mobil',
                'services' => [
                    ['name' => 'Full Paket Like New (Kecil)', 'price' => 1700000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Full Paket Like New (Sedang)', 'price' => 1800000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Full Paket Like New (Besar)', 'price' => 1900000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Full Paket Like New (Lux/XL)', 'price' => 2300000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Exterior Detailing (Kecil)', 'price' => 350000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Exterior Detailing (Sedang)', 'price' => 375000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Exterior Detailing (Besar)', 'price' => 400000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Exterior Detailing (Lux/XL)', 'price' => 450000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Interior Detailing (Kecil)', 'price' => 400000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Interior Detailing (Sedang)', 'price' => 425000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Interior Detailing (Besar)', 'price' => 450000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Interior Detailing (Lux/XL)', 'price' => 475000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Cuci + Wax Body (Kecil)', 'price' => 250000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Cuci + Wax Body (Sedang)', 'price' => 250000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Cuci + Wax Body (Besar)', 'price' => 300000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Cuci + Wax Body (Lux/XL)', 'price' => 350000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Engine Detailing (Kecil)', 'price' => 350000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Engine Detailing (Sedang)', 'price' => 375000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Engine Detailing (Besar)', 'price' => 400000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Engine Detailing (Lux/XL)', 'price' => 450000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Penghilang Jamur Kaca (Kecil)', 'price' => 175000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Penghilang Jamur Kaca (Sedang)', 'price' => 200000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Penghilang Jamur Kaca (Besar)', 'price' => 250000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Penghilang Jamur Kaca (Lux/XL)', 'price' => 300000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Coating Mobil (Kecil)', 'price' => 2500000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Coating Mobil (Sedang)', 'price' => 2500000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Coating Mobil (Besar)', 'price' => 3500000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Coating Mobil (Lux/XL)', 'price' => 4500000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Window Coating (Kecil)', 'price' => 225000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Window Coating (Sedang)', 'price' => 250000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Window Coating (Besar)', 'price' => 300000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Window Coating (Lux/XL)', 'price' => 350000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Interior Express (Kecil)', 'price' => 200000, 'vehicle_size' => 'Kecil'],
                    ['name' => 'Interior Express (Sedang)', 'price' => 250000, 'vehicle_size' => 'Sedang'],
                    ['name' => 'Interior Express (Besar)', 'price' => 300000, 'vehicle_size' => 'Besar'],
                    ['name' => 'Interior Express (Lux/XL)', 'price' => 350000, 'vehicle_size' => 'Lux / XL'],
                    ['name' => 'Aroma Therapy Vacum', 'price' => 150000, 'vehicle_size' => 'Semua Type'],
                ]
            ],
            [
                'name' => 'Motor Detailing',
                'slug' => 'motor-detailing',
                'type' => 'motor',
                'services' => [
                    ['name' => 'Supreme (Small)', 'price' => 250000, 'vehicle_size' => 'Small'],
                    ['name' => 'Supreme (Med)', 'price' => 350000, 'vehicle_size' => 'Med'],
                    ['name' => 'Supreme (Large)', 'price' => 450000, 'vehicle_size' => 'Large'],
                    ['name' => 'Supreme (Lux)', 'price' => 700000, 'vehicle_size' => 'Lux'],
                    ['name' => 'Premium (Small)', 'price' => 200000, 'vehicle_size' => 'Small'],
                    ['name' => 'Premium (Med)', 'price' => 250000, 'vehicle_size' => 'Med'],
                    ['name' => 'Premium (Large)', 'price' => 300000, 'vehicle_size' => 'Large'],
                    ['name' => 'Premium (Lux)', 'price' => 550000, 'vehicle_size' => 'Lux'],
                    ['name' => 'Coating (Small)', 'price' => 500000, 'vehicle_size' => 'Small'],
                    ['name' => 'Coating (Med)', 'price' => 600000, 'vehicle_size' => 'Med'],
                    ['name' => 'Coating (Large)', 'price' => 700000, 'vehicle_size' => 'Large'],
                    ['name' => 'Coating (Lux)', 'price' => 1000000, 'vehicle_size' => 'Lux'],
                ]
            ],
        ];

        foreach ($categories as $catData) {
            $services = $catData['services'];
            unset($catData['services']);
            
            $category = \App\Models\ServiceCategory::create($catData);
            
            foreach ($services as $serviceData) {
                $category->services()->create($serviceData);
            }
        }
    }
}
