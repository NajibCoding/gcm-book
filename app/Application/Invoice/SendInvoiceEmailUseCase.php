<?php

declare(strict_types=1);

namespace App\Application\Invoice;

use App\Domain\Invoice\Repositories\InvoiceRepositoryInterface;
use App\Infrastructure\Mail\InvoiceMail;
use App\Models\Invoice;
use Illuminate\Support\Facades\Mail;

final class SendInvoiceEmailUseCase
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoiceRepository,
    ) {}

    public function execute(int $invoiceId): void
    {
        $invoice = Invoice::with('items')->findOrFail($invoiceId);

        Mail::to($invoice->customer_email)->queue(new InvoiceMail($invoice));

        $this->invoiceRepository->update($invoiceId, ['status' => 'sent']);
    }
}
