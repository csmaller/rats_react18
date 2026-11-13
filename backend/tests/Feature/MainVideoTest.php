<?php

namespace Tests\Feature;

use App\Models\FeaturedVideo;
use App\Models\User;
use App\Support\PublicUploads;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class MainVideoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        File::deleteDirectory(PublicUploads::root());
    }

    public function test_an_uploaded_video_replaces_the_previous_one(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/video', [
                'title' => 'Live at the lift',
                'video' => UploadedFile::fake()->create('first.mp4', 20, 'video/mp4'),
            ])
            ->assertRedirect('/admin/video');

        $first = FeaturedVideo::query()->first();
        $this->assertNotNull($first);
        $this->assertSame(FeaturedVideo::SOURCE_UPLOAD, $first->source);
        $this->assertTrue($first->is_active);
        $this->assertFileExists(PublicUploads::root().$first->file_path);

        $this->actingAs($admin)
            ->post('/admin/video', [
                'title' => 'Encore',
                'video' => UploadedFile::fake()->create('second.mp4', 20, 'video/mp4'),
            ])
            ->assertRedirect('/admin/video');

        $this->assertSame(1, FeaturedVideo::query()->count());
        $this->assertFileDoesNotExist(PublicUploads::root().$first->file_path);

        $second = FeaturedVideo::query()->first();
        $this->assertSame('Encore', $second->title);
        $this->assertNotSame($first->file_path, $second->file_path);

        $this->getJson('/api/main-video')
            ->assertOk()
            ->assertJsonPath('video.title', 'Encore')
            ->assertJsonPath('video.url', $second->file_path);

        $this->actingAs($admin)
            ->delete('/admin/video')
            ->assertRedirect('/admin/video');

        $this->assertSame(0, FeaturedVideo::query()->count());
        $this->assertFileDoesNotExist(PublicUploads::root().$second->file_path);
        $this->getJson('/api/main-video')->assertJsonPath('video', null);
    }

    public function test_a_non_video_file_is_rejected(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/video', [
                'title' => 'Nope',
                'video' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
            ])
            ->assertSessionHasErrors('video');

        $this->assertSame(0, FeaturedVideo::query()->count());
    }

    public function test_a_video_upload_can_report_progress_back_to_the_form(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->get('/admin/video')
            ->assertOk()
            ->assertSee('data-upload', false)
            ->assertSee('upload-progress', false);

        $this->actingAs($admin)
            ->postJson('/admin/video', [
                'title' => 'Lift line',
                'video' => UploadedFile::fake()->create('clip.mp4', 20, 'video/mp4'),
            ])
            ->assertOk()
            ->assertJsonPath('message', 'Main video saved. It replaces the YouTube clip on the home page.')
            ->assertJsonPath('redirect', route('admin.video.edit'));
    }
}
