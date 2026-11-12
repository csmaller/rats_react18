<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Admin') — RATS</title>
    <link rel="stylesheet" href="{{ asset('admin.css') }}">
</head>
<body>
    <header class="top">
        <a class="brand" href="{{ route('admin.songs.index') }}">RA<span>TS</span></a>
        <p>Backstage</p>
        @auth
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button class="ghost" type="submit">Log out</button>
            </form>
        @endauth
    </header>
    <main>
        @if (session('status'))
            <p class="flash">{{ session('status') }}</p>
        @endif
        @yield('content')
    </main>
</body>
</html>
