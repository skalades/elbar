<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'max_uses',
        'current_uses',
        'expired_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
    ];
}
