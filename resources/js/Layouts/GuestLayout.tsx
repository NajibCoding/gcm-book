import { Link, usePage } from '@inertiajs/react';
import { Menu, X, BookOpen } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GuestLayout({ children }: PropsWithChildren) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-7 w-7 text-blue-400" />
                            <span className="text-xl font-bold text-white">GCM Book</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/#layanan"
                                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Layanan
                            </Link>
                            <Link
                                href="/booking"
                                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Booking
                            </Link>
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="md:hidden text-slate-300 hover:text-white p-2"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-3">
                        <Link
                            href="/#layanan"
                            className="block text-slate-300 hover:text-white text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Layanan
                        </Link>
                        <Link
                            href="/booking"
                            className="block text-slate-300 hover:text-white text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Booking
                        </Link>
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="block text-blue-400 hover:text-blue-300 text-sm font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block text-blue-400 hover:text-blue-300 text-sm font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="h-6 w-6 text-blue-400" />
                                <span className="text-lg font-bold text-white">GCM Book</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Platform booking & invoicing terpercaya untuk layanan detailing motor dan jasa pindahan rumah.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Layanan</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/services" className="hover:text-white transition-colors">Detailing Motor</Link></li>
                                <li><Link href="/services" className="hover:text-white transition-colors">Jasa Pindahan</Link></li>
                                <li><Link href="/services" className="hover:text-white transition-colors">Cuci Motor</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Kontak</h3>
                            <ul className="space-y-2 text-sm">
                                <li>📧 info@gcmbook.com</li>
                                <li>📞 +62 812-3456-7890</li>
                                <li>📍 Jakarta, Indonesia</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
                        <p>© {new Date().getFullYear()} GCM Book. Semua hak dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

