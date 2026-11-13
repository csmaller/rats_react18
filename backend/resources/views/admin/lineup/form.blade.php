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

        <fieldset class="photos">
            <legend>Photos</legend>
            @if ($member->exists)
                <div class="photo-grid">
                    @foreach ($member->photos as $photo)
                        <div class="photo-choice">
                            <img class="portrait" src="{{ $photo->path }}" alt="">
                            <label class="check">
                                <input
                                    type="radio"
                                    name="main_photo"
                                    value="{{ $photo->id }}"
                                    @checked((string) old('main_photo', $photo->is_main ? $photo->id : '') === (string) $photo->id)
                                >
                                Main image
                            </label>
                            <label class="check">
                                <input type="checkbox" name="remove[]" value="{{ $photo->id }}" @checked(in_array($photo->id, array_map('intval', (array) old('remove', [])), true))>
                                Remove
                            </label>
                        </div>
                    @endforeach
                </div>
            @endif
            <label>
                Add photos
                <input type="file" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple>
                @error('photos')<span class="error">{{ $message }}</span>@enderror
                @error('photos.*')<span class="error">{{ $message }}</span>@enderror
            </label>
            <label class="check">
                <input type="radio" name="main_photo" value="new" @checked(old('main_photo', $member->exists && $member->photos->isNotEmpty() ? '' : 'new') === 'new')>
                Use the first new photo as the main image
            </label>
            <p class="hint">Upload one or more photos. One photo is the main image, and it is the portrait on the site.</p>
        </fieldset>

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
