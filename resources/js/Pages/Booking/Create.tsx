import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Wrench, Truck, Droplets, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { Service, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    services: Service[];
}

const serviceIcons: Record<string, React.ReactNode> = {
    'detailing-motor': <Wrench className="h-6 w-6" />,
    'jasa-pindahan': <Truck className="h-6 w-6" />,
    'cuci-motor': <Droplets className="h-6 w-6" />,
};

const STEPS = ['Pilih Layanan', 'Detail', 'Jadwal & Kontak', 'Konfirmasi'];

export default function BookingCreate({ services }: Props) {
    const [step, setStep] = useState(0);
    const [promoStatus, setPromoStatus] = useState<{ valid: boolean; message: string; promo?: any } | null>(null);
    const [checkingPromo, setCheckingPromo] = useState(false);

    const { data, setData, post, processing, errors } = useForm<{
        service_id: number | null;
        vehicle_details: Record<string, string>;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        scheduled_at: string;
        notes: string;
        promo_code: string;
        promo_id: number | null;
    }>({
        service_id: null,
        vehicle_details: {},
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        scheduled_at: '',
        notes: '',
        promo_code: '',
        promo_id: null,
    });

    const selectedService = services.find((s) => s.id === data.service_id);

    const checkPromo = async () => {
        if (!data.promo_code) return;
        setCheckingPromo(true);
        try {
            const res = await fetch(`/api/promo/check?code=${encodeURIComponent(data.promo_code)}`);
            const json = await res.json();
            setPromoStatus(json);
            if (json.valid) {
                setData('promo_id', json.promo.id);
            } else {
                setData('promo_id', null);
            }
        } finally {
            setCheckingPromo(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('booking.store'));
    };

    const getVehicleFields = () => {
        if (!selectedService) return [];
        switch (selectedService.slug) {
            case 'detailing-motor':
                return [
                    { key: 'merk', label: 'Merk Motor', type: 'text', placeholder: 'Honda, Yamaha, ...' },
                    { key: 'model', label: 'Model', type: 'text', placeholder: 'Beat, Vario, ...' },
                    { key: 'tahun', label: 'Tahun', type: 'text', placeholder: '2020' },
                    { key: 'plat_nomor', label: 'Plat Nomor', type: 'text', placeholder: 'B 1234 XX' },
                    { key: 'kondisi', label: 'Kondisi Motor', type: 'textarea', placeholder: 'Deskripsikan kondisi motor...' },
                ];
            case 'jasa-pindahan':
                return [
                    { key: 'alamat_asal', label: 'Alamat Asal', type: 'text', placeholder: 'Jl. Contoh No. 1' },
                    { key: 'alamat_tujuan', label: 'Alamat Tujuan', type: 'text', placeholder: 'Jl. Tujuan No. 2' },
                    { key: 'estimasi_barang', label: 'Estimasi Barang', type: 'textarea', placeholder: 'Daftar barang yang akan dipindahkan...' },
                    { key: 'lantai_asal', label: 'Lantai Asal', type: 'select', options: Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: `Lantai ${i + 1}` })) },
                    { key: 'lantai_tujuan', label: 'Lantai Tujuan', type: 'select', options: Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: `Lantai ${i + 1}` })) },
                ];
            default:
                return [];
        }
    };

    const formatRupiah = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <GuestLayout>
            <Head title="Booking Layanan — GCM Book" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-2xl px-4">
                    {/* Steps indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {STEPS.map((s, i) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={cn(
                                        'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                                        i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                    )}>
                                        {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                                    </div>
                                    <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-blue-600' : 'text-gray-400')}>
                                        {s}
                                    </span>
                                    {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300 ml-2" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Pilih Layanan */}
                        {step === 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pilih Layanan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {services.map((service) => (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => setData('service_id', service.id)}
                                            className={cn(
                                                'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left',
                                                data.service_id === service.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300 bg-white'
                                            )}
                                        >
                                            <div className={cn('p-2 rounded-lg', data.service_id === service.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500')}>
                                                {serviceIcons[service.slug] ?? <Wrench className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">{service.name}</p>
                                                <p className="text-sm text-slate-500 mt-0.5">{service.description?.substring(0, 80)}...</p>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600">{formatRupiah(service.base_price)}</span>
                                        </button>
                                    ))}
                                    {errors.service_id && <p className="text-sm text-red-500">{errors.service_id}</p>}
                                    <button
                                        type="button"
                                        disabled={!data.service_id}
                                        onClick={() => setStep(1)}
                                        className="w-full mt-4 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Lanjut →
                                    </button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Vehicle Details */}
                        {step === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail {selectedService?.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {getVehicleFields().map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    value={data.vehicle_details[field.key] ?? ''}
                                                    onChange={(e) => setData('vehicle_details', { ...data.vehicle_details, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    value={data.vehicle_details[field.key] ?? '1'}
                                                    onChange={(e) => setData('vehicle_details', { ...data.vehicle_details, [field.key]: e.target.value })}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {field.options?.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={data.vehicle_details[field.key] ?? ''}
                                                    onChange={(e) => setData('vehicle_details', { ...data.vehicle_details, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex gap-3 mt-4">
                                        <button type="button" onClick={() => setStep(0)} className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            ← Kembali
                                        </button>
                                        <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500">
                                            Lanjut →
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Schedule & Contact */}
                        {step === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jadwal & Informasi Kontak</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { key: 'customer_name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda' },
                                        { key: 'customer_email', label: 'Email', type: 'email', placeholder: 'email@contoh.com' },
                                        { key: 'customer_phone', label: 'Nomor Telepon', type: 'tel', placeholder: '08xxxxxxxxxx' },
                                    ].map((f) => (
                                        <div key={f.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                            <input
                                                type={f.type}
                                                value={(data as any)[f.key]}
                                                onChange={(e) => setData(f.key as any, e.target.value)}
                                                placeholder={f.placeholder}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors[f.key as keyof typeof errors] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[f.key as keyof typeof errors]}</p>
                                            )}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                                        <input
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={(e) => setData('scheduled_at', e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.scheduled_at && <p className="text-xs text-red-500 mt-1">{errors.scheduled_at}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                                        <textarea
                                            rows={2}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Catatan tambahan..."
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo (opsional)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={data.promo_code}
                                                onChange={(e) => { setData('promo_code', e.target.value); setPromoStatus(null); }}
                                                placeholder="Masukkan kode promo"
                                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={checkPromo}
                                                disabled={checkingPromo || !data.promo_code}
                                                className="px-4 rounded-md border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 disabled:opacity-50"
                                            >
                                                {checkingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cek'}
                                            </button>
                                        </div>
                                        {promoStatus && (
                                            <p className={cn('text-xs mt-1', promoStatus.valid ? 'text-green-600' : 'text-red-500')}>
                                                {promoStatus.valid
                                                    ? `✓ ${promoStatus.promo.name} — ${promoStatus.promo.discount_type === 'percent' ? promoStatus.promo.discount_value + '%' : formatRupiah(promoStatus.promo.discount_value)} diskon`
                                                    : promoStatus.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            ← Kembali
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!data.customer_name || !data.customer_email || !data.customer_phone || !data.scheduled_at}
                                            onClick={() => setStep(3)}
                                            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                                        >
                                            Lanjut →
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 4: Confirmation */}
                        {step === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Konfirmasi Booking</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                                        <Row label="Layanan" value={selectedService?.name ?? '-'} />
                                        <Row label="Nama" value={data.customer_name} />
                                        <Row label="Email" value={data.customer_email} />
                                        <Row label="Telepon" value={data.customer_phone} />
                                        <Row label="Jadwal" value={data.scheduled_at ? new Date(data.scheduled_at).toLocaleString('id-ID') : '-'} />
                                        {Object.entries(data.vehicle_details).map(([k, v]) => (
                                            <Row key={k} label={k.replace(/_/g, ' ')} value={v} />
                                        ))}
                                        {data.notes && <Row label="Catatan" value={data.notes} />}
                                        {promoStatus?.valid && <Row label="Promo" value={promoStatus.promo.code} />}
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            ← Kembali
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Konfirmasi & Kirim
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-500 capitalize">{label}</span>
            <span className="font-medium text-gray-900 text-right max-w-xs">{value}</span>
        </div>
    );
}
