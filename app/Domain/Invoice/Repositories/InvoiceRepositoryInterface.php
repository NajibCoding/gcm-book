<?php

declare(strict_types=1);

namespace App\Domain\Invoice\Repositories;

use App\Domain\Invoice\Entities\Invoice;

interface InvoiceRepositoryInterface
{
    public function findById(int $id): ?Invoice;

    public function findByNumber(string $number): ?Invoice;

    public function create(array $data): Invoice;

    public function update(int $id, array $data): Invoice;

    public function listAll(array $filters = []): array;
}
