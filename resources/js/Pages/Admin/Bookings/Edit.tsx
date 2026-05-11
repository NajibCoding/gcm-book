import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Booking, PageProps } from '@/types';

interface Service {
    id: number;
    name: string;
    slug: string;
}

interface Props extends PageProps {
    booking: Booking & { service: Service };
    services: Service[];
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    in_progress: 'Dalam Proses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function AdminBookingsEdit({ booking, services }: Props) {
    const vehicle = (booking.vehicle_details as any) ?? {};

    const { data, setData, put, processing, errors } = useForm({
        service_id: String(booking.service_id ?? ''),
        customer_name: booking.customer_name ?? '',
        customer_email: booking.customer_email ?? '',
        customer_phone: booking.customer_phone ?? '',
        scheduled_at: booking.scheduled_at
            ? new Date(booking.scheduled_at).toISOString().slice(0, 16)
            : '',
        status: booking.status ?? 'pending',
        notes: booking.notes ?? '',
        vehicle_brand: vehicle.brand ?? '',
        vehicle_model: vehicle.model ?? '',
        vehicle_color: vehicle.color ?? '',
        vehicle_plate: vehicle.plate_number ?? '',
    });

    const selectedService = services.find((s) => s.id === Number(data.service_id));
    const isMotorService = selectedService?.slug?.includes('motor');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.bookings.update-details', booking.id));
    };

    const inputClass = (field: string) =>
        `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            (errors as any)[field] ? 'border-red-400' : 'border-gray-300'
        }`;

    return (
        <AdminLayout>
            <Head title={`Edit Booking ${booking.booking_code} — GCM Book`} />

            <div className="space-y-5 max-w-2xl">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.bookings.show', booking.id)}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
                        <p className="text-xs font-mono text-gray-500">{booking.booking_code}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Layanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <select
                                value={data.service_id}
                                onChange={(e) => setData('service_id', e.target.value)}
                                className={inputClass('service_id')}
                            >
                                <option value="">Pilih Layanan</option>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {(errors as any).service_id && <p className="mt-1 text-xs text-red-500">{(errors as any).service_id}</p>}
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Info Pelanggan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className={inputClass('customer_name')}
                                />
                                {(errors as any).customer_name && <p className="mt-1 text-xs text-red-500">{(errors as any).customer_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    className={inputClass('customer_email')}
                                />
                                {(errors as any).customer_email && <p className="mt-1 text-xs text-red-500">{(errors as any).customer_email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className={inputClass('customer_phone')}
                                />
                                {(errors as any).customer_phone && <p className="mt-1 text-xs text-red-500">{(errors as any).customer_phone}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Status */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Jadwal & Status</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
                                <input
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    className={inputClass('scheduled_at')}
                                />
                                {(errors as any).scheduled_at && <p className="mt-1 text-xs text-red-500">{(errors as any).scheduled_at}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled')}
                                    className={inputClass('status')}
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{STATUS_LABELS[opt]}</option>
                                    ))}
                                </select>
                                {(errors as any).status && <p className="mt-1 text-xs text-red-500">{(errors as any).status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Details */}
                    {isMotorService && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Detail Kendaraan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_brand}
                                        onChange={(e) => setData('vehicle_brand', e.target.value)}
                                        className={inputClass('vehicle_brand')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_model}
                                        onChange={(e) => setData('vehicle_model', e.target.value)}
                                        className={inputClass('vehicle_model')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_color}
                                        onChange={(e) => setData('vehicle_color', e.target.value)}
                                        className={inputClass('vehicle_color')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_plate}
                                        onChange={(e) => setData('vehicle_plate', e.target.value)}
                                        className={inputClass('vehicle_plate')}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Catatan (Opsional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                className={inputClass('notes')}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <Link
                            href={route('admin.bookings.show', booking.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
