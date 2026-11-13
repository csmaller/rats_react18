<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class UserType extends Model
{
    public const ADMIN = 'admin';

    public const GUEST = 'guest';

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
