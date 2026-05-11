<?php

declare(strict_types=1);

namespace App\Domain\Booking\Repositories;

use App\Domain\Booking\Entities\Booking;

interface BookingRepositoryInterface
{
    public function findById(int $id): ?Booking;

    public function findByCode(string $code): ?Booking;

    public function create(array $data): Booking;

    public function update(int $id, array $data): Booking;

    public function listByUser(int $userId, array $filters = []): array;

    public function listAll(array $filters = []): array;
}
