import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { Booking, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props extends PageProps {
    bookings: PaginatedData<Booking & { service: { name: string } }>;
    filters: { status?: string; search?: string };
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-800' },
};

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function AdminBookingsIndex({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = (params: Record<string, any>) => {
        router.get(route('admin.bookings.index'), { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search, page: 1 });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Booking — GCM Book" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
                    <Link
                        href={route('admin.bookings.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Buat Booking
                    </Link>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => applyFilter({ status: s === 'all' ? undefined : s, page: 1 })}
                                        className={cn(
                                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                            (filters.status ?? 'all') === s
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        )}
                                    >
                                        {s === 'all' ? 'Semua' : (statusConfig[s]?.label ?? s)}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari kode / nama..."
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                                />
                                <button type="submit" className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200">
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">#</th>
                                        <th className="py-2 pr-4 font-medium">Kode</th>
                                        <th className="py-2 pr-4 font-medium">Pelanggan</th>
                                        <th className="py-2 pr-4 font-medium">Layanan</th>
                                        <th className="py-2 pr-4 font-medium">Antrian</th>
                                        <th className="py-2 pr-4 font-medium">Jadwal</th>
                                        <th className="py-2 pr-4 font-medium">Status</th>
                                        <th className="py-2 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-gray-400">Tidak ada data</td>
                                        </tr>
                                    ) : bookings.data.map((booking, i) => {
                                        const s = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-800' };
                                        return (
                                            <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-2.5 pr-4 text-gray-400 text-xs">
                                                    {(bookings.current_page - 1) * bookings.per_page + i + 1}
                                                </td>
                                                <td className="py-2.5 pr-4 font-mono text-xs font-medium text-gray-900">{booking.booking_code}</td>
                                                <td className="py-2.5 pr-4">
                                                    <p className="font-medium">{booking.customer_name}</p>
                                                    <p className="text-xs text-gray-400">{booking.customer_phone}</p>
                                                </td>
                                                <td className="py-2.5 pr-4 text-gray-500">{booking.service?.name}</td>
                                                <td className="py-2.5 pr-4 text-center">
                                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                        {booking.queue_number}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 pr-4 text-gray-500 text-xs">
                                                    {new Date(booking.scheduled_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-2.5 pr-4">
                                                    <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                                </td>
                                                <td className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('admin.bookings.show', booking.id)}
                                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-xs font-medium"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" /> Detail
                                                        </Link>
                                                        <Link
                                                            href={route('admin.bookings.edit', booking.id)}
                                                            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-500 text-xs font-medium"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" /> Edit
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {bookings.last_page > 1 && (
                            <div className="flex justify-center gap-1.5 mt-5">
                                {bookings.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={cn(
                                            'px-3 py-1.5 rounded text-xs border',
                                            link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-40'
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
