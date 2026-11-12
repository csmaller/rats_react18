<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['type', 'title', 'url', 'platform', 'thumbnail_path', 'sort_order', 'is_published'])]
class MediaLink extends Model
{
    public const TYPE_VIDEO = 'video';

    public const TYPE_AUDIO = 'audio';

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
}
