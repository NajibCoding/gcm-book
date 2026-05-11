<?php

declare(strict_types=1);

namespace App\Application\Booking;

use App\Domain\Booking\Entities\Booking;
use App\Domain\Booking\Repositories\BookingRepositoryInterface;
use Illuminate\Validation\ValidationException;

final class UpdateBookingStatusUseCase
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
    ) {}

    public function execute(int $bookingId, string $status): Booking
    {
        $allowed = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

        if (!in_array($status, $allowed, true)) {
            throw ValidationException::withMessages(['status' => 'Invalid booking status.']);
        }

        return $this->bookingRepository->update($bookingId, ['status' => $status]);
    }
}
