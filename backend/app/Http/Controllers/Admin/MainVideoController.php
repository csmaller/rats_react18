<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeaturedVideo;
use App\Support\PublicUploads;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MainVideoController extends Controller
{
    public function edit(): View
    {
        return view('admin.video', [
            'video' => $this->current(),
        ]);
    }

    public function update(Request $request): RedirectResponse|JsonResponse
    {
        $current = $this->current();

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'video' => [
                $current?->file_path ? 'nullable' : 'required',
                'file',
                'mimes:mp4,webm,mov',
                'max:524288',
            ],
        ]);

        $path = $current?->file_path;

        if ($request->hasFile('video')) {
            PublicUploads::delete($path);
            $path = PublicUploads::store($request->file('video'), 'videos');
        }

        FeaturedVideo::query()
            ->when($current, fn ($query) => $query->whereKeyNot($current->id))
            ->get()
            ->each(function (FeaturedVideo $extra) {
                PublicUploads::delete($extra->file_path);
                $extra->delete();
            });

        $video = $current ?? new FeaturedVideo;
        $video->fill([
            'title' => $data['title'] !== null && $data['title'] !== '' ? $data['title'] : 'RATS',
            'source' => FeaturedVideo::SOURCE_UPLOAD,
            'embed_url' => null,
            'file_path' => $path,
            'is_active' => true,
        ]);
        $video->save();

        $message = 'Main video saved. It replaces the YouTube clip on the home page.';

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'redirect' => route('admin.video.edit'),
            ]);
        }

        return redirect()
            ->route('admin.video.edit')
            ->with('status', $message);
    }

    public function destroy(): RedirectResponse
    {
        $video = $this->current();

        if ($video) {
            PublicUploads::delete($video->file_path);
            $video->delete();
        }

        return redirect()
            ->route('admin.video.edit')
            ->with('status', 'Main video removed.');
    }

    private function current(): ?FeaturedVideo
    {
        return FeaturedVideo::query()->orderByDesc('is_active')->orderByDesc('id')->first();
    }
}
