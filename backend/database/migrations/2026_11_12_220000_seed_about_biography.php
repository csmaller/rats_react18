<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const BODY = "Since 2008, RATS has been rocking stages across Utah, California, Colorado, Wyoming, Nevada, and Idaho. Blending influences from almost every popular genre, we’ve created a sound we proudly call ‘Ski Town Party Music.’\n\nWith an extensive catalog, crowd-favorite medleys, infectious energy, and a fun, upbeat stage presence, RATS has become known as one of the premier party bands in the Mountain West.";

    public function up(): void
    {
        if (DB::table('about_pages')->exists()) {
            return;
        }

        DB::table('about_pages')->insert([
            'headline' => 'Biography',
            'tagline' => 'Ski Town Party Music',
            'body' => self::BODY,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('about_pages')->where('body', self::BODY)->delete();
    }
};
