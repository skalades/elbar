<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Service;
use App\Models\ProductUsage;
use App\Models\Voucher;
use App\Models\User;
use App\Models\ServiceCategory;
use App\Services\OrderService;

class TestPhase2 extends Command
{
    protected $signature = 'test:phase2';
    protected $description = 'Test Phase 2 features (Voucher, Stock Deduction)';

    public function handle()
    {
        $this->info('Starting Test for Phase 2...');

        // 1. Create or get user for cashier
        $user = User::firstOrCreate(
            ['email' => 'cashier@test.com'],
            ['name' => 'Cashier Test', 'password' => bcrypt('password')]
        );
        auth()->login($user);

        // 1.5 Create Category
        $category = ServiceCategory::create([
            'name' => 'Kategori Test',
            'slug' => 'kategori-test',
        ]);
        $this->info("Created Category: {$category->name}");

        // 2. Create Product
        $product = Product::create([
            'name' => 'Obat Poles Test',
            'unit' => 'ml',
            'current_stock' => 1000,
            'min_stock' => 100,
        ]);
        $this->info("Created Product: {$product->name} with stock 1000");

        // 3. Create Service
        $service = Service::create([
            'name' => 'Layanan Poles Test',
            'price' => 100000,
            'service_category_id' => $category->id,
        ]);
        $this->info("Created Service: {$service->name} with price 100000");

        // 4. Create Recipe
        ProductUsage::create([
            'service_id' => $service->id,
            'product_id' => $product->id,
            'qty_used' => 50,
        ]);
        $this->info("Created Recipe: {$service->name} uses 50ml of {$product->name}");

        // 5. Create Voucher
        $voucher = Voucher::create([
            'code' => 'TESTDISCON',
            'type' => 'percent',
            'value' => 10, // 10%
            'max_uses' => 5,
            'current_uses' => 0,
        ]);
        $this->info("Created Voucher: {$voucher->code} (10%)");

        // 6. Run OrderService
        $orderService = app(OrderService::class);
        
        $this->info('Creating order with voucher...');
        $order = $orderService->createOrder([
            'plate_number' => 'B1234TST',
            'service_ids' => [$service->id],
            'payment_method' => 'tunai',
            'voucher_code' => 'TESTDISCON',
        ]);

        $this->info("Order created: {$order->order_number}");
        $this->info("Total after discount: {$order->total}"); // Should be 90000

        // 7. Verify Results
        $product->refresh();
        $voucher->refresh();

        $this->info("Updated Stock: {$product->current_stock} ml (Expected: 950)");
        $this->info("Voucher Uses: {$voucher->current_uses} (Expected: 1)");

        if ($order->total == 90000 && $product->current_stock == 950 && $voucher->current_uses == 1) {
            $this->info('SUCCESS: All tests passed!');
        } else {
            $this->error('FAILURE: Some results do not match expected values.');
        }

        // Clean up
        $order->items()->delete();
        $order->statusLogs()->delete();
        $order->delete();
        $voucher->delete();
        $product->delete();
        $service->delete();
        $category->delete();
        \App\Models\StockMutation::where('product_id', $product->id)->delete();

        return 0;
    }
}
