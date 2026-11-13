@extends('admin.layout')

@section('title', 'Booking')

@section('content')
    <div class="toolbar">
        <h1>Booking</h1>
    </div>

    <p class="hint">This is the left side of the contact section, and the name, email, and phone also show under Booking on the EPK.</p>

    <form class="panel" method="POST" action="{{ route('admin.booking.update') }}">
        @csrf
        @method('PUT')

        <label>
            Note
            <textarea name="contact_note">{{ old('contact_note', $booking->contact_note) }}</textarea>
            @error('contact_note')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Name
            <input type="text" name="booking_name" value="{{ old('booking_name', $booking->booking_name) }}">
            @error('booking_name')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Phone
            <input type="text" name="booking_phone" value="{{ old('booking_phone', $booking->booking_phone) }}">
            @error('booking_phone')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Email
            <input type="email" name="booking_email" value="{{ old('booking_email', $booking->booking_email) }}">
            @error('booking_email')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Location
            <input type="text" name="hometown" value="{{ old('hometown', $booking->hometown) }}">
            @error('hometown')<span class="error">{{ $message }}</span>@enderror
        </label>

        <button type="submit">Save booking</button>
    </form>
@endsection
