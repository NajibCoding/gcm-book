import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { PageProps } from '@/types';

interface Service {
    id: number;
    name: string;
    slug: string;
}

interface Props extends PageProps {
    services: Service[];
}

export default function AdminBookingsCreate({ services }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        scheduled_at: '',
        notes: '',
        vehicle_brand: '',
        vehicle_model: '',
        vehicle_color: '',
        vehicle_plate: '',
    });

    const selectedService = services.find((s) => s.id === Number(data.service_id));
    const isMotorService = selectedService?.slug?.includes('motor');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bookings.store'));
    };

    const inputClass = (field: string) =>
        `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            (errors as any)[field] ? 'border-red-400' : 'border-gray-300'
        }`;

    return (
        <AdminLayout>
            <Head title="Buat Booking — GCM Book" />

            <div className="space-y-5 max-w-2xl">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.bookings.index')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Buat Booking</h1>
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
                                    placeholder="Nama pelanggan"
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
                                    placeholder="email@contoh.com"
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
                                    placeholder="08xxxxxxxxxx"
                                    className={inputClass('customer_phone')}
                                />
                                {(errors as any).customer_phone && <p className="mt-1 text-xs text-red-500">{(errors as any).customer_phone}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                className={inputClass('scheduled_at')}
                            />
                            {(errors as any).scheduled_at && <p className="mt-1 text-xs text-red-500">{(errors as any).scheduled_at}</p>}
                        </CardContent>
                    </Card>

                    {/* Vehicle Details (motor services) */}
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
                                        placeholder="Honda, Yamaha..."
                                        className={inputClass('vehicle_brand')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_model}
                                        onChange={(e) => setData('vehicle_model', e.target.value)}
                                        placeholder="Vario, Nmax..."
                                        className={inputClass('vehicle_model')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_color}
                                        onChange={(e) => setData('vehicle_color', e.target.value)}
                                        placeholder="Hitam, Putih..."
                                        className={inputClass('vehicle_color')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                                    <input
                                        type="text"
                                        value={data.vehicle_plate}
                                        onChange={(e) => setData('vehicle_plate', e.target.value)}
                                        placeholder="B 1234 XYZ"
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
                                placeholder="Catatan tambahan..."
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
                            {processing ? 'Menyimpan...' : 'Buat Booking'}
                        </button>
                        <Link
                            href={route('admin.bookings.index')}
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
