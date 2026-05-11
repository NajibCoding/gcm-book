<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Booking\Entities\Booking as BookingEntity;
use App\Domain\Booking\Repositories\BookingRepositoryInterface;
use App\Models\Booking;
use DateTimeImmutable;

final class EloquentBookingRepository implements BookingRepositoryInterface
{
    public function findById(int $id): ?BookingEntity
    {
        $model = Booking::find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function findByCode(string $code): ?BookingEntity
    {
        $model = Booking::where('booking_code', $code)->first();

        return $model ? $this->toEntity($model) : null;
    }

    public function create(array $data): BookingEntity
    {
        $model = Booking::create($data);

        return $this->toEntity($model);
    }

    public function update(int $id, array $data): BookingEntity
    {
        $model = Booking::findOrFail($id);
        $model->update($data);

        return $this->toEntity($model->fresh());
    }

    public function listByUser(int $userId, array $filters = []): array
    {
        $query = Booking::with('service')
            ->where('user_id', $userId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->get()->toArray();
    }

    public function listAll(array $filters = []): array
    {
        $query = Booking::with(['service', 'user']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['service_id'])) {
            $query->where('service_id', $filters['service_id']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('scheduled_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('scheduled_at', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('created_at')->get()->toArray();
    }

    private function toEntity(Booking $model): BookingEntity
    {
        return new BookingEntity(
            id: $model->id,
            bookingCode: $model->booking_code,
            serviceId: $model->service_id,
            userId: $model->user_id,
            customerName: $model->customer_name,
            customerEmail: $model->customer_email,
            customerPhone: $model->customer_phone,
            vehicleDetails: $model->vehicle_details,
            scheduledAt: new DateTimeImmutable($model->scheduled_at->toDateTimeString()),
            queueNumber: $model->queue_number,
            status: $model->status,
            notes: $model->notes,
            promoId: $model->promo_id,
        );
    }
}
