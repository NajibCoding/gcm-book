import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Wrench, Truck, Droplets, CheckCircle, ArrowRight, Star, CalendarCheck } from 'lucide-react';
import { Promo, Service } from '@/types';

interface Props {
    promos: Promo[];
    services: Service[];
}

const serviceIcons: Record<string, React.ReactNode> = {
    'detailing-motor': <Wrench className="h-8 w-8 text-blue-500" />,
    'jasa-pindahan': <Truck className="h-8 w-8 text-blue-500" />,
    'cuci-motor': <Droplets className="h-8 w-8 text-blue-500" />,
};

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function Welcome({ promos, services }: Props) {
    return (
        <GuestLayout>
            <Head title="GCM Book — Booking & Invoicing Terpercaya" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 to-slate-700 text-white overflow-hidden">
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
                    <Badge className="mb-6 bg-blue-600/30 text-blue-200 border-blue-500/50 text-sm px-3 py-1">
                        🚀 Platform Booking Modern
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        Solusi Terpercaya untuk
                        <span className="text-blue-400 block">Detailing Motor &amp; Jasa Pindahan</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Pesan layanan kapan saja, terima nomor antrian instan, hasil terjamin. Proses cepat, transparan, dan profesional.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/booking"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg"
                        >
                            <CalendarCheck className="h-5 w-5" />
                            Booking Sekarang
                        </Link>
                        <a
                            href="#layanan"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors"
                        >
                            Lihat Layanan
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Layanan Section */}
            <section id="layanan" className="py-20 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Layanan Kami</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Kami menyediakan berbagai layanan berkualitas tinggi dengan harga terjangkau dan proses yang mudah.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Card key={service.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                                <CardHeader>
                                    <div className="mb-3">{serviceIcons[service.slug] ?? <Wrench className="h-8 w-8 text-blue-500" />}</div>
                                    <CardTitle className="flex items-center gap-2">
                                        {service.name}
                                        {!service.is_bookable && (
                                            <Badge variant="secondary" className="text-xs">Walk-in Only</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 text-sm mb-4">{service.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Mulai dari</span>
                                        <span className="text-lg font-bold text-blue-600">{formatRupiah(service.base_price)}</span>
                                    </div>
                                    {service.is_bookable && (
                                        <Link
                                            href="/booking"
                                            className="mt-4 block w-full text-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                                        >
                                            Booking Sekarang
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cara Kerja */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Cara Kerja</h2>
                        <p className="text-slate-500">Tiga langkah mudah untuk memesan layanan kami</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Pilih Layanan', desc: 'Pilih layanan yang sesuai kebutuhan Anda dari daftar layanan kami.', icon: '🎯' },
                            { step: '02', title: 'Isi Formulir', desc: 'Lengkapi detail booking, jadwal, dan informasi kontak Anda.', icon: '📝' },
                            { step: '03', title: 'Terima Nomor Antrian', desc: 'Dapatkan nomor antrian instan dan konfirmasi via email.', icon: '✅' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            {promos.length > 0 && (
                <section className="py-20 bg-blue-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">🎉 Promo Aktif</h2>
                            <p className="text-slate-500">Manfaatkan promo spesial kami sebelum kehabisan!</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {promos.map((promo) => (
                                <Card key={promo.id} className="border-blue-200 bg-white shadow-md">
                                    <CardHeader>
                                        <Badge className="w-fit bg-blue-600 text-white text-sm font-mono px-3">
                                            {promo.code}
                                        </Badge>
                                        <CardTitle className="text-lg">{promo.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-500 text-sm mb-3">{promo.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {promo.discount_type === 'percent'
                                                    ? `${promo.discount_value}%`
                                                    : formatRupiah(promo.discount_value)}
                                            </span>
                                            <span className="text-sm text-slate-500">diskon</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">
                                            Berlaku hingga {new Date(promo.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Pelanggan Kami</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Budi Santoso', rating: 5, text: 'Pelayanan detailing motor sangat memuaskan! Motor saya jadi kinclong seperti baru. Proses booking juga sangat mudah.' },
                            { name: 'Siti Rahayu', rating: 5, text: 'Jasa pindahan rumah yang sangat profesional. Tim mereka bekerja dengan cepat dan hati-hati. Barang-barang kami aman sampai tujuan.' },
                            { name: 'Ahmad Fauzi', rating: 5, text: 'Sistem antrian online sangat membantu! Tidak perlu menunggu lama. Langsung datang sesuai nomor antrian.' },
                        ].map((t) => (
                            <Card key={t.name} className="shadow-md border-0">
                                <CardContent className="pt-6">
                                    <div className="flex mb-3">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4 italic">"{t.text}"</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                            {t.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800">{t.name}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Siap Booking Sekarang?</h2>
                    <p className="text-blue-100 mb-8 text-lg">
                        Jangan tunda lagi. Jadwalkan layanan Anda hari ini dan nikmati kemudahan booking online.
                    </p>
                    <Link
                        href="/booking"
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        <CalendarCheck className="h-5 w-5" />
                        Mulai Booking
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
