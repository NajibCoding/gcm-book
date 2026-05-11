<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

final class PakasirService
{
    private string $baseUrl = 'https://app.pakasir.com/api';

    private string $project;

    private string $apiKey;

    public function __construct()
    {
        $this->project = (string) config('services.pakasir.project_slug');
        $this->apiKey = (string) config('services.pakasir.api_key');
    }

    public function createQris(int $invoiceId, string $orderId, float $amount): array
    {
        $response = Http::retry(3, 200)
            ->post("{$this->baseUrl}/transactioncreate/qris", [
                'project' => $this->project,
                'order_id' => $orderId,
                'amount' => $amount,
                'api_key' => $this->apiKey,
            ]);

        $this->ensureSuccess($response);

        return $response->json();
    }

    public function checkStatus(string $orderId, float $amount): array
    {
        $response = Http::retry(3, 200)
            ->get("{$this->baseUrl}/transactiondetail", [
                'project' => $this->project,
                'order_id' => $orderId,
                'amount' => $amount,
                'api_key' => $this->apiKey,
            ]);

        $this->ensureSuccess($response);

        return $response->json();
    }

    public function cancelTransaction(string $orderId, float $amount): array
    {
        $response = Http::retry(3, 200)
            ->post("{$this->baseUrl}/transactioncancel", [
                'project' => $this->project,
                'order_id' => $orderId,
                'amount' => $amount,
                'api_key' => $this->apiKey,
            ]);

        $this->ensureSuccess($response);

        return $response->json();
    }

    private function ensureSuccess(Response $response): void
    {
        if ($response->failed()) {
            throw new \RuntimeException(
                'Pakasir API error: ' . $response->status() . ' ' . $response->body()
            );
        }
    }
}
