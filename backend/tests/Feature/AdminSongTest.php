<?php

namespace Tests\Feature;

use App\Models\Song;
use App\Models\User;
use Database\Seeders\SongSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AdminSongTest extends TestCase
{
    use RefreshDatabase;

    public function test_content_tables_exist(): void
    {
        foreach ([
            'songs',
            'about_pages',
            'biographies',
            'gigs',
            'media_links',
            'featured_videos',
            'contact_messages',
            'epk_profiles',
            'epk_documents',
        ] as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table {$table}");
        }
    }

    public function test_song_seeder_loads_the_set_list(): void
    {
        $this->seed(SongSeeder::class);

        $this->assertSame(57, Song::query()->count());
        $this->assertDatabaseHas('songs', [
            'title' => 'Badfish',
            'artist' => 'Sublime',
            'sort_order' => 1,
        ]);
        $this->assertDatabaseHas('songs', [
            'title' => 'Whitehouse Road',
            'artist' => 'Tyler Childers',
            'sort_order' => 57,
        ]);

        $this->actingAs(User::factory()->create())
            ->get('/admin/songs')
            ->assertOk()
            ->assertSee('Badfish')
            ->assertSee('Whitehouse Road');

        $this->actingAs(User::factory()->create())
            ->get('/admin/songs?q=sublime')
            ->assertSee('Santeria')
            ->assertDontSee('Whitehouse Road');
    }

    public function test_seeded_admin_can_log_in(): void
    {
        $this->seed();

        $this->post('/admin/login', [
            'email' => config('rats.admin_email'),
            'password' => config('rats.admin_password'),
        ])->assertRedirect('/admin/songs');

        $this->assertAuthenticated();
    }

    public function test_guests_are_sent_to_the_admin_login(): void
    {
        $this->get('/admin/songs')->assertRedirect('/admin/login');
    }

    public function test_admin_can_create_update_and_delete_a_song(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/songs', [
                'title' => 'Powder Day',
                'artist' => 'RATS',
                'audio_url' => 'https://example.com/powder-day.mp3',
                'sort_order' => 3,
                'is_published' => '1',
            ])
            ->assertRedirect('/admin/songs');

        $song = Song::query()->where('title', 'Powder Day')->first();
        $this->assertNotNull($song);
        $this->assertTrue($song->is_published);
        $this->assertSame('https://example.com/powder-day.mp3', $song->audio_url);

        $this->actingAs($admin)
            ->put("/admin/songs/{$song->id}", [
                'title' => 'Powder Day (Live)',
                'artist' => 'RATS',
                'audio_url' => '',
                'sort_order' => 4,
                'is_published' => '0',
            ])
            ->assertRedirect('/admin/songs');

        $this->assertDatabaseHas('songs', [
            'id' => $song->id,
            'title' => 'Powder Day (Live)',
            'audio_url' => null,
            'sort_order' => 4,
            'is_published' => false,
        ]);

        $this->actingAs($admin)
            ->delete("/admin/songs/{$song->id}")
            ->assertRedirect('/admin/songs');

        $this->assertDatabaseMissing('songs', ['id' => $song->id]);
    }
}
