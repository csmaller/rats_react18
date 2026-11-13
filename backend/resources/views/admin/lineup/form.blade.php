@extends('admin.layout')

@section('title', $member->exists ? 'Edit member' : 'Add member')

@section('content')
    <div class="toolbar">
        <h1>{{ $member->exists ? 'Edit member' : 'Add member' }}</h1>
        <a class="button ghost" href="{{ route('admin.lineup.index') }}">Back to lineup</a>
    </div>

    <form class="panel" method="POST" enctype="multipart/form-data" data-upload action="{{ $member->exists ? route('admin.lineup.update', $member) : route('admin.lineup.store') }}">
        @csrf
        @if ($member->exists)
            @method('PUT')
        @endif

        <label>
            Name
            <input type="text" name="name" value="{{ old('name', $member->name) }}" required>
            @error('name')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Instruments played
            <input type="text" name="instruments" value="{{ old('instruments', $member->instruments) }}" required>
            @error('instruments')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Short bio
            <textarea class="short" name="bio" rows="4" maxlength="500" required>{{ old('bio', $member->bio) }}</textarea>
            @error('bio')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Portrait
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp">
            @error('photo')<span class="error">{{ $message }}</span>@enderror
        </label>
        <p class="hint">Use a portrait photo: taller than it is wide. A head-and-shoulders shot fits the lineup best.</p>
        @if ($member->photo_path)
            <img class="portrait" src="{{ $member->photo_path }}" alt="">
        @endif

        <label>
            Order
            <input type="number" name="sort_order" min="0" max="9999" value="{{ old('sort_order', $member->sort_order) }}">
            @error('sort_order')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label class="check">
            <input type="hidden" name="is_published" value="0">
            <input type="checkbox" name="is_published" value="1" @checked(filter_var(old('is_published', $member->is_published), FILTER_VALIDATE_BOOLEAN))>
            Show on the EPK
        </label>

        <div class="upload-progress" hidden>
            <div class="upload-progress-bar"></div>
        </div>
        <p class="hint upload-progress-label" hidden>0%</p>

        <button type="submit">{{ $member->exists ? 'Save member' : 'Add member' }}</button>
    </form>
@endsection
