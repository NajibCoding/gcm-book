<?php

declare(strict_types=1);

namespace App\Application\Invoice;

use App\Domain\Invoice\Entities\Invoice;
use App\Domain\Invoice\Repositories\InvoiceRepositoryInterface;
use Illuminate\Validation\ValidationException;

final class UpdateInvoiceStatusUseCase
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoiceRepository,
    ) {}

    public function execute(int $invoiceId, string $status): Invoice
    {
        $allowed = ['draft', 'sent', 'paid', 'cancelled'];

        if (!in_array($status, $allowed, true)) {
            throw ValidationException::withMessages(['status' => 'Invalid invoice status.']);
        }

        $data = ['status' => $status];

        if ($status === 'paid') {
            $data['paid_at'] = now()->toDateTimeString();
        }

        return $this->invoiceRepository->update($invoiceId, $data);
    }
}
