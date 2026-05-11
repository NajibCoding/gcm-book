<?php

declare(strict_types=1);

namespace App\Application\Booking;

use App\Domain\Booking\DTOs\CreateBookingDTO;
use App\Domain\Booking\Entities\Booking;
use App\Domain\Booking\Repositories\BookingRepositoryInterface;
use App\Application\Queue\GenerateQueueNumberUseCase;
use App\Infrastructure\Mail\BookingReceiptMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class CreateBookingUseCase
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookingRepository,
        private readonly GenerateQueueNumberUseCase $generateQueueNumber,
    ) {}

    public function execute(CreateBookingDTO $dto): Booking
    {
        $bookingCode = $this->generateBookingCode();
        $queueNumber = $this->generateQueueNumber->execute($dto->serviceId, $dto->scheduledAt);

        $booking = $this->bookingRepository->create([
            'booking_code' => $bookingCode,
            'service_id' => $dto->serviceId,
            'user_id' => $dto->userId,
            'customer_name' => $dto->customerName,
            'customer_email' => $dto->customerEmail,
            'customer_phone' => $dto->customerPhone,
            'vehicle_details' => $dto->vehicleDetails,
            'scheduled_at' => $dto->scheduledAt,
            'queue_number' => $queueNumber,
            'notes' => $dto->notes,
            'promo_id' => $dto->promoId,
            'status' => 'pending',
        ]);

        Mail::to($dto->customerEmail)->queue(new BookingReceiptMail($booking));

        return $booking;
    }

    private function generateBookingCode(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(5));

        return "BCK-{$date}-{$random}";
    }
}
