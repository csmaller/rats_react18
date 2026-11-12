@extends('admin.layout')

@section('title', 'Set list')

@section('content')
    <div class="toolbar">
        <h1>Set list</h1>
        <a class="button" href="{{ route('admin.songs.create') }}">Add song</a>
    </div>

    <form class="search" method="GET" action="{{ route('admin.songs.index') }}">
        <input type="search" name="q" value="{{ $search }}" placeholder="Search title or artist" aria-label="Search songs">
        <button class="ghost" type="submit">Search</button>
    </form>

    <p class="hint">{{ $songs->count() }} {{ $search !== '' ? 'matching' : 'songs on' }} the list.</p>

    <div class="panel">
        <table>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($songs as $song)
                    <tr>
                        <td>{{ $song->sort_order }}</td>
                        <td>{{ $song->title }}</td>
                        <td>{{ $song->artist }}</td>
                        <td>
                            <span class="badge {{ $song->is_published ? 'on' : '' }}">
                                {{ $song->is_published ? 'Live' : 'Hidden' }}
                            </span>
                        </td>
                        <td class="actions">
                            <a class="button ghost" href="{{ route('admin.songs.edit', $song) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.songs.destroy', $song) }}" onsubmit="return confirm('Remove this song from the set list?')">
                                @csrf
                                @method('DELETE')
                                <button class="danger" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No songs yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
