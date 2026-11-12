<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['starts_at', 'venue', 'city', 'region', 'country', 'ticket_url', 'notes', 'is_published'])]
class Gig extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }
}
