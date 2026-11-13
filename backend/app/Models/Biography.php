<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'instruments', 'role', 'bio', 'photo_path', 'sort_order', 'is_published'])]
class Biography extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return HasMany<BiographyPhoto, $this>
     */
    public function photos(): HasMany
    {
        return $this->hasMany(BiographyPhoto::class)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Public paths with the main image first.
     *
     * @return list<string>
     */
    public function publicPhotos(): array
    {
        return $this->photos
            ->sortBy(fn (BiographyPhoto $photo): string => ($photo->is_main ? '0' : '1').sprintf('%05d', $photo->sort_order))
            ->pluck('path')
            ->values()
            ->all();
    }
}
