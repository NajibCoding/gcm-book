import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem, PageProps } from '@/types';
import { useState } from 'react';

interface Props extends PageProps {
    invoice: Invoice & { items: InvoiceItem[] };
}

interface EditItem {
    id?: number;
    description: string;
    qty: number;
    unit_price: number;
}

const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function AdminInvoicesEdit({ invoice }: Props) {
    const initialItems: EditItem[] = (invoice.items ?? []).map((item) => ({
        id: item.id,
        description: item.description,
        qty: item.qty ?? 1,
        unit_price: item.unit_price,
    }));

    const [items, setItems] = useState<EditItem[]>(initialItems.length > 0 ? initialItems : [{ description: '', qty: 1, unit_price: 0 }]);

    const { data, setData, patch, processing, errors } = useForm<{
        items: EditItem[];
        discount_amount: string;
        tax_amount: string;
        notes: string;
    }>({
        items: items,
        discount_amount: String(invoice.discount_amount ?? 0),
        tax_amount: String(invoice.tax_amount ?? 0),
        notes: invoice.notes ?? '',
    });

    const addItem = () => {
        const newItems = [...items, { description: '', qty: 1, unit_price: 0 }];
        setItems(newItems);
        setData('items', newItems);
    };

    const removeItem = (idx: number) => {
        const newItems = items.filter((_, i) => i !== idx);
        setItems(newItems);
        setData('items', newItems);
    };

    const updateItem = (idx: number, field: keyof EditItem, value: string | number) => {
        const newItems = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
        setItems(newItems);
        setData('items', newItems);
    };

    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unit_price, 0);
    const discount = parseFloat(data.discount_amount || '0');
    const tax = parseFloat(data.tax_amount || '0');
    const total = subtotal - discount + tax;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.invoices.update', invoice.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Invoice ${invoice.invoice_number} — GCM Book`} />

            <div className="space-y-5 max-w-3xl">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.invoices.show', invoice.id)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <span className="text-gray-300">/</span>
                    <h1 className="text-xl font-bold text-gray-900">Edit Invoice <span className="font-mono">{invoice.invoice_number}</span></h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Items */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Item Invoice</CardTitle>
                            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500">
                                <Plus className="h-3.5 w-3.5" /> Tambah Item
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                                        <div className="col-span-5">
                                            {idx === 0 && <label className="text-xs text-gray-500 mb-1 block">Deskripsi</label>}
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                                placeholder="Deskripsi layanan"
                                                required
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            {idx === 0 && <label className="text-xs text-gray-500 mb-1 block">Qty</label>}
                                            <input
                                                type="number"
                                                value={item.qty}
                                                min={1}
                                                onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            {idx === 0 && <label className="text-xs text-gray-500 mb-1 block">Harga Satuan (Rp)</label>}
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                min={0}
                                                onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-end pb-2">
                                            {items.length > 1 && (
                                                <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-5 border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-gray-500 whitespace-nowrap">Diskon (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.discount_amount}
                                        min={0}
                                        onChange={(e) => setData('discount_amount', e.target.value)}
                                        className="w-36 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-gray-500 whitespace-nowrap">Pajak (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.tax_amount}
                                        min={0}
                                        onChange={(e) => setData('tax_amount', e.target.value)}
                                        className="w-36 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-between font-bold text-base border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-blue-700">{formatRupiah(total)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Catatan (Opsional)</CardTitle></CardHeader>
                        <CardContent>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                placeholder="Catatan tambahan untuk invoice..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={route('admin.invoices.show', invoice.id)}
                            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
