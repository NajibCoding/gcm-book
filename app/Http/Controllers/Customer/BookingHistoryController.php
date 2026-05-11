<?php

declare(strict_types=1);

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;

final class BookingHistoryController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $status = request('status');

        $query = Booking::with('service')
            ->where('user_id', $user->id);

        if ($status && $status !== 'all') {
            if ($status === 'active') {
                $query->whereIn('status', ['pending', 'confirmed', 'in_progress']);
            } elseif ($status === 'completed') {
                $query->where('status', 'completed');
            } else {
                $query->where('status', $status);
            }
        }

        $bookings = $query->orderByDesc('created_at')->paginate(15);

        return Inertia::render('Booking/Index', [
            'bookings' => $bookings,
            'filters' => ['status' => $status],
        ]);
    }
}
