<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Electronic press kit copy. One row is the live EPK.
     */
    public function up(): void
    {
        Schema::create('epk_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('band_name');
            $table->string('genre')->nullable();
            $table->string('hometown')->nullable();
            $table->text('short_bio');
            $table->text('long_bio');
            $table->string('booking_name')->nullable();
            $table->string('booking_email')->nullable();
            $table->string('booking_phone')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('epk_profiles');
    }
};
