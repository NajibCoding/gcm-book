<?php

declare(strict_types=1);

namespace App\Application\Payment;

use App\Domain\Invoice\Repositories\InvoiceRepositoryInterface;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

final class HandleWebhookUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly InvoiceRepositoryInterface $invoiceRepository,
    ) {}

    public function execute(string $orderId, float $amount): void
    {
        $payment = $this->paymentRepository->findByOrderId($orderId);

        if ($payment === null) {
            throw new HttpResponseException(
                response()->json(['message' => 'Payment not found.'], Response::HTTP_NOT_FOUND)
            );
        }

        if ((float) $payment['amount'] !== $amount) {
            throw new HttpResponseException(
                response()->json(['message' => 'Amount mismatch.'], Response::HTTP_UNPROCESSABLE_ENTITY)
            );
        }

        $this->paymentRepository->update($payment['id'], [
            'status' => 'completed',
            'completed_at' => now()->toDateTimeString(),
        ]);

        $this->invoiceRepository->update($payment['invoice_id'], [
            'status' => 'paid',
            'paid_at' => now()->toDateTimeString(),
        ]);
    }
}
