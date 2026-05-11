<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Models\Payment;

final class EloquentPaymentRepository implements PaymentRepositoryInterface
{
    public function findById(int $id): ?array
    {
        return Payment::find($id)?->toArray();
    }

    public function findByOrderId(string $orderId): ?array
    {
        return Payment::where('order_id', $orderId)->first()?->toArray();
    }

    public function findByInvoiceId(int $invoiceId): ?array
    {
        return Payment::where('invoice_id', $invoiceId)->first()?->toArray();
    }

    public function create(array $data): array
    {
        return Payment::create($data)->toArray();
    }

    public function update(int $id, array $data): array
    {
        $model = Payment::findOrFail($id);
        $model->update($data);

        return $model->fresh()->toArray();
    }
}
