<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send a WhatsApp message.
     */
    public function sendMessage(string $phoneNumber, string $message)
    {
        // Mock implementation: just log the message
        Log::info("WhatsApp message sent to {$phoneNumber}: {$message}");
        
        // In a real implementation, you would use an API like Fonnte or Wablas here.
        // Example:
        // Http::post('https://api.fonnte.com/send', [...]);
        
        return true;
    }
}
