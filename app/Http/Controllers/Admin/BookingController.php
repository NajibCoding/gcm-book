<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Application\Booking\UpdateBookingStatusUseCase;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class BookingController extends Controller
{
    public function __construct(
        private readonly UpdateBookingStatusUseCase $updateStatus,
    ) {}

    public function index(Request $request): Response
    {
        $query = Booking::with(['service', 'user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        $bookings = $query->orderByDesc('created_at')->paginate(20);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'services' => Service::select('id', 'name')->get(),
            'filters' => $request->only(['status', 'search', 'service_id', 'date_from', 'date_to']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Bookings/Create', [
            'services' => Service::where('is_active', true)->where('is_bookable', true)->select('id', 'name', 'slug')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'service_id'       => 'required|exists:services,id',
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'required|string|max:20',
            'scheduled_at'     => 'required|date',
            'notes'            => 'nullable|string|max:1000',
            'vehicle_brand'    => 'nullable|string|max:100',
            'vehicle_model'    => 'nullable|string|max:100',
            'vehicle_color'    => 'nullable|string|max:50',
            'vehicle_plate'    => 'nullable|string|max:20',
        ]);

        $vehicleDetails = null;
        if ($data['vehicle_brand'] || $data['vehicle_model'] || $data['vehicle_color'] || $data['vehicle_plate']) {
            $vehicleDetails = [
                'brand' => $data['vehicle_brand'] ?? null,
                'model' => $data['vehicle_model'] ?? null,
                'color' => $data['vehicle_color'] ?? null,
                'plate_number' => $data['vehicle_plate'] ?? null,
            ];
        }

        $scheduledDate = \Carbon\Carbon::parse($data['scheduled_at'])->toDateString();
        $queueNumber = Booking::where('service_id', $data['service_id'])
            ->whereDate('scheduled_at', $scheduledDate)
            ->max('queue_number') + 1;

        $booking = Booking::create([
            'booking_code'    => 'BCK-' . strtoupper(Str::random(10)),
            'service_id'      => $data['service_id'],
            'customer_name'   => $data['customer_name'],
            'customer_email'  => $data['customer_email'],
            'customer_phone'  => $data['customer_phone'],
            'scheduled_at'    => $data['scheduled_at'],
            'queue_number'    => $queueNumber,
            'status'          => 'pending',
            'notes'           => $data['notes'] ?? null,
            'vehicle_details' => $vehicleDetails,
        ]);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking berhasil dibuat.');
    }

    public function show(Booking $booking): Response
    {
        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking->load(['service', 'user', 'invoice']),
        ]);
    }

    public function edit(Booking $booking): Response
    {
        return Inertia::render('Admin/Bookings/Edit', [
            'booking'  => $booking->load('service'),
            'services' => Service::where('is_active', true)->select('id', 'name', 'slug')->get(),
        ]);
    }

    public function updateDetails(Request $request, Booking $booking): RedirectResponse
    {
        $data = $request->validate([
            'service_id'    => 'required|exists:services,id',
            'customer_name' => 'required|string|max:255',
            'customer_email'=> 'required|email|max:255',
            'customer_phone'=> 'required|string|max:20',
            'scheduled_at'  => 'required|date',
            'status'        => 'required|in:pending,confirmed,in_progress,completed,cancelled',
            'notes'         => 'nullable|string|max:1000',
            'vehicle_brand' => 'nullable|string|max:100',
            'vehicle_model' => 'nullable|string|max:100',
            'vehicle_color' => 'nullable|string|max:50',
            'vehicle_plate' => 'nullable|string|max:20',
        ]);

        $vehicleDetails = null;
        if ($data['vehicle_brand'] || $data['vehicle_model'] || $data['vehicle_color'] || $data['vehicle_plate']) {
            $vehicleDetails = [
                'brand'        => $data['vehicle_brand'] ?? null,
                'model'        => $data['vehicle_model'] ?? null,
                'color'        => $data['vehicle_color'] ?? null,
                'plate_number' => $data['vehicle_plate'] ?? null,
            ];
        }

        $booking->update([
            'service_id'      => $data['service_id'],
            'customer_name'   => $data['customer_name'],
            'customer_email'  => $data['customer_email'],
            'customer_phone'  => $data['customer_phone'],
            'scheduled_at'    => $data['scheduled_at'],
            'status'          => $data['status'],
            'notes'           => $data['notes'] ?? null,
            'vehicle_details' => $vehicleDetails,
        ]);

        return redirect()->route('admin.bookings.show', $booking)
            ->with('success', 'Booking berhasil diperbarui.');
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $request->validate(['status' => 'required|in:pending,confirmed,in_progress,completed,cancelled']);

        $this->updateStatus->execute($booking->id, $request->status);

        return back()->with('success', 'Status booking diperbarui.');
    }
}
