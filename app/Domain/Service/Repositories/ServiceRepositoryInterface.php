<?php

declare(strict_types=1);

namespace App\Domain\Service\Repositories;

interface ServiceRepositoryInterface
{
    public function findById(int $id): ?array;

    public function findBySlug(string $slug): ?array;

    public function listActive(): array;

    public function listBookable(): array;

    public function listAll(): array;

    public function create(array $data): array;

    public function update(int $id, array $data): array;

    public function delete(int $id): void;
}
