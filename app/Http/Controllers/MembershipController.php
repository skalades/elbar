<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        $members = Vehicle::orderBy('points', 'desc')->get();
        
        $settings = DB::table('settings')->get()->pluck('value', 'key');

        return Inertia::render('Membership/Index', [
            'members' => $members,
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'loyalty_reward_threshold' => 'required|integer|min:1',
            'segment_vip_visits' => 'required|integer|min:0',
            'segment_reguler_visits' => 'required|integer|min:0',
            'segment_churning_days' => 'required|integer|min:1',
        ]);

        foreach ($validated as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan membership berhasil diperbarui');
    }
}
