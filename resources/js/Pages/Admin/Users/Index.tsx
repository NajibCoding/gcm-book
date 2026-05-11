import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Eye, Search, UserCheck } from 'lucide-react';
import { User, PageProps, PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UserWithRoles extends User {
    roles: { id: number; name: string }[];
    phone?: string;
    created_at: string;
}

interface Props extends PageProps {
    users: PaginatedData<UserWithRoles>;
    filters: { role?: string };
}

const ROLE_OPTIONS = ['all', 'super-admin', 'admin', 'staff', 'customer'];

const roleColor: Record<string, string> = {
    'super-admin': 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
    customer: 'bg-green-100 text-green-700',
};

export default function AdminUsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState('');

    const applyFilter = (params: Record<string, any>) => {
        router.get(route('admin.users.index'), { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search, page: 1 });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pengguna — GCM Book" />

            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Role Filter */}
                            <div className="flex flex-wrap gap-2">
                                {ROLE_OPTIONS.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => applyFilter({ role: r === 'all' ? undefined : r, page: 1 })}
                                        className={cn(
                                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                                            (filters.role ?? 'all') === r
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        )}
                                    >
                                        {r === 'all' ? 'Semua' : r}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama / email..."
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                                />
                                <button type="submit" className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200">
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th className="py-2 pr-4 font-medium">#</th>
                                        <th className="py-2 pr-4 font-medium">Nama</th>
                                        <th className="py-2 pr-4 font-medium">Email</th>
                                        <th className="py-2 pr-4 font-medium">Role</th>
                                        <th className="py-2 pr-4 font-medium">Terdaftar</th>
                                        <th className="py-2 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-400">Tidak ada data</td>
                                        </tr>
                                    ) : users.data.map((user, i) => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-2.5 pr-4 text-gray-400 text-xs">
                                                {(users.current_page - 1) * users.per_page + i + 1}
                                            </td>
                                            <td className="py-2.5 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 pr-4 text-gray-500">{user.email}</td>
                                            <td className="py-2.5 pr-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((role) => (
                                                        <Badge key={role.id} className={cn('text-xs', roleColor[role.name] ?? 'bg-gray-100 text-gray-600')}>
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-2.5 pr-4 text-gray-500 text-xs">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-2.5">
                                                <Link
                                                    href={route('admin.users.show', user.id)}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-xs"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Menampilkan {users.from}–{users.to} dari {users.total} pengguna
                                </p>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={cn(
                                                'px-3 py-1 rounded text-xs font-medium border transition-colors',
                                                link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
                                                !link.url && 'opacity-40 cursor-not-allowed',
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
