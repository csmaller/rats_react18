<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(SongSeeder::class);

        if (! app()->environment('production')) {
            User::query()->firstOrCreate(
                ['email' => config('rats.admin_email')],
                [
                    'name' => 'RATS Admin',
                    'password' => config('rats.admin_password'),
                ],
            );
        }
    }
}
