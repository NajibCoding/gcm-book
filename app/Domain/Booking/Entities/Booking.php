<?php

declare(strict_types=1);

namespace App\Domain\Booking\Entities;

use DateTimeImmutable;

final class Booking
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $bookingCode,
        public readonly int $serviceId,
        public readonly ?int $userId,
        public readonly string $customerName,
        public readonly string $customerEmail,
        public readonly string $customerPhone,
        public readonly ?array $vehicleDetails,
        public readonly DateTimeImmutable $scheduledAt,
        public readonly int $queueNumber,
        public readonly string $status,
        public readonly ?string $notes,
        public readonly ?int $promoId,
    ) {}
}
