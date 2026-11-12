<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The single front-page video. source is "embed" or "upload".
     * One row should be marked is_active.
     */
    public function up(): void
    {
        Schema::create('featured_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('source');
            $table->string('embed_url')->nullable();
            $table->string('file_path')->nullable();
            $table->string('poster_path')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_videos');
    }
};
