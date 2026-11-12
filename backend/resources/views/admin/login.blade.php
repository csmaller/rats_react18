@extends('admin.layout')

@section('title', 'Log in')

@section('content')
    <section class="panel login">
        <h1>Admin login</h1>
        <p class="hint">Set list, and the rest of the band desk.</p>
        <form method="POST" action="{{ route('admin.login.store') }}">
            @csrf
            <label>
                Email
                <input type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
                @error('email')<span class="error">{{ $message }}</span>@enderror
            </label>
            <label>
                Password
                <input type="password" name="password" required autocomplete="current-password">
                @error('password')<span class="error">{{ $message }}</span>@enderror
            </label>
            <label class="check">
                <input type="checkbox" name="remember" value="1">
                Keep me logged in
            </label>
            <button type="submit">Enter</button>
        </form>
    </section>
@endsection
