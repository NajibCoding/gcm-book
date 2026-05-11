<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Invoice\Entities\Invoice as InvoiceEntity;
use App\Domain\Invoice\Repositories\InvoiceRepositoryInterface;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\DB;

final class EloquentInvoiceRepository implements InvoiceRepositoryInterface
{
    public function findById(int $id): ?InvoiceEntity
    {
        $model = Invoice::find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function findByNumber(string $number): ?InvoiceEntity
    {
        $model = Invoice::where('invoice_number', $number)->first();

        return $model ? $this->toEntity($model) : null;
    }

    public function create(array $data): InvoiceEntity
    {
        return DB::transaction(function () use ($data): InvoiceEntity {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $model = Invoice::create($data);

            foreach ($items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $model->id,
                    'description' => $item['description'],
                    'qty' => $item['qty'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['unit_price'] * $item['qty'],
                ]);
            }

            return $this->toEntity($model);
        });
    }

    public function update(int $id, array $data): InvoiceEntity
    {
        $model = Invoice::findOrFail($id);
        $model->update($data);

        return $this->toEntity($model->fresh());
    }

    public function listAll(array $filters = []): array
    {
        $query = Invoice::with(['items', 'booking', 'user', 'payment']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->get()->toArray();
    }

    private function toEntity(Invoice $model): InvoiceEntity
    {
        return new InvoiceEntity(
            id: $model->id,
            invoiceNumber: $model->invoice_number,
            bookingId: $model->booking_id,
            userId: $model->user_id,
            customerName: $model->customer_name,
            customerEmail: $model->customer_email,
            subtotal: (float) $model->subtotal,
            discountAmount: (float) $model->discount_amount,
            taxAmount: (float) $model->tax_amount,
            total: (float) $model->total,
            status: $model->status,
            notes: $model->notes,
            paidAt: $model->paid_at?->toDateTimeString(),
        );
    }
}
