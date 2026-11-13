@extends('admin.layout')

@section('title', 'Videos')

@section('content')
    <div class="toolbar">
        <h1>Videos</h1>
        <a class="button" href="{{ route('admin.youtube.create') }}">Add video link</a>
    </div>

    <p class="hint">YouTube links show in the Videos section under the main clip. With no published links, that section stays hidden.</p>

    <div class="panel">
        <table>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($links as $link)
                    <tr>
                        <td>{{ $link->sort_order }}</td>
                        <td>{{ $link->title }}</td>
                        <td><a href="{{ $link->url }}">{{ $link->url }}</a></td>
                        <td>
                            <span class="badge {{ $link->is_published ? 'on' : '' }}">
                                {{ $link->is_published ? 'Live' : 'Hidden' }}
                            </span>
                        </td>
                        <td class="actions">
                            <a class="button ghost" href="{{ route('admin.youtube.edit', $link) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.youtube.destroy', $link) }}" onsubmit="return confirm('Remove this video link?')">
                                @csrf
                                @method('DELETE')
                                <button class="danger" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No video links yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
