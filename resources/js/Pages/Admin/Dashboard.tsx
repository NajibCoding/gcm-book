import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { CalendarCheck, FileText, Users, TrendingUp, ArrowRight, ExternalLink, Tag, Wrench } from 'lucide-react';
import { Booking, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Stats {
    total_bookings: number;
    bookings_today: number;
    pending_invoices: number;
    total_users: number;
    revenue_this_month: number;
}

interface Props extends PageProps {
    stats: Stats;
    recent_bookings: Array<Booking & { service: { name: string } }>;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-800' },
};

export default function AdminDashboard({ stats, recent_bookings }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard — GCM Book" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Selamat datang di panel administrasi GCM Book.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { icon: <CalendarCheck className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-100', label: 'Total Booking', value: stats.total_bookings },
                        { icon: <CalendarCheck className="h-5 w-5 text-green-600" />, bg: 'bg-green-100', label: 'Booking Hari Ini', value: stats.bookings_today },
                        { icon: <FileText className="h-5 w-5 text-yellow-600" />, bg: 'bg-yellow-100', label: 'Invoice Pending', value: stats.pending_invoices },
                        { icon: <Users className="h-5 w-5 text-purple-600" />, bg: 'bg-purple-100', label: 'Total Pengguna', value: stats.total_users },
                    ].map((stat) => (
                        <Card key={stat.label} className="border-0 shadow-sm">
                            <CardContent className="pt-5">
                                <div className="flex items-center gap-3">
                                    <div className={cn('p-2.5 rounded-lg', stat.bg)}>{stat.icon}</div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stat.value.toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Revenue */}
                <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-white/20">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatRupiah(stats.revenue_this_month)}</p>
                                <p className="text-sm text-blue-100">Pendapatan Bulan Ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Aksi Cepat</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Link
                            href={route('admin.invoices.create')}
                            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-4 text-center hover:border-blue-400 hover:bg-blue-100 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-blue-700">Buat Invoice</p>
                                <p className="text-xs text-blue-500 mt-0.5">Invoice baru</p>
                            </div>
                        </Link>

                        <a
                            href="/booking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-green-200 bg-green-50 p-4 text-center hover:border-green-400 hover:bg-green-100 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                                <ExternalLink className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-700">Form Booking</p>
                                <p className="text-xs text-green-500 mt-0.5">Buka halaman publik</p>
                            </div>
                        </a>

                        <Link
                            href={route('admin.services.create')}
                            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50 p-4 text-center hover:border-purple-400 hover:bg-purple-100 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                <Wrench className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-purple-700">Tambah Layanan</p>
                                <p className="text-xs text-purple-500 mt-0.5">Layanan baru</p>
                            </div>
                        </Link>

                        <Link
                            href={route('admin.promos.create')}
                            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 p-4 text-center hover:border-orange-400 hover:bg-orange-100 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                                <Tag className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-orange-700">Tambah Promo</p>
                                <p className="text-xs text-orange-500 mt-0.5">Kode promo baru</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Bookings */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Booking Terbaru</CardTitle>
                        <Link href={route('admin.bookings.index')} className="text-xs text-blue-600 hover:text-blue-500 flex items-center gap-1">
                            Lihat semua <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">Kode</th>
                                        <th className="py-2 pr-4 font-medium">Pelanggan</th>
                                        <th className="py-2 pr-4 font-medium">Layanan</th>
                                        <th className="py-2 pr-4 font-medium">Jadwal</th>
                                        <th className="py-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_bookings.map((booking) => {
                                        const s = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-800' };
                                        return (
                                            <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-2.5 pr-4 font-mono text-xs font-medium">{booking.booking_code}</td>
                                                <td className="py-2.5 pr-4">{booking.customer_name}</td>
                                                <td className="py-2.5 pr-4 text-gray-500">{booking.service?.name}</td>
                                                <td className="py-2.5 pr-4 text-gray-500">
                                                    {new Date(booking.scheduled_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </td>
                                                <td className="py-2.5">
                                                    <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
