<?php

namespace App\Http\Requests\Admin;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SoundCloudLinkRequest extends FormRequest
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
                $host = parse_url((string) $value, PHP_URL_HOST);

                if (! is_string($host) || ! str_ends_with(strtolower($host), 'soundcloud.com')) {
                    $fail('Enter a SoundCloud link.');
                }
            }],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
