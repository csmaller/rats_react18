@extends('admin.layout')

@section('title', $song->exists ? 'Edit song' : 'Add song')

@section('content')
    <div class="toolbar">
        <h1>{{ $song->exists ? 'Edit song' : 'Add song' }}</h1>
        <a class="button ghost" href="{{ route('admin.songs.index') }}">Back to set list</a>
    </div>

    <form class="panel" method="POST" action="{{ $song->exists ? route('admin.songs.update', $song) : route('admin.songs.store') }}">
        @csrf
        @if ($song->exists)
            @method('PUT')
        @endif

        <label>
            Title
            <input type="text" name="title" value="{{ old('title', $song->title) }}" required>
            @error('title')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Artist
            <input type="text" name="artist" value="{{ old('artist', $song->artist) }}" required>
            @error('artist')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Audio link
            <input type="url" name="audio_url" value="{{ old('audio_url', $song->audio_url) }}" placeholder="https://">
            @error('audio_url')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Set list order
            <input type="number" name="sort_order" min="0" max="9999" value="{{ old('sort_order', $song->sort_order) }}">
            @error('sort_order')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label class="check">
            <input type="hidden" name="is_published" value="0">
            <input type="checkbox" name="is_published" value="1" @checked(filter_var(old('is_published', $song->is_published), FILTER_VALIDATE_BOOLEAN))>
            Show on the site
        </label>
        @error('is_published')<span class="error">{{ $message }}</span>@enderror

        <button type="submit">{{ $song->exists ? 'Save song' : 'Add to set list' }}</button>
    </form>
@endsection
