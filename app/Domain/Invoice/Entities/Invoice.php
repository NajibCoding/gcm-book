<?php

declare(strict_types=1);

namespace App\Domain\Invoice\Entities;

final class Invoice
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $invoiceNumber,
        public readonly ?int $bookingId,
        public readonly ?int $userId,
        public readonly string $customerName,
        public readonly string $customerEmail,
        public readonly float $subtotal,
        public readonly float $discountAmount,
        public readonly float $taxAmount,
        public readonly float $total,
        public readonly string $status,
        public readonly ?string $notes,
        public readonly ?string $paidAt,
    ) {}
}
