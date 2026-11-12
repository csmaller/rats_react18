<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'source', 'embed_url', 'file_path', 'poster_path', 'is_active'])]
class FeaturedVideo extends Model
{
    public const SOURCE_EMBED = 'embed';

    public const SOURCE_UPLOAD = 'upload';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
