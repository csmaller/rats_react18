<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SongRequest;
use App\Models\Song;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SongController extends Controller
{
    public function index(Request $request): View
    {
        $search = trim((string) $request->query('q', ''));

        $songs = Song::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('artist', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return view('admin.songs.index', [
            'songs' => $songs,
            'search' => $search,
        ]);
    }

    public function create(): View
    {
        return view('admin.songs.form', [
            'song' => new Song(['is_published' => true]),
        ]);
    }

    public function store(SongRequest $request): RedirectResponse|JsonResponse
    {
        $song = Song::query()->create($this->payload($request));

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Song added to the set list.',
                'song' => $this->songResource($song),
            ], 201);
        }

        return redirect()
            ->route('admin.songs.index')
            ->with('status', 'Song added to the set list.');
    }

    public function edit(Song $song): View
    {
        return view('admin.songs.form', [
            'song' => $song,
        ]);
    }

    public function update(SongRequest $request, Song $song): RedirectResponse|JsonResponse
    {
        $song->update($this->payload($request, $song));

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Song updated.',
                'song' => $this->songResource($song),
            ]);
        }

        return redirect()
            ->route('admin.songs.index')
            ->with('status', 'Song updated.');
    }

    public function destroy(Song $song): RedirectResponse
    {
        $song->delete();

        return redirect()
            ->route('admin.songs.index')
            ->with('status', 'Song removed from the set list.');
    }

    /**
     * @return array{title: string, artist: string, audio_url: ?string, sort_order: int, is_published: bool}
     */
    private function payload(SongRequest $request, ?Song $song = null): array
    {
        $data = $request->validated();

        if ($data['sort_order'] === null) {
            $data['sort_order'] = $song?->sort_order ?? ((int) Song::query()->max('sort_order') + 1);
        }

        return $data;
    }

    /**
     * @return array{id: int, title: string, artist: string, audio_url: ?string, sort_order: int, is_published: bool, edit_url: string, update_url: string, destroy_url: string}
     */
    private function songResource(Song $song): array
    {
        return [
            'id' => $song->id,
            'title' => $song->title,
            'artist' => $song->artist,
            'audio_url' => $song->audio_url,
            'sort_order' => $song->sort_order,
            'is_published' => $song->is_published,
            'edit_url' => route('admin.songs.edit', $song),
            'update_url' => route('admin.songs.update', $song),
            'destroy_url' => route('admin.songs.destroy', $song),
        ];
    }
}
