<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'loyalty_reward_threshold', 'value' => '10'],
            ['key' => 'segment_vip_visits', 'value' => '5'],
            ['key' => 'segment_reguler_visits', 'value' => '1'],
            ['key' => 'segment_churning_days', 'value' => '30'],
        ];

        foreach ($settings as $setting) {
            \Illuminate\Support\Facades\DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }
}
