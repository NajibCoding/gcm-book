import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Tag, Calendar, Percent, Ticket, ArrowRight, Gift } from 'lucide-react';
import { Promo, PageProps } from '@/types';

interface Props extends PageProps {
    promos: Promo[];
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export default function PromosIndex({ promos }: Props) {
    return (
        <GuestLayout>
            <Head title="Promo — GCM Book" />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-blue-400 blur-3xl" />
                </div>
                <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 mb-6">
                        <Gift className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">Penawaran Spesial</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Promo & Diskon Terbaru
                    </h1>
                    <p className="text-slate-300 text-lg max-w-xl mx-auto">
                        Hemat lebih banyak dengan kode promo eksklusif untuk layanan detailing motor, cuci motor, dan jasa pindahan.
                    </p>
                </div>
            </section>

            {/* Promos grid */}
            <section className="py-16 bg-slate-50">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {promos.length === 0 ? (
                        <div className="text-center py-20">
                            <Ticket className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">Belum ada promo aktif</h3>
                            <p className="text-slate-400 mb-8">Cek kembali nanti untuk penawaran spesial.</p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
                                <Link href="/booking">Booking Sekarang</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {promos.map((promo) => (
                                    <PromoCard key={promo.id} promo={promo} />
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-slate-500 mb-4 text-sm">Gunakan kode saat booking untuk mendapatkan diskon</p>
                                <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
                                    <Link href="/booking" className="flex items-center gap-2">
                                        Booking dengan Promo <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}

function PromoCard({ promo }: { promo: Promo }) {
    const isPercent = promo.discount_type === 'percent';

    return (
        <Card className="group border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400" />

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                        {promo.name}
                    </CardTitle>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        {isPercent
                            ? <Percent className="h-5 w-5 text-blue-600" />
                            : <Tag className="h-5 w-5 text-blue-600" />
                        }
                    </div>
                </div>

                {/* Code badge */}
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="font-mono text-sm font-bold text-blue-700 border-blue-200 bg-blue-50 tracking-wider px-3 py-1">
                        {promo.code}
                    </Badge>
                    <span className="text-xs text-slate-400">salin & tempel saat checkout</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {promo.description && (
                    <p className="text-sm text-slate-500 leading-relaxed">{promo.description}</p>
                )}

                {/* Discount highlight */}
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white text-center">
                    <p className="text-xs font-medium opacity-80 mb-1">Hemat hingga</p>
                    <p className="text-2xl font-bold">
                        {isPercent
                            ? `${promo.discount_value}%`
                            : formatRupiah(Number(promo.discount_value))
                        }
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-500">
                    {promo.min_order && Number(promo.min_order) > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Min. order:</span>
                            <span className="font-medium text-slate-600">{formatRupiah(Number(promo.min_order))}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Berlaku hingga <span className="font-medium text-slate-600">{formatDate(promo.valid_until)}</span></span>
                    </div>
                    {promo.max_usage && (
                        <div className="flex items-center gap-2">
                            <Ticket className="h-3.5 w-3.5 text-slate-400" />
                            <span>Kuota: <span className="font-medium text-slate-600">{promo.max_usage} penggunaan</span></span>
                        </div>
                    )}
                </div>

                <Button asChild variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <Link href={`/booking?promo=${promo.code}`} className="flex items-center gap-2 justify-center">
                        Pakai Promo Ini <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
