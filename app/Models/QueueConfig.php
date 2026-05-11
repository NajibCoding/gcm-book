<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueConfig extends Model
{
    protected $fillable = [
        'service_id',
        'date',
        'last_number',
        'prefix',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'last_number' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
