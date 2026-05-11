import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { CalendarCheck, Clock, Hash, ArrowLeft } from 'lucide-react';
import { Booking, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    booking: Booking & { service: { name: string } };
}

const statusConfig: Record<string, { label: string; className: string; description: string }> = {
    pending: { label: 'Menunggu Konfirmasi', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', description: 'Booking Anda sedang menunggu konfirmasi dari tim kami.' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800 border-blue-200', description: 'Booking Anda telah dikonfirmasi. Harap datang sesuai jadwal.' },
    in_progress: { label: 'Sedang Dikerjakan', className: 'bg-purple-100 text-purple-800 border-purple-200', description: 'Layanan Anda sedang dalam proses pengerjaan.' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800 border-green-200', description: 'Layanan Anda telah selesai dikerjakan. Terima kasih!' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-800 border-red-200', description: 'Booking ini telah dibatalkan.' },
};

export default function BookingShow({ booking }: Props) {
    const status = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-800 border-gray-200', description: '' };

    return (
        <GuestLayout>
            <Head title={`Booking ${booking.booking_code} — GCM Book`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-xl px-4">
                    <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
                    </Link>

                    {/* Booking Code */}
                    <Card className="mb-4 border-0 shadow-lg">
                        <CardContent className="pt-8 pb-6 text-center">
                            <p className="text-sm font-medium text-slate-500 mb-2">Kode Booking</p>
                            <p className="text-3xl font-bold font-mono text-slate-900 tracking-widest">{booking.booking_code}</p>
                            <Badge className={cn('mt-4 px-4 py-1 text-sm font-medium border', status.className)}>
                                {status.label}
                            </Badge>
                            <p className="text-sm text-slate-500 mt-3">{status.description}</p>
                        </CardContent>
                    </Card>

                    {/* Queue Number */}
                    <Card className="mb-4 bg-blue-600 text-white border-0 shadow-lg">
                        <CardContent className="pt-6 pb-5 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Hash className="h-5 w-5" />
                                <p className="text-sm font-medium opacity-80">Nomor Antrian</p>
                            </div>
                            <p className="text-6xl font-extrabold">{String(booking.queue_number).padStart(3, '0')}</p>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base">Detail Booking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <DetailRow icon={<CalendarCheck className="h-4 w-4 text-blue-500" />} label="Layanan" value={booking.service?.name ?? '-'} />
                            <DetailRow icon={<Clock className="h-4 w-4 text-blue-500" />} label="Jadwal" value={new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} />

                            <hr className="border-gray-100 my-2" />

                            <DetailRow label="Nama" value={booking.customer_name} />
                            <DetailRow label="Email" value={booking.customer_email} />
                            <DetailRow label="Telepon" value={booking.customer_phone} />

                            {booking.vehicle_details && Object.keys(booking.vehicle_details).length > 0 && (
                                <>
                                    <hr className="border-gray-100 my-2" />
                                    {Object.entries(booking.vehicle_details).map(([k, v]) => (
                                        <DetailRow key={k} label={k.replace(/_/g, ' ')} value={v} />
                                    ))}
                                </>
                            )}

                            {booking.notes && (
                                <>
                                    <hr className="border-gray-100 my-2" />
                                    <DetailRow label="Catatan" value={booking.notes} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Simpan kode booking Anda untuk melacak status layanan.
                        </p>
                        <Link
                            href="/booking"
                            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                            Buat Booking Lain
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

function DetailRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2 justify-between">
            <div className="flex items-center gap-2 text-gray-500 capitalize shrink-0">
                {icon}
                {label}
            </div>
            <span className="font-medium text-gray-900 text-right">{value}</span>
        </div>
    );
}
