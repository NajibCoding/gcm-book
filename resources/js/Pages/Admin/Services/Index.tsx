import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Service, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import CurrencyInput from '@/Components/CurrencyInput';

interface Props extends PageProps {
    services: PaginatedData<Service>;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

type FormData = {
    name: string;
    slug: string;
    description: string;
    base_price: number | string;
    is_bookable: boolean;
};

function ServiceModal({
    service,
    onClose,
}: {
    service: Service | null;
    onClose: () => void;
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        name: service?.name ?? '',
        slug: service?.slug ?? '',
        description: service?.description ?? '',
        base_price: service?.base_price ?? 0,
        is_bookable: service?.is_bookable ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (service) {
            router.put(route('admin.services.update', service.id), data as any, {
                onSuccess: () => { onClose(); },
            });
        } else {
            router.post(route('admin.services.store'), data as any, {
                onSuccess: () => { onClose(); },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-base font-semibold text-gray-900">{service ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={submit} className="p-5 space-y-4">
                    {[
                        { key: 'name', label: 'Nama', type: 'text', placeholder: 'Detailing Motor Premium' },
                        { key: 'slug', label: 'Slug', type: 'text', placeholder: 'detailing-motor' },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                            <input
                                type={f.type}
                                value={(data as any)[f.key]}
                                onChange={(e) => setData(f.key as keyof FormData, e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[f.key as keyof typeof errors] && (
                                <p className="text-xs text-red-500 mt-1">{errors[f.key as keyof typeof errors]}</p>
                            )}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dasar</label>
                        <CurrencyInput
                            value={data.base_price as number}
                            onChange={(v) => setData('base_price', v)}
                            showPrefix
                            placeholder="50.000"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.base_price && <p className="text-xs text-red-500 mt-1">{errors.base_price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_bookable"
                            type="checkbox"
                            checked={data.is_bookable}
                            onChange={(e) => setData('is_bookable', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_bookable" className="text-sm text-gray-700">Bisa di-booking online</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2">
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {service ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminServicesIndex({ services }: Props) {
    const [modalService, setModalService] = useState<Service | null | 'new'>(null);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus layanan ini?')) {
            router.delete(route('admin.services.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Layanan — GCM Book" />
            {modalService !== null && (
                <ServiceModal service={modalService === 'new' ? null : modalService} onClose={() => setModalService(null)} />
            )}

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Layanan</h1>
                    <button
                        onClick={() => setModalService('new')}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" /> Tambah Layanan
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.data.map((service) => (
                        <Card key={service.id} className="border-0 shadow-sm">
                            <CardContent className="pt-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                            <Badge className={cn('text-xs', service.is_bookable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                                                {service.is_bookable ? 'Online' : 'Walk-in'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{service.description}</p>
                                        <p className="text-sm font-bold text-blue-600">{formatRupiah(service.base_price)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setModalService(service)}
                                        className="flex-1 flex items-center justify-center gap-1 rounded-md border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="flex items-center justify-center gap-1 rounded-md border border-red-200 py-1.5 px-3 text-xs text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
