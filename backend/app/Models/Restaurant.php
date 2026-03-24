<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Restaurant extends Model
{
    protected $guarded = ['*'];

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
