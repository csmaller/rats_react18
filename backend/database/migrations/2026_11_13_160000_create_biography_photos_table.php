<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biography_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('biography_id')->constrained('biographies')->cascadeOnDelete();
            $table->string('path');
            $table->boolean('is_main')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['biography_id', 'sort_order']);
        });

        $now = now();

        foreach (DB::table('biographies')->whereNotNull('photo_path')->orderBy('id')->get() as $member) {
            if (! is_string($member->photo_path) || $member->photo_path === '') {
                continue;
            }

            DB::table('biography_photos')->insert([
                'biography_id' => $member->id,
                'path' => $member->photo_path,
                'is_main' => true,
                'sort_order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('biography_photos');
    }
};
