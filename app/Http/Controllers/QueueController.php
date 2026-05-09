<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\QueueService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    protected $queueService;

    public function __construct(QueueService $queueService)
    {
        $this->queueService = $queueService;
    }

    public function index()
    {
        $queues = Order::with(['vehicle', 'employees'])
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'desc')
            ->get();
        $employees = \App\Models\Employee::with('user')->get();

        return Inertia::render('Queue/Index', [
            'queues' => $queues,
            'employees' => $employees,
        ]);
    }

    public function monitor()
    {
        $activeQueues = $this->queueService->getActiveQueues();

        return Inertia::render('Queue/TVMonitor', [
            'activeQueues' => $activeQueues,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:menunggu,dicuci,selesai,dibatalkan'
        ]);

        $this->queueService->updateStatus($order, $validated['status']);

        return back()->with('success', 'Status updated successfully.');
    }
}
