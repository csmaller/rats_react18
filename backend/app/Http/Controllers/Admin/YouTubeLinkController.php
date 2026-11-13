<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\YouTubeLinkRequest;
use App\Models\MediaLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class YouTubeLinkController extends Controller
{
    public function index(): View
    {
        return view('admin.videos.index', [
            'links' => $this->query()->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.videos.form', [
            'link' => new MediaLink(['is_published' => true]),
        ]);
    }

    public function store(YouTubeLinkRequest $request): RedirectResponse
    {
        MediaLink::query()->create($this->payload($request));

        return redirect()
            ->route('admin.youtube.index')
            ->with('status', 'Video link added. It shows in the Videos section.');
    }

    public function edit(MediaLink $youtube): View
    {
        return view('admin.videos.form', [
            'link' => $this->video($youtube),
        ]);
    }

    public function update(YouTubeLinkRequest $request, MediaLink $youtube): RedirectResponse
    {
        $this->video($youtube)->update($this->payload($request, $youtube));

        return redirect()
            ->route('admin.youtube.index')
            ->with('status', 'Video link updated.');
    }

    public function destroy(MediaLink $youtube): RedirectResponse
    {
        $this->video($youtube)->delete();

        return redirect()
            ->route('admin.youtube.index')
            ->with('status', 'Video link removed.');
    }

    /**
     * @return array{type: string, title: string, url: string, platform: string, sort_order: int, is_published: bool}
     */
    private function payload(YouTubeLinkRequest $request, ?MediaLink $link = null): array
    {
        $data = $request->validated();

        if ($data['sort_order'] === null) {
            $data['sort_order'] = $link?->sort_order ?? ((int) $this->query()->max('sort_order') + 1);
        }

        return [
            'type' => MediaLink::TYPE_VIDEO,
            'title' => $data['title'],
            'url' => $data['url'],
            'platform' => 'youtube',
            'sort_order' => $data['sort_order'],
            'is_published' => $data['is_published'],
        ];
    }

    private function query()
    {
        return MediaLink::query()
            ->where('type', MediaLink::TYPE_VIDEO)
            ->where('platform', 'youtube')
            ->orderBy('sort_order')
            ->orderBy('title');
    }

    private function video(MediaLink $link): MediaLink
    {
        abort_unless(
            $link->type === MediaLink::TYPE_VIDEO && $link->platform === 'youtube',
            404,
        );

        return $link;
    }
}
