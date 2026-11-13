@extends('admin.layout')

@section('title', 'Listen')

@section('content')
    <div class="toolbar">
        <h1>Listen</h1>
        <a class="button" href="{{ route('admin.soundcloud.create') }}">Add SoundCloud link</a>
    </div>

    <p class="hint">These sit under the biography on the EPK. With no published links, Listen stays hidden.</p>

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
                            <a class="button ghost" href="{{ route('admin.soundcloud.edit', $link) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.soundcloud.destroy', $link) }}" onsubmit="return confirm('Remove this SoundCloud link?')">
                                @csrf
                                @method('DELETE')
                                <button class="danger" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No SoundCloud links yet. Listen is hidden on the EPK.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
