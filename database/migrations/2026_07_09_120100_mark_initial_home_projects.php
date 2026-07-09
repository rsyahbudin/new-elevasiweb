<?php

use App\Models\Project;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Project::query()
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->limit(6)
            ->update(['show_on_home' => true]);
    }

    public function down(): void
    {
        Project::query()->update(['show_on_home' => false]);
    }
};
