<?php

declare(strict_types=1);

namespace App\Application\Payment;

use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Infrastructure\Services\PakasirService;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

final class CancelPaymentUseCase
{
    public function __construct(
        private readonly PakasirService $pakasirService,
        private readonly PaymentRepositoryInterface $paymentRepository,
    ) {}

    public function execute(int $paymentId): void
    {
        $payment = $this->paymentRepository->findById($paymentId);

        if ($payment === null) {
            throw new HttpResponseException(
                response()->json(['message' => 'Payment not found.'], Response::HTTP_NOT_FOUND)
            );
        }

        $this->pakasirService->cancelTransaction($payment['order_id'], (float) $payment['amount']);

        $this->paymentRepository->update($paymentId, ['status' => 'cancelled']);
    }
}
