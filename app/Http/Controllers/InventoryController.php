<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMutation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $mutations = StockMutation::with('product')->latest()->take(50)->get();
        
        return Inertia::render('Inventory/Index', [
            'products' => $products,
            'mutations' => $mutations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'current_stock' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
        ]);

        Product::create($request->all());

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'current_stock' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
        ]);

        $product->update($request->all());

        return redirect()->back()->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }

    public function mutateStock(Request $request, Product $product)
    {
        $request->validate([
            'type' => 'required|in:in,out',
            'qty' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:255',
        ]);

        $newStock = $product->current_stock;
        if ($request->type === 'in') {
            $newStock += $request->qty;
        } else {
            $newStock -= $request->qty;
            if ($newStock < 0) {
                return redirect()->back()->with('error', 'Stok tidak mencukupi');
            }
        }

        $product->update(['current_stock' => $newStock]);

        StockMutation::create([
            'product_id' => $product->id,
            'type' => $request->type,
            'qty' => $request->qty,
            'notes' => $request->notes,
            'mutation_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Mutasi stok berhasil dicatat');
    }
}
