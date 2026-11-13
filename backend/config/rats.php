<?php

return [
    'admin_email' => env('ADMIN_EMAIL', 'admin@ratsband.local'),
    'admin_password' => env('ADMIN_PASSWORD', 'changeme'),
    'upload_path' => env('UPLOAD_PATH'),
    'site_url' => rtrim((string) env('SITE_URL', env('APP_URL', 'http://localhost:5173')), '/'),
    'contact_recipients' => array_values(array_filter(array_map(
        trim(...),
        explode(',', (string) env('CONTACT_RECIPIENTS', 'contact@ratsband.com')),
    ))),
];
