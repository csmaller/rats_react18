<?php

namespace Database\Seeders;

use App\Models\Song;
use Illuminate\Database\Seeder;
use RuntimeException;

class SongSeeder extends Seeder
{
    /**
     * Load the set list from the React app's songs.json.
     */
    public function run(): void
    {
        $path = dirname(base_path()).DIRECTORY_SEPARATOR.'src'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'songs.json';

        if (! is_file($path)) {
            throw new RuntimeException("Set list file not found at {$path}");
        }

        $payload = json_decode((string) file_get_contents($path), true);

        if (! is_array($payload) || ! isset($payload['songs']) || ! is_array($payload['songs'])) {
            throw new RuntimeException('Set list file is missing a songs array.');
        }

        foreach ($payload['songs'] as $index => $song) {
            if (! is_array($song) || empty($song['title']) || empty($song['artist'])) {
                throw new RuntimeException('Each song needs a title and an artist.');
            }

            $match = [
                'title' => $song['title'],
                'artist' => $song['artist'],
            ];

            $existing = Song::query()->where($match)->first();

            if ($existing) {
                $existing->update([
                    'sort_order' => $song['id'] ?? ($index + 1),
                ]);

                continue;
            }

            Song::query()->create([
                ...$match,
                'sort_order' => $song['id'] ?? ($index + 1),
                'is_published' => true,
            ]);
        }
    }
}
