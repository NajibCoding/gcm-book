<?php

declare(strict_types=1);

namespace App\Domain\Invoice\DTOs;

final class CreateInvoiceDTO
{
    /**
     * @param array<array{description: string, qty: int, unit_price: float}> $items
     */
    public function __construct(
        public readonly ?int $bookingId,
        public readonly ?int $userId,
        public readonly string $customerName,
        public readonly string $customerEmail,
        public readonly array $items,
        public readonly float $discountAmount,
        public readonly float $taxAmount,
        public readonly ?string $notes,
    ) {}
}
