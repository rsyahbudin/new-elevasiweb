<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = ['name', 'contact', 'message', 'source_page', 'ip_address', 'read_at'];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
