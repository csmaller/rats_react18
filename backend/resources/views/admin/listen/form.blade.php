@extends('admin.layout')

@section('title', $link->exists ? 'Edit SoundCloud link' : 'Add SoundCloud link')

@section('content')
    <div class="toolbar">
        <h1>{{ $link->exists ? 'Edit SoundCloud link' : 'Add SoundCloud link' }}</h1>
        <a class="button ghost" href="{{ route('admin.soundcloud.index') }}">Back to Listen</a>
    </div>

    <form class="panel" method="POST" action="{{ $link->exists ? route('admin.soundcloud.update', $link) : route('admin.soundcloud.store') }}">
        @csrf
        @if ($link->exists)
            @method('PUT')
        @endif

        <label>
            Title
            <input type="text" name="title" value="{{ old('title', $link->title) }}" required>
            @error('title')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            SoundCloud link
            <input type="url" name="url" value="{{ old('url', $link->url) }}" placeholder="https://soundcloud.com/..." required>
            @error('url')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Order
            <input type="number" name="sort_order" min="0" max="9999" value="{{ old('sort_order', $link->sort_order) }}">
            @error('sort_order')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label class="check">
            <input type="hidden" name="is_published" value="0">
            <input type="checkbox" name="is_published" value="1" @checked(filter_var(old('is_published', $link->is_published), FILTER_VALIDATE_BOOLEAN))>
            Show on the EPK
        </label>
        @error('is_published')<span class="error">{{ $message }}</span>@enderror

        <button type="submit">{{ $link->exists ? 'Save link' : 'Add link' }}</button>
    </form>
@endsection
