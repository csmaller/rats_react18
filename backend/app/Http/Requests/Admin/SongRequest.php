<?php

namespace App\Http\Requests\Admin;

use App\Models\Song;
use Illuminate\Foundation\Http\FormRequest;

class SongRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $audio = $this->input('audio_url');
        $sort = $this->input('sort_order');

        $this->merge([
            'title' => is_string($this->input('title')) ? trim($this->input('title')) : $this->input('title'),
            'artist' => is_string($this->input('artist')) ? trim($this->input('artist')) : $this->input('artist'),
            'audio_url' => $audio === '' ? null : $audio,
            'sort_order' => $sort === '' || $sort === null ? null : $sort,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', function (string $attribute, mixed $value, \Closure $fail): void {
                $query = Song::query()->whereRaw('lower(title) = ?', [mb_strtolower((string) $value)]);
                $current = $this->route('song');

                if ($current instanceof Song) {
                    $query->whereKeyNot($current->id);
                }

                if ($query->exists()) {
                    $fail('That song is already on the set list.');
                }
            }],
            'artist' => ['required', 'string', 'max:255'],
            'audio_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
