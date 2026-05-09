<?php

namespace App\Http\Controllers;

use App\Models\ProductUsage;
use App\Models\Service;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductUsageController extends Controller
{
    public function index()
    {
        $usages = ProductUsage::with(['service', 'product'])->get();
        $services = Service::all();
        $products = Product::all();
        
        return Inertia::render('Inventory/Recipes', [
            'usages' => $usages,
            'services' => $services,
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'product_id' => 'required|exists:products,id',
            'qty_used' => 'required|numeric|min:0.01',
        ]);

        // Cek apakah kombinasi sudah ada
        $exists = ProductUsage::where('service_id', $request->service_id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Formula untuk layanan dan produk ini sudah ada');
        }

        ProductUsage::create($request->all());

        return redirect()->back()->with('success', 'Formula berhasil ditambahkan');
    }

    public function update(Request $request, ProductUsage $productUsage)
    {
        $request->validate([
            'qty_used' => 'required|numeric|min:0.01',
        ]);

        $productUsage->update($request->only('qty_used'));

        return redirect()->back()->with('success', 'Formula berhasil diperbarui');
    }

    public function destroy(ProductUsage $productUsage)
    {
        $productUsage->delete();
        return redirect()->back()->with('success', 'Formula berhasil dihapus');
    }
}
