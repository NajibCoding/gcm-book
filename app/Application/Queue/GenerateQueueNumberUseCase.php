<?php

declare(strict_types=1);

namespace App\Application\Queue;

use App\Models\QueueConfig;
use Illuminate\Support\Facades\DB;

final class GenerateQueueNumberUseCase
{
    public function execute(int $serviceId, string $scheduledAt): int
    {
        $date = date('Y-m-d', strtotime($scheduledAt));

        return DB::transaction(function () use ($serviceId, $date): int {
            $config = QueueConfig::where('service_id', $serviceId)
                ->where('date', $date)
                ->lockForUpdate()
                ->first();

            if ($config === null) {
                $config = QueueConfig::create([
                    'service_id' => $serviceId,
                    'date' => $date,
                    'last_number' => 1,
                    'prefix' => 'Q',
                ]);

                return 1;
            }

            $config->increment('last_number');

            return $config->fresh()->last_number;
        });
    }
}
