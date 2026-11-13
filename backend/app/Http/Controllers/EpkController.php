<?php

namespace App\Http\Controllers;

use App\Models\AboutPage;
use App\Models\Biography;
use App\Models\EpkProfile;
use App\Models\MediaLink;
use Illuminate\Http\JsonResponse;

class EpkController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $about = AboutPage::query()->first();
        $profile = EpkProfile::query()->first();

        $listen = MediaLink::query()
            ->where('type', MediaLink::TYPE_AUDIO)
            ->where('platform', 'soundcloud')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get(['title', 'url']);

        $lineup = Biography::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['name', 'instruments', 'bio', 'photo_path'])
            ->map(fn (Biography $member): array => [
                'name' => $member->name,
                'instruments' => $member->instruments,
                'bio' => $member->bio,
                'photo' => $member->photo_path,
            ])
            ->values();

        $booking = null;
        if ($profile && ($profile->booking_name || $profile->booking_email || $profile->booking_phone)) {
            $booking = [
                'manager' => $profile->booking_name,
                'email' => $profile->booking_email,
                'phone' => $profile->booking_phone,
            ];
        }

        return response()->json([
            'biography' => $about?->body ?? '',
            'lineup' => $lineup,
            'listen' => $listen,
            'booking' => $booking,
        ]);
    }
}
