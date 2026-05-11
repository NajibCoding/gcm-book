import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Download, Send, QrCode, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Invoice, InvoiceItem, Payment, PageProps } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Props extends PageProps {
    invoice: Invoice & {
        booking: { customer_name: string; customer_email: string; customer_phone: string; booking_code: string; scheduled_at: string; service: { name: string } };
        items: InvoiceItem[];
        payments: Payment[];
    };
}

const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    sent: { label: 'Terkirim', className: 'bg-blue-100 text-blue-700' },
    paid: { label: 'Lunas', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-700' },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'text-yellow-600' },
    paid: { label: 'Lunas', className: 'text-green-600' },
    failed: { label: 'Gagal', className: 'text-red-600' },
    expired: { label: 'Kadaluarsa', className: 'text-gray-500' },
    cancelled: { label: 'Batal', className: 'text-gray-500' },
};

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function AdminInvoicesShow({ invoice }: Props) {
    const [qrisData, setQrisData] = useState<{ qr_string: string; payment_id: number } | null>(null);
    const [creatingQris, setCreatingQris] = useState(false);
    const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    const { post, processing } = useForm();

    const status = statusConfig[invoice.status] ?? { label: invoice.status, className: 'bg-gray-100' };

    const handleSendEmail = () => {
        if (confirm('Kirim invoice ke email pelanggan?')) {
            router.post(route('admin.invoices.send', invoice.id));
        }
    };

    const createQris = async () => {
        setCreatingQris(true);
        try {
            const res = await fetch(route('payment.create'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content ?? '' },
                body: JSON.stringify({ invoice_id: invoice.id }),
            });
            const json = await res.json();
            if (json.qr_string) {
                setQrisData(json);
                startPolling(json.payment_id);
            }
        } finally {
            setCreatingQris(false);
        }
    };

    const startPolling = (paymentId: number) => {
        const interval = setInterval(async () => {
            const res = await fetch(route('payment.status', paymentId));
            const json = await res.json();
            if (json.status && json.status !== 'pending') {
                setPaymentStatus(json.status);
                clearInterval(interval);
                setPollInterval(null);
                if (json.status === 'paid') {
                    setTimeout(() => router.reload(), 2000);
                }
            }
        }, 3000);
        setPollInterval(interval);
    };

    useEffect(() => {
        return () => { if (pollInterval) clearInterval(pollInterval); };
    }, [pollInterval]);

    const renderQr = async () => {
        if (!qrisData?.qr_string) return null;
        try {
            const QRCode = (await import('qrcode')).default;
            return await QRCode.toDataURL(qrisData.qr_string);
        } catch { return null; }
    };

    return (
        <AdminLayout>
            <Head title={`Invoice ${invoice.invoice_number} — GCM Book`} />

            <div className="space-y-5 max-w-3xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h1>
                        <Badge className={cn('mt-1', status.className)}>{status.label}</Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <a
                            href={route('admin.invoices.download', invoice.id)}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Download className="h-4 w-4" /> Unduh PDF
                        </a>
                        {invoice.status === 'draft' && (
                            <button
                                onClick={handleSendEmail}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                            >
                                <Send className="h-4 w-4" /> Kirim Email
                            </button>
                        )}
                    </div>
                </div>

                {/* Customer Info */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base">Informasi Pelanggan</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-500">Nama</span>
                        <span className="font-medium">{invoice.booking?.customer_name}</span>
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium">{invoice.booking?.customer_email}</span>
                        <span className="text-gray-500">Telepon</span>
                        <span className="font-medium">{invoice.booking?.customer_phone}</span>
                        <span className="text-gray-500">Booking</span>
                        <span className="font-mono text-xs font-medium">{invoice.booking?.booking_code}</span>
                        <span className="text-gray-500">Layanan</span>
                        <span className="font-medium">{invoice.booking?.service?.name}</span>
                        <span className="text-gray-500">Jadwal</span>
                        <span className="font-medium">{new Date(invoice.booking?.scheduled_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                    </CardContent>
                </Card>

                {/* Invoice Items */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base">Rincian Invoice</CardTitle></CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-gray-500">
                                    <th className="py-2 font-medium">Deskripsi</th>
                                    <th className="py-2 text-right font-medium">Qty</th>
                                    <th className="py-2 text-right font-medium">Harga</th>
                                    <th className="py-2 text-right font-medium">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items?.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="py-2">{item.description}</td>
                                        <td className="py-2 text-right">{item.qty}</td>
                                        <td className="py-2 text-right">{formatRupiah(item.unit_price)}</td>
                                        <td className="py-2 text-right font-medium">{formatRupiah(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 space-y-1.5 text-sm border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{formatRupiah(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Diskon</span>
                                    <span>- {formatRupiah(invoice.discount_amount)}</span>
                                </div>
                            )}
                            {invoice.tax_amount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pajak</span>
                                    <span>{formatRupiah(invoice.tax_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                                <span>Total</span>
                                <span>{formatRupiah(invoice.total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* QRIS Payment */}
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><QrCode className="h-4 w-4" /> Pembayaran QRIS</CardTitle></CardHeader>
                        <CardContent>
                            {!qrisData && !paymentStatus && (
                                <button
                                    onClick={createQris}
                                    disabled={creatingQris}
                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                                >
                                    {creatingQris ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                                    Buat QRIS
                                </button>
                            )}

                            {qrisData && !paymentStatus && (
                                <QrisDisplay qrString={qrisData.qr_string} />
                            )}

                            {paymentStatus === 'paid' && (
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <CheckCircle className="h-5 w-5" /> Pembayaran berhasil!
                                </div>
                            )}

                            {paymentStatus && paymentStatus !== 'paid' && (
                                <div className="flex items-center gap-2 text-red-500 font-medium">
                                    <XCircle className="h-5 w-5" /> Pembayaran {paymentStatus}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base">Riwayat Pembayaran</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {invoice.payments.map((payment) => {
                                    const ps = paymentStatusConfig[payment.status] ?? { label: payment.status, className: 'text-gray-500' };
                                    return (
                                        <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                                            <div>
                                                <p className="font-medium">{payment.payment_method.toUpperCase()} — {formatRupiah(payment.amount)}</p>
                                                <p className="text-xs text-gray-400">{new Date(payment.created_at).toLocaleString('id-ID')}</p>
                                            </div>
                                            <span className={cn('text-xs font-medium', ps.className)}>{ps.label}</span>
                                        </div>
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

function QrisDisplay({ qrString }: { qrString: string }) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        import('qrcode').then((qr) => {
            qr.default.toDataURL(qrString).then(setImgSrc).catch(() => {});
        });
    }, [qrString]);

    if (!imgSrc) return <div className="h-48 w-48 flex items-center justify-center bg-gray-50 rounded"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

    return (
        <div className="text-center">
            <img src={imgSrc} alt="QRIS Payment" className="mx-auto rounded-lg border border-gray-200" style={{ width: 200, height: 200 }} />
            <p className="text-xs text-gray-500 mt-2">Scan QR Code menggunakan aplikasi pembayaran Anda</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-yellow-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Menunggu pembayaran...</span>
            </div>
        </div>
    );
}
