<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class QueueService
{
    /**
     * Update the status of an order in the queue.
     */
    public function updateStatus(Order $order, string $newStatus)
    {
        $validStatuses = ['menunggu', 'dicuci', 'selesai', 'dibatalkan'];
        
        if (!in_array($newStatus, $validStatuses)) {
            throw new \InvalidArgumentException("Invalid status: {$newStatus}");
        }

        return DB::transaction(function () use ($order, $newStatus) {
            $order->update(['status' => $newStatus]);

            $order->statusLogs()->create([
                'status' => $newStatus,
            ]);

            return $order;
        });
    }

    /**
     * Get active queues for TV Monitor.
     */
    public function getActiveQueues()
    {
        $queues = Order::with('vehicle')
            ->whereIn('status', ['menunggu', 'dicuci', 'selesai'])
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy('status');

        return [
            'menunggu' => $queues->get('menunggu', collect([])),
            'dicuci' => $queues->get('dicuci', collect([])),
            'selesai' => $queues->get('selesai', collect([]))
                ->take(10), // Limit to last 10 finished for the TV Monitor
        ];
    }
}
