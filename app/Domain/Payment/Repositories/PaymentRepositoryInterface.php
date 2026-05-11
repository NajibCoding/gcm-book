<?php

declare(strict_types=1);

namespace App\Domain\Payment\Repositories;

interface PaymentRepositoryInterface
{
    public function findById(int $id): ?array;

    public function findByOrderId(string $orderId): ?array;

    public function findByInvoiceId(int $invoiceId): ?array;

    public function create(array $data): array;

    public function update(int $id, array $data): array;
}
