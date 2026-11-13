<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LineupMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $sort = $this->input('sort_order');

        $bio = $this->input('bio');

        $this->merge([
            'name' => is_string($this->input('name')) ? trim($this->input('name')) : $this->input('name'),
            'instruments' => is_string($this->input('instruments')) ? trim($this->input('instruments')) : $this->input('instruments'),
            'bio' => is_string($bio) ? trim($bio) : $bio,
            'sort_order' => $sort === '' || $sort === null ? null : $sort,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'instruments' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string', 'max:500'],
            'photos' => ['nullable', 'array', 'max:12'],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'main_photo' => ['nullable', 'string', 'max:20'],
            'remove' => ['nullable', 'array'],
            'remove.*' => ['integer'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
