@extends('admin.layout')

@section('title', 'Main video')

@section('content')
    <div class="toolbar">
        <h1>Main video</h1>
    </div>

    <p class="hint">One video only. Uploading a new file replaces the clip under the headline and removes the YouTube embed. Files are saved in the videos folder.</p>

    <form class="panel" method="POST" action="{{ route('admin.video.update') }}" enctype="multipart/form-data" data-upload>
        @csrf

        <label>
            Title
            <input type="text" name="title" value="{{ old('title', $video->title ?? 'RATS') }}" maxlength="255">
            @error('title')<span class="error">{{ $message }}</span>@enderror
        </label>

        <label>
            Video file
            <input type="file" name="video" accept="video/mp4,video/webm,video/quicktime">
            @error('video')<span class="error">{{ $message }}</span>@enderror
        </label>

        @if ($video?->file_path)
            <div class="preview">
                <video src="{{ $video->file_path }}" controls></video>
            </div>
        @endif

        <div class="upload-progress" hidden>
            <div class="upload-progress-bar"></div>
        </div>
        <p class="hint upload-progress-label" hidden>0%</p>

        <button type="submit">{{ $video?->file_path ? 'Replace video' : 'Upload video' }}</button>
    </form>

    @if ($video?->file_path)
        <form method="POST" action="{{ route('admin.video.destroy') }}" onsubmit="return confirm('Remove the main video?')">
            @csrf
            @method('DELETE')
            <button class="danger" type="submit">Remove video</button>
        </form>
    @endif
@endsection
