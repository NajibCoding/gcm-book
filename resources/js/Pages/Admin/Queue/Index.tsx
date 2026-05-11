import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Eye, Hash, Users, Clock } from 'lucide-react';
import { PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface QueueEntry {
    id: number;
    booking_code: string;
    customer_name: string;
    queue_number: number;
    scheduled_at: string;
    status: string;
    service: { name: string; slug: string };
}

interface ServiceQueue {
    service: { id: number; name: string; slug: string };
    today_count: number;
    current_number: number;
    entries: QueueEntry[];
}

interface Props extends PageProps {
    queues: ServiceQueue[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Konfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-800' },
};

export default function AdminQueueIndex({ queues }: Props) {
    const updateStatus = (bookingCode: string, status: string) => {
        router.patch(route('admin.queue.update-status', bookingCode), { status }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Antrian — GCM Book" />

            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-gray-900">Kelola Antrian</h1>
                <p className="text-sm text-gray-500">Antrian hari ini per layanan</p>

                {queues.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-12 text-center text-gray-400">Tidak ada data antrian hari ini.</CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue={queues[0]?.service.slug}>
                        <TabsList className="mb-4">
                            {queues.map((q) => (
                                <TabsTrigger key={q.service.slug} value={q.service.slug}>
                                    {q.service.name}
                                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                        {q.today_count}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {queues.map((q) => (
                            <TabsContent key={q.service.slug} value={q.service.slug}>
                                {/* Stats row */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-100"><Users className="h-4 w-4 text-blue-600" /></div>
                                                <div>
                                                    <p className="text-lg font-bold">{q.today_count}</p>
                                                    <p className="text-xs text-gray-500">Total Antrian</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-100"><Hash className="h-4 w-4 text-purple-600" /></div>
                                                <div>
                                                    <p className="text-lg font-bold">{String(q.current_number).padStart(3, '0')}</p>
                                                    <p className="text-xs text-gray-500">Nomor Terkini</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Queue table */}
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b text-left text-gray-500">
                                                        <th className="py-2 pr-4 font-medium">No.</th>
                                                        <th className="py-2 pr-4 font-medium">Kode</th>
                                                        <th className="py-2 pr-4 font-medium">Pelanggan</th>
                                                        <th className="py-2 pr-4 font-medium">Waktu</th>
                                                        <th className="py-2 pr-4 font-medium">Status</th>
                                                        <th className="py-2 font-medium">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {q.entries.length === 0 ? (
                                                        <tr><td colSpan={6} className="py-8 text-center text-gray-400">Tidak ada antrian</td></tr>
                                                    ) : q.entries.map((entry) => {
                                                        const s = statusConfig[entry.status] ?? { label: entry.status, className: 'bg-gray-100 text-gray-700' };
                                                        return (
                                                            <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                                                                <td className="py-2.5 pr-4">
                                                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                                                                        {String(entry.queue_number).padStart(2, '0')}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2.5 pr-4 font-mono text-xs font-medium">{entry.booking_code}</td>
                                                                <td className="py-2.5 pr-4">{entry.customer_name}</td>
                                                                <td className="py-2.5 pr-4 text-xs text-gray-500 flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(entry.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                                </td>
                                                                <td className="py-2.5 pr-4">
                                                                    <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                                                </td>
                                                                <td className="py-2.5">
                                                                    <div className="flex gap-1 flex-wrap">
                                                                        <Link
                                                                            href={route('admin.bookings.show', entry.id)}
                                                                            className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 inline-flex items-center gap-1"
                                                                        >
                                                                            <Eye className="h-3 w-3" /> Detail
                                                                        </Link>
                                                                        {entry.status === 'confirmed' && (
                                                                            <button
                                                                                onClick={() => updateStatus(entry.booking_code, 'in_progress')}
                                                                                className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium hover:bg-purple-200"
                                                                            >
                                                                                Mulai
                                                                            </button>
                                                                        )}
                                                                        {entry.status === 'in_progress' && (
                                                                            <button
                                                                                onClick={() => updateStatus(entry.booking_code, 'completed')}
                                                                                className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200"
                                                                            >
                                                                                Selesai
                                                                            </button>
                                                                        )}
                                                                        {(entry.status === 'pending' || entry.status === 'confirmed') && (
                                                                            <button
                                                                                onClick={() => updateStatus(entry.booking_code, 'cancelled')}
                                                                                className="px-2 py-1 rounded bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100"
                                                                            >
                                                                                Batal
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </AdminLayout>
    );
}
