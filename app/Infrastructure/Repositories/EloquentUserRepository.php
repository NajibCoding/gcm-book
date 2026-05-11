<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Models\User;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?array
    {
        return User::find($id)?->toArray();
    }

    public function findByEmail(string $email): ?array
    {
        return User::where('email', $email)->first()?->toArray();
    }

    public function listAll(array $filters = []): array
    {
        $query = User::with('roles');

        if (isset($filters['role'])) {
            $query->role($filters['role']);
        }

        return $query->get()->toArray();
    }

    public function update(int $id, array $data): array
    {
        $model = User::findOrFail($id);
        $model->update($data);

        return $model->fresh()->toArray();
    }
}
