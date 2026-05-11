<?php

declare(strict_types=1);

namespace App\Application\Booking;

use App\Domain\Booking\Entities\Booking;
use App\Domain\Booking\Repositories\BookingRepositoryInterface;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

final class GetBookingByCodeUseCase
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
    ) {}

    public function execute(string $code): Booking
    {
        $booking = $this->bookingRepository->findByCode($code);

        if ($booking === null) {
            throw new HttpResponseException(
                response()->json(['message' => 'Booking not found.'], Response::HTTP_NOT_FOUND)
            );
        }

        return $booking;
    }
}
