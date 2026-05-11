<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    protected $fillable = [
        'booking_code',
        'service_id',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'vehicle_details',
        'scheduled_at',
        'queue_number',
        'status',
        'notes',
        'promo_id',
    ];

    protected function casts(): array
    {
        return [
            'vehicle_details' => 'array',
            'scheduled_at' => 'datetime',
            'queue_number' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
