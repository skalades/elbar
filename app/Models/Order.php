<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'vehicle_id', 'cashier_id', 
        'status', 'total', 'payment_method'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class);
    }

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'order_employee')
            ->withPivot('commission_earned')
            ->withTimestamps();
    }
}
