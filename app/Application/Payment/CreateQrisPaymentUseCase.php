<?php

declare(strict_types=1);

namespace App\Application\Payment;

use App\Domain\Payment\DTOs\CreatePaymentDTO;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Infrastructure\Services\PakasirService;
use App\Models\Payment;

final class CreateQrisPaymentUseCase
{
    public function __construct(
        private readonly PakasirService $pakasirService,
        private readonly PaymentRepositoryInterface $paymentRepository,
    ) {}

    public function execute(CreatePaymentDTO $dto): Payment
    {
        $response = $this->pakasirService->createQris(
            $dto->invoiceId,
            $dto->orderId,
            $dto->amount,
        );

        $paymentData = $response['payment'];

        $payment = $this->paymentRepository->create([
            'invoice_id' => $dto->invoiceId,
            'order_id' => $dto->orderId,
            'payment_method' => $paymentData['payment_method'] ?? 'qris',
            'amount' => $dto->amount,
            'fee' => $paymentData['fee'] ?? 0,
            'total_payment' => $paymentData['total_payment'] ?? $dto->amount,
            'qr_string' => $paymentData['payment_number'] ?? null,
            'expired_at' => $paymentData['expired_at'] ?? null,
            'status' => 'pending',
        ]);

        return Payment::findOrFail($payment['id']);
    }
}
