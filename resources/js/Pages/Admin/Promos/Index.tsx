import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Promo, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import CurrencyInput from '@/Components/CurrencyInput';

interface Props extends PageProps {
    promos: PaginatedData<Promo>;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

type FormData = {
    name: string;
    code: string;
    description: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number | string;
    min_order: number | string;
    max_usage: number | string;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
};

function PromoModal({ promo, onClose }: { promo: Promo | null; onClose: () => void }) {
    const { data, setData, processing, errors } = useForm<FormData>({
        name: promo?.name ?? '',
        code: promo?.code ?? '',
        description: promo?.description ?? '',
        discount_type: promo?.discount_type ?? 'percent',
        discount_value: promo?.discount_value ?? 0,
        min_order: promo?.min_order ?? 0,
        max_usage: promo?.max_usage ?? '',
        valid_from: promo?.valid_from?.slice(0, 10) ?? '',
        valid_until: promo?.valid_until?.slice(0, 10) ?? '',
        is_active: promo?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (promo) {
            router.put(route('admin.promos.update', promo.id), data as any, { onSuccess: onClose });
        } else {
            router.post(route('admin.promos.store'), data as any, { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-xl my-auto">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-base font-semibold">{promo ? 'Edit Promo' : 'Tambah Promo'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Promo</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                            <input type="text" value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Diskon</label>
                            <select value={data.discount_type} onChange={(e) => setData('discount_type', e.target.value as any)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option value="percent">Persentase (%)</option>
                                <option value="fixed">Nominal (Rp)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nilai Diskon{data.discount_type === 'fixed' ? ' (Rp)' : ' (%)'}
                            </label>
                            {data.discount_type === 'fixed' ? (
                                <CurrencyInput
                                    value={data.discount_value as number}
                                    onChange={(v) => setData('discount_value', v)}
                                    showPrefix
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                            ) : (
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={data.discount_value}
                                    onChange={(e) => setData('discount_value', Number(e.target.value))}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order</label>
                            <CurrencyInput
                                value={data.min_order as number}
                                onChange={(v) => setData('min_order', v)}
                                showPrefix
                                placeholder="0"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Penggunaan</label>
                            <input type="number" value={data.max_usage} onChange={(e) => setData('max_usage', e.target.value)} placeholder="Tak terbatas" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Dari</label>
                            <input type="date" value={data.valid_from} onChange={(e) => setData('valid_from', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Hingga</label>
                            <input type="date" value={data.valid_until} onChange={(e) => setData('valid_until', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input id="is_active" type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Promo aktif</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" disabled={processing} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2">
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {promo ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminPromosIndex({ promos }: Props) {
    const [modalPromo, setModalPromo] = useState<Promo | null | 'new'>(null);

    const handleDelete = (id: number) => {
        if (confirm('Hapus promo ini?')) router.delete(route('admin.promos.destroy', id));
    };

    return (
        <AdminLayout>
            <Head title="Kelola Promo — GCM Book" />
            {modalPromo !== null && <PromoModal promo={modalPromo === 'new' ? null : modalPromo} onClose={() => setModalPromo(null)} />}

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Promo</h1>
                    <button onClick={() => setModalPromo('new')} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                        <Plus className="h-4 w-4" /> Tambah Promo
                    </button>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">Nama</th>
                                        <th className="py-2 pr-4 font-medium">Kode</th>
                                        <th className="py-2 pr-4 font-medium">Diskon</th>
                                        <th className="py-2 pr-4 font-medium">Berlaku</th>
                                        <th className="py-2 pr-4 font-medium">Penggunaan</th>
                                        <th className="py-2 pr-4 font-medium">Status</th>
                                        <th className="py-2 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promos.data.length === 0 ? (
                                        <tr><td colSpan={7} className="py-8 text-center text-gray-400">Belum ada promo</td></tr>
                                    ) : promos.data.map((promo) => (
                                        <tr key={promo.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-2.5 pr-4 font-medium">{promo.name}</td>
                                            <td className="py-2.5 pr-4"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{promo.code}</code></td>
                                            <td className="py-2.5 pr-4 font-medium text-blue-600">
                                                {promo.discount_type === 'percent' ? `${promo.discount_value}%` : formatRupiah(promo.discount_value)}
                                            </td>
                                            <td className="py-2.5 pr-4 text-xs text-gray-500">
                                                {new Date(promo.valid_from).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} –{' '}
                                                {new Date(promo.valid_until).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-2.5 pr-4 text-xs text-gray-500">
                                                {promo.used_count ?? 0} / {promo.max_usage ?? '∞'}
                                            </td>
                                            <td className="py-2.5 pr-4">
                                                <Badge className={cn('text-xs', promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                                                    {promo.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => setModalPromo(promo)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Pencil className="h-3.5 w-3.5" /></button>
                                                    <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
