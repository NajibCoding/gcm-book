<?php

declare(strict_types=1);

namespace App\Domain\Booking\DTOs;

final class CreateBookingDTO
{
    public function __construct(
        public readonly int $serviceId,
        public readonly ?int $userId,
        public readonly string $customerName,
        public readonly string $customerEmail,
        public readonly string $customerPhone,
        public readonly ?array $vehicleDetails,
        public readonly string $scheduledAt,
        public readonly ?string $notes,
        public readonly ?int $promoId,
    ) {}
}
