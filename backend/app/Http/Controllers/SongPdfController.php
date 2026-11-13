<?php

namespace App\Http\Controllers;

use App\Models\EpkProfile;
use App\Models\Song;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class SongPdfController extends Controller
{
    public function __invoke(): Response
    {
        $songs = Song::query()
            ->where('is_published', true)
            ->orderByRaw('lower(title)')
            ->orderByRaw('lower(artist)')
            ->get(['title', 'artist']);

        return Pdf::loadView('songs.pdf', [
            'songs' => $songs,
            'profile' => EpkProfile::query()->first(),
            'logo' => $this->logoDataUri(),
        ])->download('rats-set-list.pdf');
    }

    private function logoDataUri(): ?string
    {
        $path = resource_path('images/logo_transparent.png');

        if (! is_file($path)) {
            return null;
        }

        return 'data:image/png;base64,'.base64_encode((string) file_get_contents($path));
    }
}
