<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const NOTE = 'Booking inquiries, press requests, and general questions — reach Rick directly or send a note.';

    public function up(): void
    {
        Schema::table('epk_profiles', function (Blueprint $table) {
            $table->text('contact_note')->nullable()->after('booking_phone');
        });

        $profile = DB::table('epk_profiles')->first();

        if ($profile === null) {
            DB::table('epk_profiles')->insert([
                'band_name' => 'RATS',
                'short_bio' => '',
                'long_bio' => '',
                'booking_name' => 'Rick',
                'hometown' => 'Salt Lake City',
                'contact_note' => self::NOTE,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return;
        }

        $updates = [];

        if ($profile->booking_name === null || $profile->booking_name === '') {
            $updates['booking_name'] = 'Rick';
        }

        if ($profile->hometown === null || $profile->hometown === '') {
            $updates['hometown'] = 'Salt Lake City';
        }

        if ($profile->contact_note === null || $profile->contact_note === '') {
            $updates['contact_note'] = self::NOTE;
        }

        if ($updates !== []) {
            $updates['updated_at'] = now();
            DB::table('epk_profiles')->where('id', $profile->id)->update($updates);
        }
    }

    public function down(): void
    {
        Schema::table('epk_profiles', function (Blueprint $table) {
            $table->dropColumn('contact_note');
        });
    }
};
