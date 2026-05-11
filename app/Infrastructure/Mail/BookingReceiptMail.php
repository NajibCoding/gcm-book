<?php

declare(strict_types=1);

namespace App\Infrastructure\Mail;

use App\Domain\Booking\Entities\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingReceiptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Booking $booking,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Konfirmasi Booking #{$this->booking->bookingCode}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-receipt',
            with: ['booking' => $this->booking],
        );
    }
}
