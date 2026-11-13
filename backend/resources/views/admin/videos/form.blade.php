@extends('admin.layout')

@section('title', $link->exists ? 'Edit video link' : 'Add video link')

@section('content')
    <div class="toolbar">
        <h1>{{ $link->exists ? 'Edit video link' : 'Add video link' }}</h1>
        <a class="button ghost" href="{{ route('admin.youtube.index') }}">Back to videos</a>
    </div>

    <form class="panel" method="POST" action="{{ $link->exists ? route('admin.youtube.update', $link) : route('admin.youtube.store') }}">
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
            YouTube link
            <input type="url" name="url" value="{{ old('url', $link->url) }}" placeholder="https://www.youtube.com/..." required>
            @error('url')<span class="error">{{ $message }}</span>@enderror
        </label>
        <p class="hint">YouTube only. The link is checked with YouTube before it is saved.</p>

        <label>
            Order
            <input type="number" name="sort_order" min="0" max="9999" value="{{ old('sort_order', $link->sort_order) }}">
            @error('sort_order')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label class="check">
            <input type="hidden" name="is_published" value="0">
            <input type="checkbox" name="is_published" value="1" @checked(filter_var(old('is_published', $link->is_published), FILTER_VALIDATE_BOOLEAN))>
            Show on the site
        </label>

        <button type="submit">{{ $link->exists ? 'Save link' : 'Add link' }}</button>
    </form>
@endsection
