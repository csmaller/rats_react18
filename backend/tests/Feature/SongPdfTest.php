<?php

namespace Tests\Feature;

use App\Models\EpkProfile;
use App\Models\Song;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SongPdfTest extends TestCase
{
    use RefreshDatabase;

    public function test_pdf_lists_published_songs_alphabetically(): void
    {
        Song::query()->create(['title' => 'Wagon Wheel', 'artist' => 'Old Crow Medicine Show', 'is_published' => true, 'sort_order' => 3]);
        Song::query()->create(['title' => 'badfish', 'artist' => 'Sublime', 'is_published' => true, 'sort_order' => 1]);
        Song::query()->create(['title' => 'Hidden Tune', 'artist' => 'Nobody', 'is_published' => false, 'sort_order' => 2]);

        $profile = EpkProfile::query()->first();
        $profile->update([
            'booking_name' => 'Rick',
            'booking_email' => 'book@ratsband.com',
            'booking_phone' => '801-555-0148',
            'hometown' => 'Salt Lake City',
            'contact_note' => 'Reach Rick directly or send a note.',
        ]);

        $html = view('songs.pdf', [
            'songs' => Song::query()
                ->where('is_published', true)
                ->orderByRaw('lower(title)')
                ->orderByRaw('lower(artist)')
                ->get(),
            'profile' => $profile->fresh(),
            'logo' => 'data:image/png;base64,aaaa',
        ])->render();

        $this->assertLessThan(strpos($html, 'Wagon Wheel'), strpos($html, 'badfish'));
        $this->assertStringNotContainsString('Hidden Tune', $html);
        $this->assertLessThan(strpos($html, 'badfish'), strpos($html, 'Manager:'));
        $this->assertStringContainsString('Rick', $html);
        $this->assertStringContainsString('book@ratsband.com', $html);
        $this->assertStringContainsString('801-555-0148', $html);
        $this->assertStringContainsString('Salt Lake City', $html);
        $this->assertStringContainsString('Reach Rick directly or send a note.', $html);
        $this->assertStringContainsString('data:image/png;base64,aaaa', $html);

        $response = $this->get('/songs.pdf');

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
        $this->assertStringStartsWith('%PDF', $response->getContent());
        $this->assertStringContainsString('rats-set-list.pdf', (string) $response->headers->get('content-disposition'));
    }
}
