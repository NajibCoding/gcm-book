<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

final class PdfService
{
    public function generateInvoicePdf(Invoice $invoice): Response
    {
        $invoice->loadMissing(['items', 'booking.service']);

        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    public function streamInvoicePdf(Invoice $invoice): Response
    {
        $invoice->loadMissing(['items', 'booking.service']);

        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice]);

        return $pdf->stream("invoice-{$invoice->invoice_number}.pdf");
    }
}
