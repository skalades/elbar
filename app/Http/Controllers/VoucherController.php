<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::all();
        return Inertia::render('Voucher/Index', [
            'vouchers' => $vouchers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255|unique:vouchers',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'required|integer|min:0',
            'expired_at' => 'nullable|date|after:today',
        ]);

        Voucher::create($request->all());

        return redirect()->back()->with('success', 'Voucher berhasil ditambahkan');
    }

    public function update(Request $request, Voucher $voucher)
    {
        $request->validate([
            'code' => 'required|string|max:255|unique:vouchers,code,' . $voucher->id,
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'required|integer|min:0',
            'expired_at' => 'nullable|date|after:today',
        ]);

        $voucher->update($request->all());

        return redirect()->back()->with('success', 'Voucher berhasil diperbarui');
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return redirect()->back()->with('success', 'Voucher berhasil dihapus');
    }
}
