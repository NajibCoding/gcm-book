import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Eye } from 'lucide-react';
import { Booking, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    bookings: PaginatedData<Booking>;
    filters: { status?: string };
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-800' },
};

const TABS = [
    { value: 'all', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Batal' },
];

export default function BookingIndex({ bookings, filters }: Props) {
    const currentTab = filters.status ?? 'all';

    const handleTabChange = (value: string) => {
        router.get(route('bookings.index'), { status: value === 'all' ? undefined : value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Riwayat Booking</h2>}>
            <Head title="Riwayat Booking" />

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <CardTitle>Semua Booking</CardTitle>
                        <Link
                            href="/booking"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                        >
                            + Booking Baru
                        </Link>
                    </div>

                    <Tabs value={currentTab} onValueChange={handleTabChange}>
                        <TabsList>
                            {TABS.map((t) => (
                                <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardHeader>

                <CardContent>
                    {bookings.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-slate-500">Belum ada booking.</p>
                            <Link href="/booking" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                                Buat booking pertama Anda →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-slate-500">
                                        <th className="py-3 pr-4 font-medium">Kode</th>
                                        <th className="py-3 pr-4 font-medium">Layanan</th>
                                        <th className="py-3 pr-4 font-medium">Jadwal</th>
                                        <th className="py-3 pr-4 font-medium">Status</th>
                                        <th className="py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.data.map((booking) => {
                                        const s = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-800' };
                                        return (
                                            <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-3 pr-4 font-mono text-xs font-medium text-slate-900">{booking.booking_code}</td>
                                                <td className="py-3 pr-4">{booking.service?.name}</td>
                                                <td className="py-3 pr-4 text-slate-500">
                                                    {new Date(booking.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <Link
                                                        href={`/booking/${booking.booking_code}`}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-xs font-medium"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" /> Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {bookings.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={cn(
                                        'px-3 py-1.5 rounded text-sm border',
                                        link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-40'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
