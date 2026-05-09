<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['plate_number', 'points', 'total_visits', 'phone_number', 'rewards_claimed'];

    protected $appends = ['segment', 'available_rewards'];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getSegmentAttribute()
    {
        $visits = $this->total_visits;
        $lastOrder = $this->orders()->latest()->first();
        
        if (!$lastOrder) {
            return 'Baru';
        }

        $churningDays = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'segment_churning_days')
            ->value('value') ?? 30;
            
        $vipVisits = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'segment_vip_visits')
            ->value('value') ?? 5;
            
        $regulerVisits = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'segment_reguler_visits')
            ->value('value') ?? 1;

        $daysSinceLastVisit = $lastOrder->created_at->diffInDays(now());

        if ($daysSinceLastVisit > $churningDays) {
            return 'Churning';
        }

        if ($visits > $vipVisits) {
            return 'VIP';
        }

        if ($visits > $regulerVisits) {
            return 'Reguler';
        }

        return 'Baru';
    }

    public function getAvailableRewardsAttribute()
    {
        $threshold = \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'loyalty_reward_threshold')
            ->value('value') ?? 10;
            
        return floor($this->points / $threshold) - $this->rewards_claimed;
    }
}
