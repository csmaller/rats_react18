<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $links = [
            [
                'title' => 'Walking on Sunshine :Kimball Arts Festival Park City 2025',
                'url' => 'https://www.youtube.com/shorts/bbE6UXscLHk',
                'sort_order' => 1,
            ],
            [
                'title' => '90s Medley',
                'url' => 'https://www.youtube.com/shorts/LhsGpiRIk4A',
                'sort_order' => 2,
            ],
        ];

        foreach ($links as $link) {
            $exists = DB::table('media_links')
                ->where('type', 'video')
                ->where('url', $link['url'])
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('media_links')->insert([
                ...$link,
                'type' => 'video',
                'platform' => 'youtube',
                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('media_links')
            ->where('type', 'video')
            ->whereIn('url', [
                'https://www.youtube.com/shorts/bbE6UXscLHk',
                'https://www.youtube.com/shorts/LhsGpiRIk4A',
            ])
            ->delete();
    }
};
