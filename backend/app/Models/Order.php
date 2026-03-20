<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Restaurant;

class Order extends Model
{
    public function restaurant() {
        return $this->belongsTo(Restaurant::class);
    }
}
