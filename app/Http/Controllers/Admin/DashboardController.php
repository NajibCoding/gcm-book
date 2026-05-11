<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();

        $stats = [
            'total_bookings' => Booking::count(),
            'bookings_today' => Booking::whereDate('created_at', $today)->count(),
            'active_queue' => Booking::whereIn('status', ['confirmed', 'in_progress'])
                ->whereDate('scheduled_at', $today)
                ->count(),
            'pending_invoices' => Invoice::whereIn('status', ['draft', 'sent'])->count(),
            'total_users' => User::role('customer')->count(),
            'revenue_this_month' => Invoice::where('status', 'paid')
                ->whereMonth('paid_at', now()->month)
                ->whereYear('paid_at', now()->year)
                ->sum('total'),
        ];

        $recentBookings = Booking::with(['service', 'user'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
