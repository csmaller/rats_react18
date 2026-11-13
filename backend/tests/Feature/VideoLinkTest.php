<?php

namespace Tests\Feature;

use App\Models\MediaLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class VideoLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_video_section_starts_with_the_two_youtube_shorts(): void
    {
        $this->getJson('/api/videos')
            ->assertOk()
            ->assertJsonCount(2, 'videos')
            ->assertJsonPath('videos.0.title', 'Walking on Sunshine :Kimball Arts Festival Park City 2025')
            ->assertJsonPath('videos.0.embed_url', 'https://www.youtube.com/embed/bbE6UXscLHk')
            ->assertJsonPath('videos.1.title', '90s Medley')
            ->assertJsonPath('videos.1.embed_url', 'https://www.youtube.com/embed/LhsGpiRIk4A');
    }

    public function test_a_non_youtube_link_is_rejected(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/youtube', [
                'title' => 'Not a video',
                'url' => 'https://soundcloud.com/rats/demo',
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('url');
    }

    public function test_a_youtube_link_is_rejected_when_the_video_does_not_exist(): void
    {
        Http::fake([
            'www.youtube.com/oembed*' => Http::response([], 404),
        ]);

        $this->actingAs(User::factory()->create())
            ->post('/admin/youtube', [
                'title' => 'Missing',
                'url' => 'https://www.youtube.com/watch?v=aaaaaaaaaaa',
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('url');

        $this->assertSame(0, MediaLink::query()->where('title', 'Missing')->count());
    }

    public function test_a_verified_youtube_link_can_be_saved(): void
    {
        Http::fake([
            'www.youtube.com/oembed*' => Http::response(['title' => '90s Medley'], 200),
        ]);

        $this->actingAs(User::factory()->create())
            ->post('/admin/youtube', [
                'title' => '90s Medley',
                'url' => 'https://youtu.be/LhsGpiRIk4A',
                'is_published' => '1',
            ])
            ->assertRedirect('/admin/youtube');

        $this->assertNotNull(
            MediaLink::query()->where('platform', 'youtube')->where('url', 'https://youtu.be/LhsGpiRIk4A')->first()
        );
    }
}
