import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { Booking, Invoice, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    booking: Booking & {
        service: { id: number; name: string; slug: string };
        user?: { id: number; name: string; email: string } | null;
        invoice?: Invoice | null;
    };
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Dalam Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
};

const TRANSITIONS: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};

export default function AdminBookingsShow({ booking }: Props) {
    const nextStatuses = TRANSITIONS[booking.status] ?? [];
    const s = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100' };

    const handleUpdateStatus = (newStatus: string) => {
        if (!confirm(`Ubah status ke "${statusConfig[newStatus]?.label}"?`)) return;
        router.patch(route('admin.bookings.update', booking.id), { status: newStatus });
    };

    return (
        <AdminLayout>
            <Head title={`Booking ${booking.booking_code} — GCM Book`} />

            <div className="space-y-5 max-w-3xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.bookings.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="font-mono text-sm font-medium text-gray-700">{booking.booking_code}</span>
                    </div>
                    <Badge className={cn(s.className)}>{s.label}</Badge>
                </div>

                {/* Customer Info */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base">Informasi Pelanggan</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-y-2.5 text-sm">
                        <span className="text-gray-500">Nama</span>
                        <span className="font-medium">{booking.customer_name}</span>
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium">{booking.customer_email}</span>
                        <span className="text-gray-500">Telepon</span>
                        <span className="font-medium">{booking.customer_phone}</span>
                        {booking.user && (
                            <>
                                <span className="text-gray-500">Akun</span>
                                <Link href={route('admin.users.show', booking.user.id)} className="text-blue-600 hover:underline font-medium">
                                    {booking.user.name}
                                </Link>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Booking Details */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base">Detail Booking</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-y-2.5 text-sm">
                        <span className="text-gray-500">Layanan</span>
                        <span className="font-medium">{booking.service?.name}</span>
                        <span className="text-gray-500">Nomor Antrian</span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            {booking.queue_number}
                        </span>
                        <span className="text-gray-500">Jadwal</span>
                        <span className="font-medium">
                            {new Date(booking.scheduled_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                        </span>
                        <span className="text-gray-500">Dibuat</span>
                        <span className="text-gray-500 text-xs">
                            {new Date(booking.created_at).toLocaleString('id-ID')}
                        </span>
                        {booking.notes && (
                            <>
                                <span className="text-gray-500">Catatan</span>
                                <span className="text-gray-700">{booking.notes}</span>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Vehicle / Details */}
                {booking.vehicle_details && Object.keys(booking.vehicle_details).length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Detail Kendaraan / Pindahan</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-2 text-sm">
                            {Object.entries(booking.vehicle_details).map(([key, value]) => (
                                <>
                                    <span key={`k-${key}`} className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                    <span key={`v-${key}`} className="font-medium">{value}</span>
                                </>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Invoice Link */}
                {booking.invoice ? (
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Invoice</CardTitle></CardHeader>
                        <CardContent className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium font-mono">{booking.invoice.invoice_number}</p>
                                <p className="text-gray-500">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.invoice.total)}
                                </p>
                            </div>
                            <Link
                                href={route('admin.invoices.show', booking.invoice.id)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-xs"
                            >
                                Lihat Invoice →
                            </Link>
                        </CardContent>
                    </Card>
                ) : (booking.status === 'completed' || booking.status === 'in_progress') && (
                    <Card className="border-0 shadow-sm border-dashed border-2 border-blue-200 bg-blue-50">
                        <CardContent className="py-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">Belum ada invoice</p>
                                <p className="text-xs text-blue-600 mt-0.5">Buat invoice untuk booking ini</p>
                            </div>
                            <Link
                                href={`${route('admin.invoices.create')}?booking_id=${booking.id}`}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                            >
                                <FileText className="h-4 w-4" /> Buat Invoice
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Status Actions */}
                {nextStatuses.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Ubah Status</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {nextStatuses.map((ns) => {
                                    const sc = statusConfig[ns];
                                    return (
                                        <button
                                            key={ns}
                                            onClick={() => handleUpdateStatus(ns)}
                                            disabled={false}
                                            className={cn(
                                                'px-4 py-2 rounded-md text-sm font-medium border transition-colors disabled:opacity-50',
                                                ns === 'cancelled'
                                                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                                                    : 'border-blue-300 bg-blue-600 text-white hover:bg-blue-500'
                                            )}
                                        >
                                            {sc?.label ?? ns}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
