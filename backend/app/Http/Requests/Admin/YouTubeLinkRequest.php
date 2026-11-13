<?php

namespace App\Http\Requests\Admin;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class YouTubeLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $sort = $this->input('sort_order');

        $this->merge([
            'title' => is_string($this->input('title')) ? trim($this->input('title')) : $this->input('title'),
            'url' => is_string($this->input('url')) ? trim($this->input('url')) : $this->input('url'),
            'sort_order' => $sort === '' || $sort === null ? null : $sort,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2048', function (string $attribute, mixed $value, Closure $fail): void {
                $host = strtolower((string) parse_url((string) $value, PHP_URL_HOST));
                $allowed = $host === 'youtu.be' || $host === 'youtube.com' || str_ends_with($host, '.youtube.com');

                $id = self::videoId((string) $value);

                if (! $allowed || $id === null) {
                    $fail('Enter a YouTube link.');

                    return;
                }

                if (! self::videoExists($id)) {
                    $fail('That YouTube video could not be found.');
                }
            }],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    public static function videoId(string $url): ?string
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $path = trim((string) parse_url($url, PHP_URL_PATH), '/');

        if ($host === 'youtu.be') {
            $id = explode('/', $path)[0] ?? '';
        } elseif (str_starts_with($path, 'shorts/') || str_starts_with($path, 'embed/') || str_starts_with($path, 'live/')) {
            $id = explode('/', $path)[1] ?? '';
        } elseif ($path === 'watch') {
            parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
            $id = (string) ($query['v'] ?? '');
        } else {
            $id = '';
        }

        return preg_match('/^[A-Za-z0-9_-]{11}$/', $id) === 1 ? $id : null;
    }

    public static function videoExists(string $id): bool
    {
        try {
            $response = Http::timeout(8)
                ->acceptJson()
                ->get('https://www.youtube.com/oembed', [
                    'url' => 'https://www.youtube.com/watch?v='.$id,
                    'format' => 'json',
                ]);
        } catch (ConnectionException) {
            return false;
        }

        return $response->ok() && is_string($response->json('title')) && $response->json('title') !== '';
    }
}
