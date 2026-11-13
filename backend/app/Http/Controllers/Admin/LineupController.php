<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LineupMemberRequest;
use App\Models\Biography;
use App\Models\BiographyPhoto;
use App\Support\PublicUploads;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\View\View;

class LineupController extends Controller
{
    public function index(): View
    {
        return view('admin.lineup.index', [
            'members' => Biography::query()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.lineup.form', [
            'member' => new Biography(['is_published' => true]),
        ]);
    }

    public function store(LineupMemberRequest $request): RedirectResponse|JsonResponse
    {
        $member = Biography::query()->create($this->payload($request));
        $this->syncPhotos($request, $member);

        return $this->saved('Lineup member added.');
    }

    public function edit(Biography $lineup): View
    {
        $lineup->load('photos');

        return view('admin.lineup.form', [
            'member' => $lineup,
        ]);
    }

    public function update(LineupMemberRequest $request, Biography $lineup): RedirectResponse|JsonResponse
    {
        $lineup->update($this->payload($request, $lineup));
        $this->syncPhotos($request, $lineup);

        return $this->saved('Lineup member updated.');
    }

    public function destroy(Biography $lineup): RedirectResponse
    {
        $lineup->load('photos');

        foreach ($lineup->photos as $photo) {
            PublicUploads::delete($photo->path);
        }

        PublicUploads::delete($lineup->photo_path);
        $lineup->delete();

        return redirect()
            ->route('admin.lineup.index')
            ->with('status', 'Lineup member removed.');
    }

    /**
     * @return array{name: string, slug: string, instruments: string, role: string, bio: string, sort_order: int, is_published: bool}
     */
    private function payload(LineupMemberRequest $request, ?Biography $member = null): array
    {
        $data = $request->validated();

        if ($data['sort_order'] === null) {
            $data['sort_order'] = $member?->sort_order ?? ((int) Biography::query()->max('sort_order') + 1);
        }

        return [
            'name' => $data['name'],
            'slug' => $this->slug($data['name'], $member?->id),
            'instruments' => $data['instruments'],
            'role' => $data['instruments'],
            'bio' => $data['bio'],
            'sort_order' => $data['sort_order'],
            'is_published' => $data['is_published'],
        ];
    }

    private function syncPhotos(LineupMemberRequest $request, Biography $member): void
    {
        $remove = collect($request->input('remove', []))
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $id > 0);

        $removed = $member->photos()->whereIn('id', $remove)->get();

        foreach ($removed as $photo) {
            PublicUploads::delete($photo->path);
            $photo->delete();
        }

        $created = [];
        $sort = (int) $member->photos()->max('sort_order');

        foreach ($request->file('photos', []) as $file) {
            $sort++;
            $created[] = $member->photos()->create([
                'path' => PublicUploads::store($file, 'images'),
                'is_main' => false,
                'sort_order' => $sort,
            ]);
        }

        $photos = $member->photos()->get();

        if ($photos->isEmpty()) {
            $member->update(['photo_path' => null]);

            return;
        }

        $choice = (string) $request->input('main_photo', '');
        $main = null;

        if ($choice === 'new' && $created !== []) {
            $main = $created[0];
        } elseif (ctype_digit($choice)) {
            $main = $photos->firstWhere('id', (int) $choice);
        }

        if (! $main instanceof BiographyPhoto) {
            $main = $photos->firstWhere('is_main', true) ?? $photos->first();
        }

        $member->photos()->whereKeyNot($main->id)->update(['is_main' => false]);
        $main->update(['is_main' => true]);
        $member->update(['photo_path' => $main->path]);
    }

    private function saved(string $message): RedirectResponse|JsonResponse
    {
        if (request()->expectsJson()) {
            return response()->json([
                'message' => $message,
                'redirect' => route('admin.lineup.index'),
            ]);
        }

        return redirect()
            ->route('admin.lineup.index')
            ->with('status', $message);
    }

    private function slug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'member';
        $slug = $base;
        $suffix = 2;

        while (Biography::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
