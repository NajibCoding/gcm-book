<?php

declare(strict_types=1);

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $stats = [
            'total_bookings' => Booking::where('user_id', $user->id)->count(),
            'active_bookings' => Booking::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->count(),
            'outstanding_invoices' => Invoice::where('user_id', $user->id)
                ->whereIn('status', ['draft', 'sent'])
                ->count(),
        ];

        $recentBookings = Booking::with('service')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
