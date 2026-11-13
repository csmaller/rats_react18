<?php

use App\Http\Controllers\EpkController;
use App\Http\Requests\Admin\YouTubeLinkRequest;
use App\Models\EpkProfile;
use App\Models\FeaturedVideo;
use App\Models\MediaLink;
use App\Models\Song;
use Illuminate\Support\Facades\Route;

Route::get('/songs', function () {
    return Song::query()
        ->where('is_published', true)
        ->orderBy('sort_order')
        ->orderBy('title')
        ->get(['id', 'title', 'artist']);
});

Route::get('/epk', EpkController::class);

Route::get('/contact', function () {
    $profile = EpkProfile::query()->first();

    return [
        'note' => $profile?->contact_note ?? '',
        'name' => $profile?->booking_name,
        'phone' => $profile?->booking_phone,
        'email' => $profile?->booking_email,
        'location' => $profile?->hometown,
    ];
});

Route::get('/videos', function () {
    return [
        'videos' => MediaLink::query()
            ->where('type', MediaLink::TYPE_VIDEO)
            ->where('platform', 'youtube')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get(['title', 'url'])
            ->map(function (MediaLink $link): ?array {
                $id = YouTubeLinkRequest::videoId($link->url);

                if ($id === null) {
                    return null;
                }

                return [
                    'title' => $link->title,
                    'url' => $link->url,
                    'embed_url' => 'https://www.youtube.com/embed/'.$id,
                ];
            })
            ->filter()
            ->values(),
    ];
});

Route::get('/main-video', function () {
    $video = FeaturedVideo::query()
        ->where('is_active', true)
        ->where('source', FeaturedVideo::SOURCE_UPLOAD)
        ->whereNotNull('file_path')
        ->first();

    return [
        'video' => $video ? [
            'title' => $video->title,
            'url' => $video->file_path,
        ] : null,
    ];
});
