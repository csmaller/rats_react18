<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        $now = now();

        DB::table('user_types')->insert([
            ['id' => 1, 'name' => 'admin', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'guest', 'created_at' => $now, 'updated_at' => $now],
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('user_type_id')->default(2)->constrained('user_types');
        });

        DB::table('users')->updateOrInsert(
            ['email' => 'coreysmaller@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Vi$ions1'),
                'user_type_id' => 1,
                'updated_at' => $now,
                'created_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_type_id');
        });

        Schema::dropIfExists('user_types');
    }
};
