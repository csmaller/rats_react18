<?php

namespace Tests\Feature;

use App\Models\AboutPage;
use App\Models\Biography;
use App\Models\MediaLink;
use App\Models\User;
use App\Support\PublicUploads;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class EpkTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_epk_uses_the_about_biography_and_hides_listen_without_links(): void
    {
        $this->getJson('/api/epk')
            ->assertOk()
            ->assertJsonPath('listen', [])
            ->assertJsonPath('lineup', [])
            ->assertJsonPath('booking.manager', 'Rick')
            ->assertJsonPath(
                'biography',
                "Since 2008, RATS has been rocking stages across Utah, California, Colorado, Wyoming, Nevada, and Idaho. Blending influences from almost every popular genre, we’ve created a sound we proudly call ‘Ski Town Party Music.’\n\nWith an extensive catalog, crowd-favorite medleys, infectious energy, and a fun, upbeat stage presence, RATS has become known as one of the premier party bands in the Mountain West.",
            );
    }

    public function test_admin_can_edit_the_biography_and_publish_soundcloud_links(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->put('/admin/about', ['body' => "First paragraph.\n\nSecond paragraph."])
            ->assertRedirect('/admin/about');

        $this->assertSame("First paragraph.\n\nSecond paragraph.", AboutPage::query()->first()->body);

        $this->actingAs($admin)
            ->post('/admin/soundcloud', [
                'title' => 'Live at the lodge',
                'url' => 'https://soundcloud.com/rats/live',
                'sort_order' => 1,
                'is_published' => '1',
            ])
            ->assertRedirect('/admin/soundcloud');

        $this->actingAs($admin)
            ->post('/admin/soundcloud', [
                'title' => 'Not SoundCloud',
                'url' => 'https://example.com/track',
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('url');

        $this->actingAs($admin)
            ->post('/admin/soundcloud', [
                'title' => 'Hidden demo',
                'url' => 'https://soundcloud.com/rats/demo',
                'sort_order' => 2,
                'is_published' => '0',
            ])
            ->assertRedirect('/admin/soundcloud');

        $this->getJson('/api/epk')
            ->assertJsonPath('biography', "First paragraph.\n\nSecond paragraph.")
            ->assertJsonCount(1, 'listen')
            ->assertJsonPath('listen.0.title', 'Live at the lodge')
            ->assertJsonPath('listen.0.url', 'https://soundcloud.com/rats/live');

        $hidden = MediaLink::query()->where('title', 'Hidden demo')->first();
        $this->assertNotNull($hidden);
        $this->assertFalse($hidden->is_published);
    }

    public function test_lineup_and_booking_are_editable_and_shown_on_the_epk(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/lineup', [
                'name' => 'Alex Rivera',
                'instruments' => 'Guitar, vocals',
                'bio' => 'Leads the party from the first downbeat.',
                'sort_order' => 1,
                'is_published' => '1',
            ])
            ->assertRedirect('/admin/lineup');

        $this->actingAs($admin)
            ->post('/admin/lineup', [
                'name' => 'Hidden Player',
                'instruments' => 'Drums',
                'bio' => 'Keeps the backbeat loud.',
                'is_published' => '0',
            ])
            ->assertRedirect('/admin/lineup');

        $this->actingAs($admin)
            ->put('/admin/booking', [
                'booking_name' => 'Jordan Lee',
                'booking_email' => 'book@ratsband.com',
                'booking_phone' => '801-555-0148',
            ])
            ->assertRedirect('/admin/booking');

        $this->getJson('/api/epk')
            ->assertJsonCount(1, 'lineup')
            ->assertJsonPath('lineup.0.name', 'Alex Rivera')
            ->assertJsonPath('lineup.0.instruments', 'Guitar, vocals')
            ->assertJsonPath('lineup.0.bio', 'Leads the party from the first downbeat.')
            ->assertJsonPath('booking.manager', 'Jordan Lee')
            ->assertJsonPath('booking.email', 'book@ratsband.com')
            ->assertJsonPath('booking.phone', '801-555-0148');
    }

    public function test_contact_details_default_to_rick_in_salt_lake_city_and_can_be_edited(): void
    {
        $this->getJson('/api/contact')
            ->assertOk()
            ->assertJsonPath('name', 'Rick')
            ->assertJsonPath('location', 'Salt Lake City')
            ->assertJsonPath(
                'note',
                'Booking inquiries, press requests, and general questions — reach Rick directly or send a note.',
            );

        $this->actingAs(User::factory()->create())
            ->put('/admin/booking', [
                'contact_note' => 'Send a note.',
                'booking_name' => 'Rick',
                'booking_phone' => '801-555-0100',
                'booking_email' => 'rick@ratsband.com',
                'hometown' => 'Park City',
            ])
            ->assertRedirect('/admin/booking');

        $this->getJson('/api/contact')
            ->assertJsonPath('note', 'Send a note.')
            ->assertJsonPath('phone', '801-555-0100')
            ->assertJsonPath('email', 'rick@ratsband.com')
            ->assertJsonPath('location', 'Park City');
    }

    public function test_a_member_needs_a_short_bio_and_can_upload_a_portrait(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->get('/admin/lineup/create')
            ->assertOk()
            ->assertSee('Use a portrait photo: taller than it is wide.', false)
            ->assertSee('name="bio"', false)
            ->assertSee('name="photo"', false)
            ->assertSee('data-upload', false)
            ->assertSee('upload-progress', false);

        $this->actingAs($admin)
            ->post('/admin/lineup', [
                'name' => 'Alex Rivera',
                'instruments' => 'Guitar, vocals',
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('bio');

        $this->actingAs($admin)
            ->post('/admin/lineup', [
                'name' => 'Alex Rivera',
                'instruments' => 'Guitar, vocals',
                'bio' => 'Keeps the room moving from the first song.',
                'photo' => UploadedFile::fake()->image('portrait.jpg', 600, 800),
                'is_published' => '1',
            ])
            ->assertRedirect('/admin/lineup');

        $this->actingAs($admin)
            ->postJson('/admin/lineup', [
                'name' => 'Casey Quinn',
                'instruments' => 'Bass',
                'bio' => 'Locks in with the drums.',
                'photo' => UploadedFile::fake()->image('portrait.jpg', 600, 800),
                'is_published' => '0',
            ])
            ->assertOk()
            ->assertJsonPath('message', 'Lineup member added.')
            ->assertJsonPath('redirect', route('admin.lineup.index'));

        $member = Biography::query()->where('name', 'Alex Rivera')->first();
        $this->assertNotNull($member);
        $this->assertSame('Keeps the room moving from the first song.', $member->bio);
        $this->assertNotNull($member->photo_path);
        $this->assertFileExists(PublicUploads::root().$member->photo_path);

        $this->getJson('/api/epk')
            ->assertJsonPath('lineup.0.bio', 'Keeps the room moving from the first song.')
            ->assertJsonPath('lineup.0.photo', $member->photo_path);

        $this->actingAs($admin)
            ->post('/admin/lineup', [
                'name' => 'No Picture',
                'instruments' => 'Bass',
                'bio' => 'Holds down the low end.',
                'photo' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('photo');

        PublicUploads::delete($member->photo_path);
        PublicUploads::delete(Biography::query()->where('name', 'Casey Quinn')->value('photo_path'));
    }
}
