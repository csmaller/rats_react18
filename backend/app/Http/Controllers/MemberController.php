<?php

namespace App\Http\Controllers;

use App\Models\Biography;
use Illuminate\Http\JsonResponse;

class MemberController extends Controller
{
    public function show(Biography $biography): JsonResponse
    {
        abort_unless($biography->is_published, 404);

        $biography->load('photos');

        return response()->json([
            'name' => $biography->name,
            'slug' => $biography->slug,
            'instruments' => $biography->instruments,
            'bio' => $biography->bio,
            'photo' => $biography->photo_path,
            'photos' => $biography->publicPhotos(),
        ]);
    }
}
