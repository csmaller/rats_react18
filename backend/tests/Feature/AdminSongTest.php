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
            'user_types',
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

    public function test_default_admin_can_log_in(): void
    {
        $this->assertDatabaseHas('user_types', ['id' => 1, 'name' => 'admin']);
        $this->assertDatabaseHas('user_types', ['id' => 2, 'name' => 'guest']);
        $this->assertDatabaseHas('users', [
            'email' => 'coreysmaller@gmail.com',
            'user_type_id' => 1,
        ]);

        $this->post('/admin/login', [
            'email' => 'coreysmaller@gmail.com',
            'password' => 'Vi$ions1',
        ])->assertRedirect('/admin/songs');

        $this->assertAuthenticated();
    }

    public function test_guest_user_cannot_open_the_admin(): void
    {
        $guest = User::factory()->create(['user_type_id' => 2]);

        $this->actingAs($guest)
            ->get('/admin/songs')
            ->assertRedirect('/admin/login');

        $this->assertGuest();
    }

    public function test_logout_returns_to_the_main_site(): void
    {
        config(['rats.site_url' => 'http://localhost:5173']);

        $this->actingAs(User::factory()->create())
            ->post('/admin/logout')
            ->assertRedirect('http://localhost:5173/');

        $this->assertGuest();
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

    public function test_adding_a_song_from_the_set_list_does_not_reload_the_page(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->get('/admin/songs')
            ->assertOk()
            ->assertSee('id="add-song"', false);

        $this->actingAs($admin)
            ->postJson('/admin/songs', [
                'title' => 'Chair Lift',
                'artist' => 'RATS',
                'audio_url' => '',
                'sort_order' => 2,
                'is_published' => '1',
            ])
            ->assertCreated()
            ->assertJsonPath('song.title', 'Chair Lift')
            ->assertJsonPath('song.artist', 'RATS')
            ->assertJsonPath('song.sort_order', 2)
            ->assertJsonPath('song.is_published', true);

        $this->assertDatabaseHas('songs', [
            'title' => 'Chair Lift',
            'artist' => 'RATS',
        ]);
    }

    public function test_a_song_title_cannot_be_added_twice_regardless_of_case(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->postJson('/admin/songs', [
            'title' => 'Badfish',
            'artist' => 'Sublime',
            'is_published' => '1',
        ])->assertCreated();

        $this->actingAs($admin)->postJson('/admin/songs', [
            'title' => 'badfish',
            'artist' => 'Someone Else',
            'is_published' => '1',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('title');

        $this->assertSame(1, Song::query()->whereRaw('lower(title) = ?', ['badfish'])->count());
    }

    public function test_a_song_field_can_be_saved_from_the_list(): void
    {
        $admin = User::factory()->create();
        $song = Song::query()->create([
            'title' => 'Wagon Wheel',
            'artist' => 'Old Crow Medicine Show',
            'audio_url' => null,
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $this->actingAs($admin)
            ->putJson("/admin/songs/{$song->id}", [
                'title' => 'Wagon Wheel',
                'artist' => 'Darius Rucker',
                'audio_url' => 'https://example.com/wagon-wheel',
                'sort_order' => 1,
                'is_published' => true,
            ])
            ->assertOk()
            ->assertJsonPath('song.artist', 'Darius Rucker')
            ->assertJsonPath('song.audio_url', 'https://example.com/wagon-wheel');
    }

    public function test_the_public_set_list_returns_published_songs(): void
    {
        Song::query()->create([
            'title' => 'Badfish',
            'artist' => 'Sublime',
            'sort_order' => 2,
            'is_published' => true,
        ]);
        Song::query()->create([
            'title' => 'Wagon Wheel',
            'artist' => 'Old Crow Medicine Show',
            'sort_order' => 1,
            'is_published' => true,
        ]);
        Song::query()->create([
            'title' => 'Hidden Tune',
            'artist' => 'Nobody',
            'sort_order' => 0,
            'is_published' => false,
        ]);

        $this->getJson('/api/songs')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.title', 'Wagon Wheel')
            ->assertJsonPath('1.title', 'Badfish')
            ->assertJsonMissing(['title' => 'Hidden Tune']);
    }
}
