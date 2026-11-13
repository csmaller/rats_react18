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
        <nav class="admin-nav">
            <a href="{{ route('admin.songs.index') }}">Set list</a>
            <a href="{{ route('admin.about.edit') }}">Biography</a>
            <a href="{{ route('admin.lineup.index') }}">Lineup</a>
            <a href="{{ route('admin.soundcloud.index') }}">Listen</a>
            <a href="{{ route('admin.booking.edit') }}">Booking</a>
            <a href="{{ route('admin.video.edit') }}">Main video</a>
            <a href="{{ route('admin.youtube.index') }}">Videos</a>
        </nav>
        <p>Backstage</p>
        @auth
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button class="ghost" type="submit">Log out</button>
            </form>
        @endauth
    </header>
    <main>
        @yield('content')
    </main>
    <div id="toasts" class="toasts" aria-live="polite"></div>
    <script>
        const toastRoot = document.getElementById('toasts');

        function showToast(message, ok) {
            const toast = document.createElement('p');
            toast.className = ok ? 'toast' : 'toast fail';
            toast.textContent = message;
            toastRoot.append(toast);
            setTimeout(() => toast.remove(), 5000);
        }

        const stored = sessionStorage.getItem('rats-toast');
        if (stored) {
            sessionStorage.removeItem('rats-toast');
            const toast = JSON.parse(stored);
            if (toast.message) {
                showToast(toast.message, toast.ok !== false);
            }
        }

        const flash = @json(session('status'));
        if (flash) {
            showToast(flash, true);
        }

        const errors = @json($errors->any() ? $errors->all() : []);
        if (errors.length) {
            showToast(errors.join(' '), false);
        }

        const originalFetch = window.fetch.bind(window);
        window.fetch = async function (input, init = {}) {
            const method = String(init.method || 'GET').toUpperCase();
            const response = await originalFetch(input, init);

            if (method === 'GET' || method === 'HEAD') {
                return response;
            }

            const data = await response.clone().json().catch(() => ({}));
            if (response.ok) {
                showToast(data.message || 'Saved.', true);
            } else {
                const messages = data.errors ? Object.values(data.errors).flat() : [data.message || 'That did not save.'];
                showToast(messages.join(' '), false);
            }

            return response;
        };

        document.querySelectorAll('form[data-upload]').forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const wrap = form.querySelector('.upload-progress');
                const bar = form.querySelector('.upload-progress-bar');
                const label = form.querySelector('.upload-progress-label');
                const button = form.querySelector('button[type="submit"]');
                wrap.hidden = false;
                label.hidden = false;
                bar.style.width = '0%';
                label.textContent = '0%';
                button.disabled = true;

                const xhr = new XMLHttpRequest();
                xhr.open('POST', form.action);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.upload.addEventListener('progress', (progress) => {
                    if (!progress.lengthComputable) {
                        return;
                    }
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    bar.style.width = percent + '%';
                    label.textContent = percent + '%';
                });
                xhr.addEventListener('load', () => {
                    let data = {};
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (error) {
                        data = {};
                    }

                    if (xhr.status >= 200 && xhr.status < 300) {
                        bar.style.width = '100%';
                        label.textContent = '100%';
                        sessionStorage.setItem('rats-toast', JSON.stringify({
                            ok: true,
                            message: data.message || 'Uploaded.',
                        }));
                        window.location.href = data.redirect || form.action;
                        return;
                    }

                    const messages = data.errors ? Object.values(data.errors).flat() : [data.message || 'Upload failed.'];
                    showToast(messages.join(' '), false);
                    wrap.hidden = true;
                    label.hidden = true;
                    button.disabled = false;
                });
                xhr.addEventListener('error', () => {
                    showToast('Upload failed.', false);
                    wrap.hidden = true;
                    label.hidden = true;
                    button.disabled = false;
                });
                xhr.send(new FormData(form));
            });
        });
    </script>
</body>
</html>
