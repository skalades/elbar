<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\MembershipController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categories' => \App\Models\ServiceCategory::with('services')->get(),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::middleware('can:view dashboard')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // POS
    Route::middleware('can:create orders')->group(function () {
        Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('/pos', [PosController::class, 'store'])->name('pos.store');
        Route::get('/vehicles/{plate_number}', [PosController::class, 'getVehicleInfo'])->name('pos.vehicle-info');
    });

    // Queue
    Route::middleware('can:update queue status')->group(function () {
        Route::get('/queue', [QueueController::class, 'index'])->name('queue.index');
        Route::post('/queue/{order}/status', [QueueController::class, 'updateStatus'])->name('queue.update-status');
    });

    // Services
    Route::middleware('can:manage services')->group(function () {
        Route::resource('services', ServiceController::class)->except(['create', 'show', 'edit']);
    });

    // Employees
    Route::middleware('can:manage employees')->group(function () {
        Route::resource('employees', EmployeeController::class)->except(['create', 'show', 'edit']);
    });

    // Inventory
    Route::middleware('can:manage inventory')->group(function () {
        Route::resource('inventory', InventoryController::class)->except(['create', 'show', 'edit']);
        Route::post('/inventory/{product}/mutate', [InventoryController::class, 'mutateStock'])->name('inventory.mutate');
    });

    // Vouchers
    Route::middleware('can:manage vouchers')->group(function () {
        Route::resource('vouchers', VoucherController::class)->except(['create', 'show', 'edit']);
    });

    // Membership
    Route::middleware('can:manage membership')->group(function () {
        Route::get('/membership', [MembershipController::class, 'index'])->name('membership.index');
        Route::post('/membership/settings', [MembershipController::class, 'updateSettings'])->name('membership.update-settings');
    });

    // POS Assign Employee
    Route::post('/pos/{order}/assign', [PosController::class, 'assignEmployee'])->name('pos.assign-employee');
});

// TV Monitor (Can be public or behind auth depending on requirement)
Route::get('/queue/monitor', [QueueController::class, 'monitor'])->name('queue.monitor');

require __DIR__.'/auth.php';

