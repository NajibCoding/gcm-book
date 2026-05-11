<?php

declare(strict_types=1);

namespace App\Application\Invoice;

use App\Domain\Invoice\DTOs\CreateInvoiceDTO;
use App\Domain\Invoice\Entities\Invoice;
use App\Domain\Invoice\Repositories\InvoiceRepositoryInterface;
use Illuminate\Support\Str;

final class CreateInvoiceUseCase
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoiceRepository,
    ) {}

    public function execute(CreateInvoiceDTO $dto): Invoice
    {
        $subtotal = array_reduce($dto->items, function (float $carry, array $item): float {
            return $carry + ($item['unit_price'] * $item['qty']);
        }, 0.0);

        $total = $subtotal - $dto->discountAmount + $dto->taxAmount;

        $invoice = $this->invoiceRepository->create([
            'invoice_number' => $this->generateInvoiceNumber(),
            'booking_id' => $dto->bookingId,
            'user_id' => $dto->userId,
            'customer_name' => $dto->customerName,
            'customer_email' => $dto->customerEmail,
            'subtotal' => $subtotal,
            'discount_amount' => $dto->discountAmount,
            'tax_amount' => $dto->taxAmount,
            'total' => $total,
            'notes' => $dto->notes,
            'status' => 'draft',
            'items' => $dto->items,
        ]);

        return $invoice;
    }

    private function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(5));

        return "INV-{$date}-{$random}";
    }
}
