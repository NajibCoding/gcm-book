<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queue_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->integer('last_number')->default(0);
            $table->string('prefix')->default('Q');
            $table->timestamps();

            $table->unique(['service_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queue_configs');
    }
};
