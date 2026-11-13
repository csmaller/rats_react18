<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SoundCloudLinkRequest;
use App\Models\MediaLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SoundCloudLinkController extends Controller
{
    public function index(): View
    {
        return view('admin.listen.index', [
            'links' => $this->query()->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.listen.form', [
            'link' => new MediaLink(['is_published' => true]),
        ]);
    }

    public function store(SoundCloudLinkRequest $request): RedirectResponse
    {
        MediaLink::query()->create($this->payload($request));

        return redirect()
            ->route('admin.soundcloud.index')
            ->with('status', 'SoundCloud link added. It shows under Listen on the EPK.');
    }

    public function edit(MediaLink $soundcloud): View
    {
        return view('admin.listen.form', [
            'link' => $this->soundCloud($soundcloud),
        ]);
    }

    public function update(SoundCloudLinkRequest $request, MediaLink $soundcloud): RedirectResponse
    {
        $this->soundCloud($soundcloud)->update($this->payload($request, $soundcloud));

        return redirect()
            ->route('admin.soundcloud.index')
            ->with('status', 'SoundCloud link updated.');
    }

    public function destroy(MediaLink $soundcloud): RedirectResponse
    {
        $this->soundCloud($soundcloud)->delete();

        return redirect()
            ->route('admin.soundcloud.index')
            ->with('status', 'SoundCloud link removed.');
    }

    /**
     * @return array{type: string, title: string, url: string, platform: string, sort_order: int, is_published: bool}
     */
    private function payload(SoundCloudLinkRequest $request, ?MediaLink $link = null): array
    {
        $data = $request->validated();

        if ($data['sort_order'] === null) {
            $data['sort_order'] = $link?->sort_order ?? ((int) $this->query()->max('sort_order') + 1);
        }

        return [
            'type' => MediaLink::TYPE_AUDIO,
            'title' => $data['title'],
            'url' => $data['url'],
            'platform' => 'soundcloud',
            'sort_order' => $data['sort_order'],
            'is_published' => $data['is_published'],
        ];
    }

    private function query()
    {
        return MediaLink::query()
            ->where('type', MediaLink::TYPE_AUDIO)
            ->where('platform', 'soundcloud')
            ->orderBy('sort_order')
            ->orderBy('title');
    }

    private function soundCloud(MediaLink $link): MediaLink
    {
        abort_unless(
            $link->type === MediaLink::TYPE_AUDIO && $link->platform === 'soundcloud',
            404,
        );

        return $link;
    }
}
