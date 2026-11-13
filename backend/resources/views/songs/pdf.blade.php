<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>RATS set list</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #111;
            font-size: 12px;
        }
        h1 {
            margin: 12px 0 4px;
            font-size: 22px;
            letter-spacing: 1px;
        }
        p {
            margin: 0 0 16px;
            color: #444;
        }
        .header {
            width: 100%;
            margin-bottom: 8px;
        }
        .logo {
            width: 120px;
            vertical-align: top;
        }
        .logo img {
            width: 110px;
            height: auto;
        }
        .contact {
            vertical-align: top;
            padding-left: 12px;
            font-size: 12px;
            line-height: 1.45;
        }
        .contact .note {
            margin-top: 4px;
            color: #444;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            text-align: left;
            padding: 6px 8px;
            border-bottom: 1px solid #ccc;
        }
        th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td class="logo">
                @if ($logo)
                    <img src="{{ $logo }}" alt="RATS">
                @endif
            </td>
            <td class="contact">
                @if ($profile?->booking_name)
                    <div><strong>Manager:</strong> {{ $profile->booking_name }}</div>
                @endif
                @if ($profile?->booking_phone)
                    <div>{{ $profile->booking_phone }}</div>
                @endif
                @if ($profile?->booking_email)
                    <div>{{ $profile->booking_email }}</div>
                @endif
                @if ($profile?->hometown)
                    <div>{{ $profile->hometown }}</div>
                @endif
                @if ($profile?->contact_note)
                    <div class="note">{{ $profile->contact_note }}</div>
                @endif
            </td>
        </tr>
    </table>
    <h1>RATS</h1>
    <p>Set list, {{ $songs->count() }} songs, alphabetical.</p>
    <table>
        <thead>
            <tr>
                <th>Song</th>
                <th>Artist</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($songs as $song)
                <tr>
                    <td>{{ $song->title }}</td>
                    <td>{{ $song->artist }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">No songs published.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
