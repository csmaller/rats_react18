@extends('admin.layout')

@section('title', 'Biography')

@section('content')
    <div class="toolbar">
        <h1>Biography</h1>
    </div>

    <p class="hint">This is the about biography on the EPK.</p>

    <form class="panel" method="POST" action="{{ route('admin.about.update') }}">
        @csrf
        @method('PUT')

        <label>
            Biography
            <textarea name="body" required>{{ old('body', $about->body) }}</textarea>
            @error('body')<span class="error">{{ $message }}</span>@enderror
        </label>

        <button type="submit">Save biography</button>
    </form>
@endsection
