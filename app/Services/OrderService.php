<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Vehicle;
use App\Models\Service;
use App\Models\Voucher;
use App\Models\ProductUsage;
use App\Models\StockMutation;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Create a new POS order.
     */
    public function createOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Find or create the vehicle
            $plateNumber = strtoupper(str_replace(' ', '', $data['plate_number']));
            $vehicle = Vehicle::firstOrCreate(
                ['plate_number' => $plateNumber]
            );

            // Calculate total price from selected services
            $services = Service::whereIn('id', $data['service_ids'])->get();
            $total = $services->sum('price');
            $discount = 0;

            // Handle Voucher
            if (!empty($data['voucher_code'])) {
                $voucher = Voucher::where('code', $data['voucher_code'])
                    ->where(function ($query) {
                        $query->whereNull('expired_at')
                              ->orWhere('expired_at', '>', now());
                    })
                    ->first();

                if ($voucher) {
                    if ($voucher->max_uses == 0 || $voucher->current_uses < $voucher->max_uses) {
                        if ($voucher->type === 'percent') {
                            $discount = $total * ($voucher->value / 100);
                        } else {
                            $discount = $voucher->value;
                        }
                        $voucher->increment('current_uses');
                    }
                }
            }

            $finalTotal = max(0, $total - $discount);

            // 2. Create the order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'vehicle_id' => $vehicle->id,
                'cashier_id' => auth()->id(),
                'status' => 'menunggu',
                'total' => $finalTotal,
                'payment_method' => $data['payment_method'] ?? null,
            ]);

            // 3. Create order items and handle stock deduction
            foreach ($services as $service) {
                $order->items()->create([
                    'service_id' => $service->id,
                    'price' => $service->price,
                ]);

                // Auto-Deduction of stock
                $usages = ProductUsage::where('service_id', $service->id)->get();
                foreach ($usages as $usage) {
                    $product = $usage->product;
                    if ($product) {
                        $product->decrement('current_stock', $usage->qty_used);
                        
                        StockMutation::create([
                            'product_id' => $product->id,
                            'type' => 'out',
                            'qty' => $usage->qty_used,
                            'notes' => 'Otomatis dari order ' . $order->order_number,
                            'mutation_date' => now(),
                        ]);
                    }
                }
            }

            // 4. Log the initial status
            $order->statusLogs()->create([
                'status' => 'menunggu',
            ]);
            
            // Increment vehicle visits
            $vehicle->increment('total_visits');

            return $order;
        });
    }

    /**
     * Complete payment for an order.
     */
    public function completePayment(Order $order, string $paymentMethod)
    {
        return DB::transaction(function () use ($order, $paymentMethod) {
            $order->update([
                'status' => 'selesai',
                'payment_method' => $paymentMethod
            ]);

            $order->statusLogs()->create([
                'status' => 'selesai',
            ]);

            // Increment loyalty points for the vehicle
            if ($order->vehicle) {
                $order->vehicle->increment('points');
            }

            return $order;
        });
    }

    /**
     * Assign employees to an order.
     */
    public function assignEmployee(Order $order, array $employeeIds)
    {
        return DB::transaction(function () use ($order, $employeeIds) {
            foreach ($employeeIds as $employeeId) {
                $employee = Employee::find($employeeId);
                if ($employee) {
                    $commission = $employee->commission_rate;
                    
                    $order->employees()->attach($employeeId, [
                        'commission_earned' => $commission
                    ]);
                }
            }
            return $order;
        });
    }
}
