<?php

declare(strict_types=1);

namespace App\Domain\User\Repositories;

interface UserRepositoryInterface
{
    public function findById(int $id): ?array;

    public function findByEmail(string $email): ?array;

    public function listAll(array $filters = []): array;

    public function update(int $id, array $data): array;
}
