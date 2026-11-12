<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['headline', 'tagline', 'body', 'hero_image'])]
class AboutPage extends Model
{
}
