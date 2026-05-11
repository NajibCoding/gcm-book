<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Application\Booking\CreateBookingUseCase;
use App\Application\Booking\GetBookingByCodeUseCase;
use App\Domain\Booking\DTOs\CreateBookingDTO;
use App\Domain\Service\Repositories\ServiceRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use Inertia\Inertia;
use Inertia\Response;

final class BookingController extends Controller
{
    public function __construct(
        private readonly CreateBookingUseCase $createBooking,
        private readonly GetBookingByCodeUseCase $getBookingByCode,
        private readonly ServiceRepositoryInterface $serviceRepository,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Booking/Create', [
            'services' => $this->serviceRepository->listBookable(),
        ]);
    }

    public function store(StoreBookingRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();

        $dto = new CreateBookingDTO(
            serviceId: (int) $data['service_id'],
            userId: auth()->id(),
            customerName: $data['customer_name'],
            customerEmail: $data['customer_email'],
            customerPhone: $data['customer_phone'],
            vehicleDetails: $data['vehicle_details'] ?? null,
            scheduledAt: $data['scheduled_at'],
            notes: $data['notes'] ?? null,
            promoId: isset($data['promo_id']) ? (int) $data['promo_id'] : null,
        );

        $booking = $this->createBooking->execute($dto);

        return redirect()->route('booking.show', ['code' => $booking->bookingCode])
            ->with('success', 'Booking berhasil dibuat!');
    }

    public function show(string $code): Response
    {
        $booking = $this->getBookingByCode->execute($code);

        $bookingModel = \App\Models\Booking::with('service')
            ->where('booking_code', $code)
            ->firstOrFail();

        return Inertia::render('Booking/Show', [
            'booking' => $bookingModel->load('service'),
        ]);
    }
}
