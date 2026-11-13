@extends('admin.layout')

@section('title', 'Set list')

@section('content')
    <div class="toolbar">
        <h1>Set list</h1>
    </div>

    <form id="add-song" class="panel add-song" method="POST" action="{{ route('admin.songs.store') }}">
        @csrf
        <div class="add-song-fields">
            <label>
                Title
                <input type="text" name="title" required>
            </label>
            <label>
                Artist
                <input type="text" name="artist" required>
            </label>
            <label>
                Audio link
                <input type="url" name="audio_url" placeholder="https://">
            </label>
            <label>
                Order
                <input type="number" name="sort_order" min="0" max="9999">
            </label>
            <label class="check">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" checked>
                Show on the site
            </label>
            <button type="submit">Add to set list</button>
        </div>
        <p id="add-song-error" class="error" hidden></p>
    </form>

    <form class="search" method="GET" action="{{ route('admin.songs.index') }}">
        <input type="search" name="q" value="{{ $search }}" placeholder="Search title or artist" aria-label="Search songs">
        <button class="ghost" type="submit">Search</button>
    </form>

    <p class="hint"><span id="song-count">{{ $songs->count() }}</span> {{ $search !== '' ? 'matching' : 'songs on' }} the list. Double-click a title, artist, or link to edit it. It saves when you click away.</p>

    <div class="panel">
        <table>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="set-list">
                @forelse ($songs as $song)
                    <tr data-sort="{{ $song->sort_order }}" data-published="{{ $song->is_published ? '1' : '0' }}" data-update-url="{{ route('admin.songs.update', $song) }}">
                        <td>{{ $song->sort_order }}</td>
                        <td class="editable" data-field="title" data-value="{{ $song->title }}">{{ $song->title }}</td>
                        <td class="editable" data-field="artist" data-value="{{ $song->artist }}">{{ $song->artist }}</td>
                        <td class="editable" data-field="audio_url" data-value="{{ $song->audio_url }}">{{ $song->audio_url ?: 'Add link' }}</td>
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
                    <tr id="songs-empty">
                        <td colspan="6">No songs yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <script>
        const csrf = document.querySelector('#add-song input[name="_token"]').value;
        const list = document.getElementById('set-list');

        const fieldValue = (row, field) => row.querySelector(`[data-field="${field}"]`)?.dataset.value || '';

        const paintCell = (cell) => {
            const value = cell.dataset.value || '';
            cell.textContent = value || (cell.dataset.field === 'audio_url' ? 'Add link' : '');
        };

        const saveCell = async (cell, input) => {
            const row = cell.closest('tr');
            const field = cell.dataset.field;
            const next = input.value.trim();

            if (input.dataset.cancel === '1' || next === (cell.dataset.value || '')) {
                paintCell(cell);
                return;
            }

            const response = await fetch(row.dataset.updateUrl, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    title: field === 'title' ? next : fieldValue(row, 'title'),
                    artist: field === 'artist' ? next : fieldValue(row, 'artist'),
                    audio_url: field === 'audio_url' ? next : fieldValue(row, 'audio_url'),
                    sort_order: Number(row.dataset.sort),
                    is_published: row.dataset.published === '1',
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                paintCell(cell);
                const note = document.createElement('span');
                note.className = 'error';
                const messages = data.errors ? Object.values(data.errors).flat() : [data.message || 'Could not save that change.'];
                note.textContent = messages.join(' ');
                cell.append(document.createElement('br'), note);
                return;
            }

            cell.dataset.value = data.song[field] || '';
            paintCell(cell);
        };

        const editCell = (cell) => {
            if (cell.querySelector('input')) {
                return;
            }

            const input = document.createElement('input');
            input.type = cell.dataset.field === 'audio_url' ? 'url' : 'text';
            input.value = cell.dataset.value || '';
            cell.textContent = '';
            cell.append(input);
            input.focus();
            input.select();
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    input.blur();
                }
                if (event.key === 'Escape') {
                    input.dataset.cancel = '1';
                    input.blur();
                }
            });
            input.addEventListener('blur', () => saveCell(cell, input));
        };

        const bindRow = (row) => {
            row.querySelectorAll('.editable').forEach((cell) => {
                cell.addEventListener('dblclick', () => editCell(cell));
            });
        };

        list.querySelectorAll('tr[data-update-url]').forEach(bindRow);

        document.getElementById('add-song').addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const error = document.getElementById('add-song-error');
            error.hidden = true;
            error.textContent = '';

            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new FormData(form),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const messages = data.errors ? Object.values(data.errors).flat() : [data.message || 'Could not add that song.'];
                error.textContent = messages.join(' ');
                error.hidden = false;
                return;
            }

            const song = data.song;
            document.getElementById('songs-empty')?.remove();

            const row = document.createElement('tr');
            row.dataset.sort = String(song.sort_order);
            row.dataset.published = song.is_published ? '1' : '0';
            row.dataset.updateUrl = song.update_url;

            const order = document.createElement('td');
            order.textContent = song.sort_order;

            const cell = (field, value) => {
                const column = document.createElement('td');
                column.className = 'editable';
                column.dataset.field = field;
                column.dataset.value = value || '';
                paintCell(column);
                return column;
            };

            const status = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = song.is_published ? 'badge on' : 'badge';
            badge.textContent = song.is_published ? 'Live' : 'Hidden';
            status.append(badge);

            const actions = document.createElement('td');
            actions.className = 'actions';
            const edit = document.createElement('a');
            edit.className = 'button ghost';
            edit.href = song.edit_url;
            edit.textContent = 'Edit';
            const remove = document.createElement('form');
            remove.method = 'POST';
            remove.action = song.destroy_url;
            remove.onsubmit = () => confirm('Remove this song from the set list?');
            const token = document.createElement('input');
            token.type = 'hidden';
            token.name = '_token';
            token.value = csrf;
            const method = document.createElement('input');
            method.type = 'hidden';
            method.name = '_method';
            method.value = 'DELETE';
            const button = document.createElement('button');
            button.className = 'danger';
            button.type = 'submit';
            button.textContent = 'Delete';
            remove.append(token, method, button);
            actions.append(edit, remove);
            row.append(order, cell('title', song.title), cell('artist', song.artist), cell('audio_url', song.audio_url), status, actions);
            bindRow(row);

            const next = [...list.querySelectorAll('tr[data-sort]')]
                .find((existing) => Number(existing.dataset.sort) > song.sort_order);
            list.insertBefore(row, next || null);

            const count = document.getElementById('song-count');
            count.textContent = String(Number(count.textContent) + 1);

            form.reset();
            form.querySelector('input[name="is_published"][type="checkbox"]').checked = true;
        });
    </script>
@endsection
