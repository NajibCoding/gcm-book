import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { User, Booking, PageProps } from '@/types';
import { cn } from '@/lib/utils';

interface UserWithRoles extends User {
    roles: { id: number; name: string }[];
    phone?: string;
    created_at: string;
    bookings: (Booking & { service: { name: string } })[];
}

interface Props extends PageProps {
    user: UserWithRoles;
}

const roleColor: Record<string, string> = {
    'super-admin': 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
    customer: 'bg-green-100 text-green-700',
};

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'Proses', className: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Selesai', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Batal', className: 'bg-red-100 text-red-800' },
};

const ROLES = ['customer', 'staff', 'admin', 'super-admin'];

export default function AdminUsersShow({ user }: Props) {
    const { data, setData, patch, processing } = useForm({ role: user.roles?.[0]?.name ?? 'customer' });

    const handleRoleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout>
            <Head title={`Pengguna: ${user.name} — GCM Book`} />

            <div className="space-y-5 max-w-3xl">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.users.index')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </div>

                {/* User Info */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <CardTitle className="text-lg">{user.name}</CardTitle>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="flex gap-1 mt-1">
                                    {user.roles?.map((role) => (
                                        <Badge key={role.id} className={cn('text-xs', roleColor[role.name] ?? 'bg-gray-100 text-gray-600')}>
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-y-2 text-sm border-t pt-4">
                        <span className="text-gray-500">Telepon</span>
                        <span className="font-medium">{user.phone ?? '—'}</span>
                        <span className="text-gray-500">Terdaftar</span>
                        <span className="font-medium">{new Date(user.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                        <span className="text-gray-500">Total Booking</span>
                        <span className="font-medium">{user.bookings?.length ?? 0}</span>
                    </CardContent>
                </Card>

                {/* Role Management */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-4 w-4" /> Ubah Role</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleRoleUpdate} className="flex items-end gap-3">
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">Role Pengguna</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                Simpan
                            </button>
                        </form>
                    </CardContent>
                </Card>

                {/* Booking History */}
                <Card className="border-0 shadow-sm">
                    <CardHeader><CardTitle className="text-base">Riwayat Booking</CardTitle></CardHeader>
                    <CardContent>
                        {(!user.bookings || user.bookings.length === 0) ? (
                            <p className="text-sm text-gray-400 text-center py-4">Belum ada booking</p>
                        ) : (
                            <div className="space-y-2">
                                {user.bookings.map((booking) => {
                                    const s = statusConfig[booking.status] ?? { label: booking.status, className: 'bg-gray-100' };
                                    return (
                                        <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                                            <div>
                                                <p className="font-mono text-xs font-medium text-gray-700">{booking.booking_code}</p>
                                                <p className="text-gray-500">{booking.service?.name}</p>
                                                <p className="text-xs text-gray-400">{new Date(booking.scheduled_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                                            </div>
                                            <Badge className={cn('text-xs', s.className)}>{s.label}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
