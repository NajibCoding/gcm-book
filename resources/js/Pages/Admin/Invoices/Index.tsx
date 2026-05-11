import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Download, Eye, Pencil, Plus } from 'lucide-react';
import { Invoice, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    invoices: PaginatedData<Invoice & { booking: { customer_name: string; booking_code: string } }>;
    filters: { status?: string };
}

const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    sent: { label: 'Terkirim', className: 'bg-blue-100 text-blue-700' },
    paid: { label: 'Lunas', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-700' },
};

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function AdminInvoicesIndex({ invoices, filters }: Props) {
    const currentTab = filters.status ?? 'all';

    return (
        <AdminLayout>
            <Head title="Kelola Invoice — GCM Book" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Invoice</h1>
                    <Link
                        href={route('admin.invoices.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Buat Invoice
                    </Link>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <Tabs value={currentTab} onValueChange={(v) => router.get(route('admin.invoices.index'), { status: v === 'all' ? undefined : v }, { preserveState: true, replace: true })}>
                            <TabsList>
                                <TabsTrigger value="all">Semua</TabsTrigger>
                                <TabsTrigger value="draft">Draft</TabsTrigger>
                                <TabsTrigger value="sent">Terkirim</TabsTrigger>
                                <TabsTrigger value="paid">Lunas</TabsTrigger>
                                <TabsTrigger value="cancelled">Batal</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">No. Invoice</th>
                                        <th className="py-2 pr-4 font-medium">Pelanggan</th>
                                        <th className="py-2 pr-4 font-medium">Booking</th>
                                        <th className="py-2 pr-4 font-medium">Total</th>
                                        <th className="py-2 pr-4 font-medium">Tanggal Dibuat</th>
                                        <th className="py-2 pr-4 font-medium">Status</th>
                                        <th className="py-2 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-400">Tidak ada data</td>
                                        </tr>
                                    ) : invoices.data.map((invoice) => {
                                        const s = statusConfig[invoice.status] ?? { label: invoice.status, className: 'bg-gray-100 text-gray-700' };
                                        return (
                                            <tr key={invoice.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-2.5 pr-4 font-mono text-xs font-medium text-gray-900">{invoice.invoice_number}</td>
                                                <td className="py-2.5 pr-4">{invoice.booking?.customer_name}</td>
                                                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{invoice.booking?.booking_code}</td>
                                                <td className="py-2.5 pr-4 font-medium">{formatRupiah(invoice.total)}</td>
                                                <td className="py-2.5 pr-4 text-xs text-gray-500">
                                                    {new Date(invoice.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-2.5 pr-4">
                                                    <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                                </td>
                                                <td className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('admin.invoices.show', invoice.id)}
                                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-xs"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.invoices.edit', invoice.id)}
                                                            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-500 text-xs"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <a
                                                            href={route('admin.invoices.download', invoice.id)}
                                                            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {invoices.last_page > 1 && (
                            <div className="flex justify-center gap-1.5 mt-5">
                                {invoices.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={cn(
                                            'px-3 py-1.5 rounded text-xs border',
                                            link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-40'
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
