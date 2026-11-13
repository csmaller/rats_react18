<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LineupMemberRequest;
use App\Models\Biography;
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
        Biography::query()->create($this->payload($request));

        return $this->saved('Lineup member added.');
    }

    public function edit(Biography $lineup): View
    {
        return view('admin.lineup.form', [
            'member' => $lineup,
        ]);
    }

    public function update(LineupMemberRequest $request, Biography $lineup): RedirectResponse|JsonResponse
    {
        $lineup->update($this->payload($request, $lineup));

        return $this->saved('Lineup member updated.');
    }

    public function destroy(Biography $lineup): RedirectResponse
    {
        PublicUploads::delete($lineup->photo_path);
        $lineup->delete();

        return redirect()
            ->route('admin.lineup.index')
            ->with('status', 'Lineup member removed.');
    }

    /**
     * @return array{name: string, slug: string, instruments: string, role: string, bio: string, photo_path: ?string, sort_order: int, is_published: bool}
     */
    private function payload(LineupMemberRequest $request, ?Biography $member = null): array
    {
        $data = $request->validated();

        if ($data['sort_order'] === null) {
            $data['sort_order'] = $member?->sort_order ?? ((int) Biography::query()->max('sort_order') + 1);
        }

        $photo = $member?->photo_path;

        if ($request->hasFile('photo')) {
            PublicUploads::delete($photo);
            $photo = PublicUploads::store($request->file('photo'), 'images');
        }

        return [
            'name' => $data['name'],
            'slug' => $this->slug($data['name'], $member?->id),
            'instruments' => $data['instruments'],
            'role' => $data['instruments'],
            'bio' => $data['bio'],
            'photo_path' => $photo,
            'sort_order' => $data['sort_order'],
            'is_published' => $data['is_published'],
        ];
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
