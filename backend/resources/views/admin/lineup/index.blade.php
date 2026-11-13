@extends('admin.layout')

@section('title', 'Lineup')

@section('content')
    <div class="toolbar">
        <h1>Lineup</h1>
        <a class="button" href="{{ route('admin.lineup.create') }}">Add member</a>
    </div>

    <p class="hint">Name, instruments, short bio, and photos show on the site. One photo is the main image. With no published members, Lineup stays hidden.</p>

    <div class="panel">
        <table>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Name</th>
                    <th>Instruments</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($members as $member)
                    <tr>
                        <td>{{ $member->sort_order }}</td>
                        <td>{{ $member->name }}</td>
                        <td>{{ $member->instruments }}</td>
                        <td>
                            <span class="badge {{ $member->is_published ? 'on' : '' }}">
                                {{ $member->is_published ? 'Live' : 'Hidden' }}
                            </span>
                        </td>
                        <td class="actions">
                            <a class="button ghost" href="{{ route('admin.lineup.edit', $member) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.lineup.destroy', $member) }}" onsubmit="return confirm('Remove this member from the lineup?')">
                                @csrf
                                @method('DELETE')
                                <button class="danger" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No lineup members yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
