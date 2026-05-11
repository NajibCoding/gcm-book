<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Application\Booking\UpdateBookingStatusUseCase;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QueueController extends Controller
{
    public function __construct(
        private readonly UpdateBookingStatusUseCase $updateStatus,
    ) {}

    public function index(): Response
    {
        $today = now()->toDateString();
        $services = Service::where('is_active', true)->get();

        $queues = $services->map(function (Service $service) use ($today) {
            $entries = Booking::with('service')
                ->where('service_id', $service->id)
                ->whereDate('scheduled_at', $today)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->orderBy('queue_number')
                ->get()
                ->map(fn (Booking $b) => [
                    'id'             => $b->id,
                    'booking_code'   => $b->booking_code,
                    'customer_name'  => $b->customer_name,
                    'queue_number'   => $b->queue_number,
                    'scheduled_at'   => $b->scheduled_at,
                    'status'         => $b->status,
                    'service'        => [
                        'name' => $service->name,
                        'slug' => $service->slug,
                    ],
                ]);

            return [
                'service' => [
                    'id'   => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                ],
                'today_count'    => $entries->count(),
                'current_number' => $entries->max('queue_number') ?? 0,
                'entries'        => $entries->values(),
            ];
        })->values();

        return Inertia::render('Admin/Queue/Index', [
            'queues' => $queues,
            'today'  => $today,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        $request->validate(['status' => 'required|in:pending,confirmed,in_progress,completed,cancelled']);

        $this->updateStatus->execute($booking->id, $request->status);

        return back()->with('success', 'Status antrian diperbarui.');
    }
}
