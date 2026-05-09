<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        $categories = ServiceCategory::with('services')->get();
        $services = Service::all();
        $employees = \App\Models\Employee::with('user')->get();
        
        $queues = Order::with(['vehicle', 'items.service'])
            ->whereDate('created_at', today())
            ->whereIn('status', ['menunggu', 'dicuci'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('POS/Index', [
            'categories' => $categories,
            'services' => $services,
            'employees' => $employees,
            'queues' => $queues,
        ]);
    }

    public function getVehicleInfo($plate_number)
    {
        $vehicle = \App\Models\Vehicle::where('plate_number', strtoupper($plate_number))->first();
        
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'points' => $vehicle->points,
                'segment' => $vehicle->segment,
                'available_rewards' => $vehicle->available_rewards,
                'phone_number' => $vehicle->phone_number,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:15',
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:services,id',
            'payment_method' => 'nullable|string',
            'voucher_code' => 'nullable|string|exists:vouchers,code',
        ]);

        $order = $this->orderService->createOrder($validated);

        return redirect()->route('pos.index')->with([
            'success' => 'Order created successfully.',
            'order' => $order->load(['vehicle', 'items.service'])
        ]);
    }

    public function assignEmployee(Request $request, Order $order)
    {
        $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        $this->orderService->assignEmployee($order, $request->employee_ids);

        return redirect()->back()->with('success', 'Karyawan berhasil ditugaskan');
    }
}

