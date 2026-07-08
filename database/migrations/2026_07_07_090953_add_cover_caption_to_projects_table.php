<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Placeholder-photo caption (e.g. "exterior, dusk"), shown until real
            // photography replaces the striped placeholders. Drop once media is live.
            $table->string('cover_caption')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('cover_caption');
        });
    }
};
