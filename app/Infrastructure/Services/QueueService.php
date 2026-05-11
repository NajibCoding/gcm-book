<?php

declare(strict_types=1);

namespace App\Infrastructure\Services;

use App\Application\Queue\GenerateQueueNumberUseCase;

final class QueueService
{
    public function __construct(
        private readonly GenerateQueueNumberUseCase $generateQueueNumber,
    ) {}

    public function getNextQueueNumber(int $serviceId, string $scheduledAt): int
    {
        return $this->generateQueueNumber->execute($serviceId, $scheduledAt);
    }
}
