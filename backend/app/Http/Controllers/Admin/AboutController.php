<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AboutController extends Controller
{
    public function edit(): View
    {
        return view('admin.about', [
            'about' => AboutPage::query()->first() ?? new AboutPage(['headline' => 'Biography']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
        ]);

        $about = AboutPage::query()->first() ?? new AboutPage;
        $about->fill([
            'headline' => $about->headline ?: 'Biography',
            'tagline' => $about->tagline ?: 'Ski Town Party Music',
            'body' => trim($data['body']),
        ]);
        $about->save();

        return redirect()
            ->route('admin.about.edit')
            ->with('status', 'Biography saved. It shows on the EPK.');
    }
}
