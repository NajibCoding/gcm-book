import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Booking, PageProps } from '@/types';
import { useState, useEffect } from 'react';
import CurrencyInput from '@/Components/CurrencyInput';

interface Props extends PageProps {
    bookings: (Booking & { service: { id: number; name: string; base_price: number } })[];
}

interface InvoiceItem {
    description: string;
    qty: number;
    unit_price: number;
}

const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function AdminInvoicesCreate({ bookings }: Props) {
    const urlBookingId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('booking_id') ?? ''
        : '';

    const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, unit_price: 0 }]);

    const { data, setData, post, processing, errors } = useForm<{
        booking_id: string;
        customer_name: string;
        customer_email: string;
        items: InvoiceItem[];
        discount_amount: string;
        tax_amount: string;
        notes: string;
    }>({
        booking_id: urlBookingId,
        customer_name: '',
        customer_email: '',
        items: items,
        discount_amount: '0',
        tax_amount: '0',
        notes: '',
    });

    // Pre-fill when arriving from booking detail page
    useEffect(() => {
        if (urlBookingId) {
            const b = bookings.find((b) => String(b.id) === urlBookingId);
            if (b) {
                const newItems: InvoiceItem[] = [{ description: b.service?.name ?? 'Layanan', qty: 1, unit_price: b.service?.base_price ?? 0 }];
                setItems(newItems);
                setData((prev) => ({ ...prev, booking_id: urlBookingId, customer_name: b.customer_name, customer_email: b.customer_email, items: newItems }));
            }
        }
    }, []);

    const handleBookingSelect = (bookingId: string) => {
        setData('booking_id', bookingId);
        if (bookingId) {
            const b = bookings.find((b) => String(b.id) === bookingId);
            if (b) {
                setData((prev) => ({ ...prev, booking_id: bookingId, customer_name: b.customer_name, customer_email: b.customer_email }));
                const newItems: InvoiceItem[] = [{ description: b.service?.name ?? 'Layanan', qty: 1, unit_price: b.service?.base_price ?? 0 }];
                setItems(newItems);
                setData((prev) => ({ ...prev, items: newItems }));
            }
        }
    };

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

    const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
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
        post(route('admin.invoices.store'));
    };

    return (
        <AdminLayout>
            <Head title="Buat Invoice — GCM Book" />

            <div className="space-y-5 max-w-3xl">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.invoices.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                    <span className="text-gray-300">/</span>
                    <h1 className="text-xl font-bold text-gray-900">Buat Invoice Baru</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Booking Link */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Hubungkan ke Booking (Opsional)</CardTitle></CardHeader>
                        <CardContent>
                            <select
                                value={data.booking_id}
                                onChange={(e) => handleBookingSelect(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">— Pilih booking (opsional) —</option>
                                {bookings.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.booking_code} — {b.customer_name} ({b.service?.name})
                                    </option>
                                ))}
                            </select>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Informasi Pelanggan</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Nama <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customer_email && <p className="text-xs text-red-500 mt-1">{errors.customer_email}</p>}
                            </div>
                        </CardContent>
                    </Card>

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
                                            <CurrencyInput
                                                value={item.unit_price}
                                                onChange={(v) => updateItem(idx, 'unit_price', v)}
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
                                    <CurrencyInput
                                        value={parseFloat(data.discount_amount || '0')}
                                        onChange={(v) => setData('discount_amount', String(v))}
                                        className="w-36 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-gray-500 whitespace-nowrap">Pajak (Rp)</label>
                                    <CurrencyInput
                                        value={parseFloat(data.tax_amount || '0')}
                                        onChange={(v) => setData('tax_amount', String(v))}
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
                            href={route('admin.invoices.index')}
                            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Buat Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
