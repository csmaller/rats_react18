<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'band_name',
    'genre',
    'hometown',
    'short_bio',
    'long_bio',
    'booking_name',
    'booking_email',
    'booking_phone',
    'contact_note',
    'website',
])]
class EpkProfile extends Model
{
}
