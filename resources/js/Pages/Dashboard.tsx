import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { CalendarCheck, Clock, FileText, ArrowRight } from 'lucide-react';
import { Booking, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Stats {
    total_bookings: number;
    active_bookings: number;
    outstanding_invoices: number;
}

interface Props extends PageProps {
    stats: Stats;
    recent_bookings: Booking[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Sedang Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
};

export default function Dashboard({ auth, stats, recent_bookings }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Halo, {auth.user.name}! 👋</h1>
                    <p className="text-slate-500 mt-1">Selamat datang kembali di GCM Book.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <CalendarCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_bookings}</p>
                                    <p className="text-sm text-slate-500">Total Booking</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.active_bookings}</p>
                                    <p className="text-sm text-slate-500">Booking Aktif</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-red-100">
                                    <FileText className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.outstanding_invoices}</p>
                                    <p className="text-sm text-slate-500">Invoice Outstanding</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Booking Terbaru</CardTitle>
                        <Link href="/bookings" className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            Lihat semua <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recent_bookings.length === 0 ? (
                            <p className="text-slate-500 text-sm py-4 text-center">Belum ada booking.</p>
                        ) : (
                            <div className="space-y-3">
                                {recent_bookings.map((booking) => {
                                    const status = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-800' };
                                    return (
                                        <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{booking.booking_code}</p>
                                                <p className="text-xs text-slate-500">{booking.service?.name} • {new Date(booking.scheduled_at).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={cn('text-xs', status.className)}>{status.label}</Badge>
                                                <Link href={`/booking/${booking.booking_code}`} className="text-blue-600 hover:text-blue-500">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/booking"
                        className="flex-1 text-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        + Buat Booking Baru
                    </Link>
                    <Link
                        href="/bookings"
                        className="flex-1 text-center rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Riwayat Booking
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

