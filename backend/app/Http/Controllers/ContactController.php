<?php

namespace App\Http\Controllers;

use App\Mail\ContactInquiry;
use App\Models\ContactMessage;
use App\Models\EpkProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = EpkProfile::query()->first();

        return response()->json([
            'note' => $profile?->contact_note ?? '',
            'name' => $profile?->booking_name,
            'phone' => $profile?->booking_phone,
            'email' => $profile?->booking_email,
            'location' => $profile?->hometown,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (filled($request->input('bot-field'))) {
            return response()->json(['message' => 'Thanks. Your message was sent.']);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $inquiry = ContactMessage::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => 'Website contact',
            'message' => $data['message'],
        ]);

        $recipients = config('rats.contact_recipients', [
            'contact@ratsband.com',
        ]);

        if (! is_array($recipients) || $recipients === []) {
            return response()->json([
                'message' => 'The message was saved, but no one is set up to receive it.',
            ], 500);
        }

        try {
            Mail::to($recipients)->send(new ContactInquiry($inquiry));
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'The message could not be sent. Please try again.',
            ], 502);
        }

        return response()->json([
            'message' => 'Thanks. Your message was sent.',
        ]);
    }
}
