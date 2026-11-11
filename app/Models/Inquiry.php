<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'name',
        'contact',
        'message',
        'inquiry_purpose',
        'inquiry_purpose_detail',
        'project_location',
        'has_drawings',
        'target_budget',
        'referral_source',
        'referral_detail',
        'source_page',
        'ip_address',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];
}
