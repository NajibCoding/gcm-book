<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Service\Repositories\ServiceRepositoryInterface;
use App\Models\Service;

final class EloquentServiceRepository implements ServiceRepositoryInterface
{
    public function findById(int $id): ?array
    {
        return Service::find($id)?->toArray();
    }

    public function findBySlug(string $slug): ?array
    {
        return Service::where('slug', $slug)->first()?->toArray();
    }

    public function listActive(): array
    {
        return Service::where('is_active', true)->get()->toArray();
    }

    public function listBookable(): array
    {
        return Service::where('is_active', true)->where('is_bookable', true)->get()->toArray();
    }

    public function listAll(): array
    {
        return Service::all()->toArray();
    }

    public function create(array $data): array
    {
        return Service::create($data)->toArray();
    }

    public function update(int $id, array $data): array
    {
        $model = Service::findOrFail($id);
        $model->update($data);

        return $model->fresh()->toArray();
    }

    public function delete(int $id): void
    {
        Service::findOrFail($id)->delete();
    }
}
