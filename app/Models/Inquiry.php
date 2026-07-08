<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = ['name', 'contact', 'message', 'source_page', 'ip_address'];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
