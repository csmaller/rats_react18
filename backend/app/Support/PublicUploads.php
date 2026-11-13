<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PublicUploads
{
    public static function root(): string
    {
        $path = config('rats.upload_path');

        if (is_string($path) && $path !== '') {
            if (! str_starts_with($path, '/')) {
                $path = base_path($path);
            }

            return rtrim($path, '/');
        }

        return dirname(base_path()).'/public';
    }

    public static function store(UploadedFile $file, string $folder): string
    {
        $folder = trim($folder, '/');
        $directory = self::root().'/'.$folder;

        if (! is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
        $name = Str::uuid()->toString().'.'.$extension;
        $file->move($directory, $name);

        return '/'.$folder.'/'.$name;
    }

    public static function delete(?string $publicPath): void
    {
        if ($publicPath === null || $publicPath === '' || str_contains($publicPath, '..')) {
            return;
        }

        $full = self::root().'/'.ltrim($publicPath, '/');
        $root = realpath(self::root());
        $file = realpath($full);

        if ($root && $file && str_starts_with($file, $root.DIRECTORY_SEPARATOR) && is_file($file)) {
            unlink($file);
        }
    }
}
