import { Link, usePage, router } from '@inertiajs/react';
import {
    BookOpen,
    LayoutDashboard,
    CalendarCheck,
    FileText,
    ListOrdered,
    Wrench,
    Tag,
    Users,
    ChevronDown,
    LogOut,
} from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, routeName: 'admin.dashboard' },
    { label: 'Booking', href: '/admin/bookings', icon: CalendarCheck, routeName: 'admin.bookings.index' },
    { label: 'Invoice', href: '/admin/invoices', icon: FileText, routeName: 'admin.invoices.index' },
    { label: 'Antrian', href: '/admin/queue', icon: ListOrdered, routeName: 'admin.queue.index' },
    { label: 'Layanan', href: '/admin/services', icon: Wrench, routeName: 'admin.services.index' },
    { label: 'Promo', href: '/admin/promos', icon: Tag, routeName: 'admin.promos.index' },
    { label: 'Pengguna', href: '/admin/users', icon: Users, routeName: 'admin.users.index' },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as any;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Brand */}
                <div className="flex h-16 items-center px-6 border-b border-slate-700">
                    <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
                    <span className="text-lg font-bold">GCM Book</span>
                    <span className="ml-2 text-xs bg-blue-600 rounded px-1.5 py-0.5">Admin</span>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = route().current(item.routeName) ||
                            (typeof window !== 'undefined' && window.location.pathname.startsWith(item.href) && item.href !== '/admin');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 lg:flex-none" />

                    {/* User dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 py-2 px-3 rounded-md hover:bg-gray-100"
                        >
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                                {auth?.user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block font-medium">{auth?.user?.name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
