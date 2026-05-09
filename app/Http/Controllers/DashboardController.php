<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $omzetHariIni = Order::whereDate('created_at', $today)
            ->where('status', 'selesai')
            ->sum('total');

        $mobilMasuk = Order::whereDate('created_at', $today)->count();

        $rataRataTransaksi = $mobilMasuk > 0 ? $omzetHariIni / $mobilMasuk : 0;

        $historiOrder = Order::with('vehicle')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('Dashboard', [
            'summary' => [
                'omzet_hari_ini' => $omzetHariIni,
                'mobil_masuk' => $mobilMasuk,
                'rata_rata_transaksi' => $rataRataTransaksi,
            ],
            'histori_order' => $historiOrder
        ]);
    }
}
