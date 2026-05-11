<?php

declare(strict_types=1);

use App\Application\Payment\CancelPaymentUseCase;
use App\Application\Payment\CreateQrisPaymentUseCase;
use App\Domain\Payment\DTOs\CreatePaymentDTO;
use App\Http\Controllers\Webhook\PakasirWebhookController;
use App\Infrastructure\Services\PakasirService;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

// Webhook (no auth, no CSRF — already excluded in api.php)
Route::post('/webhooks/pakasir', [PakasirWebhookController::class, 'handle'])
    ->name('webhooks.pakasir');

// Payment routes (auth or public via signed URL)
Route::middleware('auth')->group(function () {
    Route::get('/payment/{invoice}/status', function (Invoice $invoice): \Illuminate\Http\JsonResponse {
        $payment = $invoice->payment;

        if ($payment === null) {
            return response()->json(['status' => null, 'payment' => null]);
        }

        // Refresh from Pakasir if still pending
        if ($payment->status === 'pending') {
            try {
                $pakasir = app(PakasirService::class);
                $result = $pakasir->checkStatus($payment->order_id, (float) $payment->amount);
                $remoteStatus = $result['payment']['status'] ?? null;

                if ($remoteStatus === 'completed') {
                    $payment->update(['status' => 'completed', 'completed_at' => now()]);
                    $invoice->update(['status' => 'paid', 'paid_at' => now()]);
                    $payment->refresh();
                } elseif (in_array($remoteStatus, ['expired', 'cancelled'], true)) {
                    $payment->update(['status' => $remoteStatus]);
                    $payment->refresh();
                }
            } catch (\Throwable) {
                // Don't fail the status check if Pakasir is unreachable
            }
        }

        return response()->json(['status' => $payment->status, 'payment' => $payment]);
    })->name('payment.status');

    Route::post('/payment/{invoice}/create', function (
        Request $request,
        Invoice $invoice,
        CreateQrisPaymentUseCase $createPayment,
    ): \Illuminate\Http\JsonResponse {
        if ($invoice->payment !== null && $invoice->payment->status === 'pending') {
            return response()->json(['payment' => $invoice->payment]);
        }

        $orderId = 'GCM-' . strtoupper(Str::random(10)) . '-' . $invoice->id;

        $dto = new CreatePaymentDTO(
            invoiceId: $invoice->id,
            orderId: $orderId,
            amount: (float) $invoice->total,
        );

        $payment = $createPayment->execute($dto);

        return response()->json(['payment' => $payment]);
    })->name('payment.create');

    Route::post('/payment/{invoice}/cancel', function (
        Invoice $invoice,
        CancelPaymentUseCase $cancelPayment,
    ): \Illuminate\Http\JsonResponse {
        if ($invoice->payment === null) {
            return response()->json(['message' => 'No payment found.'], 404);
        }

        $cancelPayment->execute($invoice->payment->id);

        return response()->json(['message' => 'Payment cancelled.']);
    })->name('payment.cancel');
});

// Promo check (public)
Route::get('/promo/check', function (Request $request): \Illuminate\Http\JsonResponse {
    $code = $request->query('code');

    if (!$code) {
        return response()->json(['valid' => false, 'message' => 'Kode promo wajib diisi.']);
    }

    $promo = Promo::where('code', $code)
        ->where('is_active', true)
        ->where('valid_from', '<=', now())
        ->where('valid_until', '>=', now())
        ->first();

    if ($promo === null) {
        return response()->json(['valid' => false, 'message' => 'Kode promo tidak valid atau sudah kadaluarsa.']);
    }

    if ($promo->max_usage !== null && $promo->used_count >= $promo->max_usage) {
        return response()->json(['valid' => false, 'message' => 'Kode promo sudah mencapai batas penggunaan.']);
    }

    return response()->json(['valid' => true, 'promo' => $promo]);
})->name('promo.check');
