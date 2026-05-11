<?php

declare(strict_types=1);

namespace App\Domain\Payment\DTOs;

final class CreatePaymentDTO
{
    public function __construct(
        public readonly int $invoiceId,
        public readonly string $orderId,
        public readonly float $amount,
    ) {}
}
