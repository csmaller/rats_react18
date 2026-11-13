<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EpkProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BookingController extends Controller
{
    public function edit(): View
    {
        return view('admin.booking', [
            'booking' => EpkProfile::query()->first() ?? new EpkProfile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'contact_note' => ['nullable', 'string', 'max:2000'],
            'booking_name' => ['nullable', 'string', 'max:255'],
            'booking_phone' => ['nullable', 'string', 'max:40'],
            'booking_email' => ['nullable', 'email', 'max:255'],
            'hometown' => ['nullable', 'string', 'max:255'],
        ]);

        $profile = EpkProfile::query()->first() ?? new EpkProfile;
        $profile->fill([
            'band_name' => $profile->band_name ?: 'RATS',
            'short_bio' => $profile->short_bio ?? '',
            'long_bio' => $profile->long_bio ?? '',
            'contact_note' => $request->exists('contact_note')
                ? $this->blankToNull($data['contact_note'] ?? null)
                : $profile->contact_note,
            'booking_name' => $request->exists('booking_name')
                ? $this->blankToNull($data['booking_name'] ?? null)
                : $profile->booking_name,
            'booking_phone' => $request->exists('booking_phone')
                ? $this->blankToNull($data['booking_phone'] ?? null)
                : $profile->booking_phone,
            'booking_email' => $request->exists('booking_email')
                ? $this->blankToNull($data['booking_email'] ?? null)
                : $profile->booking_email,
            'hometown' => $request->exists('hometown')
                ? $this->blankToNull($data['hometown'] ?? null)
                : $profile->hometown,
        ]);
        $profile->save();

        return redirect()
            ->route('admin.booking.edit')
            ->with('status', 'Booking info saved.');
    }

    private function blankToNull(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
