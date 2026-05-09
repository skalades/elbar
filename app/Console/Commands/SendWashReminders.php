<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendWashReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-wash-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mendeteksi pelanggan yang sudah 2 bulan tidak mencuci mobil dan mengirimkan pesan WA otomatis.';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\WhatsAppService $whatsAppService)
    {
        $this->info('Checking for inactive customers...');

        // Find vehicles where the latest completed order is older than 2 months
        // and has a phone number
        $vehicles = \App\Models\Vehicle::whereNotNull('phone_number')
            ->whereHas('orders', function ($query) {
                $query->where('status', 'selesai')
                      ->where('created_at', '<=', now()->subMonths(2));
            })
            ->whereDoesntHave('orders', function ($query) {
                $query->where('status', 'selesai')
                      ->where('created_at', '>', now()->subMonths(2));
            })
            ->get();

        $this->info('Found ' . $vehicles->count() . ' inactive vehicles.');

        foreach ($vehicles as $vehicle) {
            $message = "Halo kak, mobilnya dengan plat {$vehicle->plate_number} belum dicuci lagi nih, ada diskon 10% untuk kakak hari ini!";
            
            $whatsAppService->sendMessage($vehicle->phone_number, $message);
            
            $this->info("Reminder sent to: {$vehicle->plate_number} ({$vehicle->phone_number})");
        }

        $this->info('Reminders sent successfully.');
    }
}
