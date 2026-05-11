<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhook;

use App\Application\Payment\HandleWebhookUseCase;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\WebhookRequest;
use Illuminate\Http\JsonResponse;

final class PakasirWebhookController extends Controller
{
    public function __construct(
        private readonly HandleWebhookUseCase $handleWebhook,
    ) {}

    public function handle(WebhookRequest $request): JsonResponse
    {
        $data = $request->validated();

        $this->handleWebhook->execute($data['order_id'], (float) $data['amount']);

        return response()->json(['message' => 'Webhook processed.']);
    }
}
