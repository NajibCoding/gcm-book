import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Eye, EyeOff, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar — GCM Book" />

            <div className="min-h-screen flex bg-slate-950">
                {/* Left panel — branding */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-500 blur-3xl" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
                    </div>

                    <Link href="/" className="flex items-center gap-3 relative z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">GCM Book</span>
                    </Link>

                    <div className="relative z-10 space-y-4">
                        <p className="text-2xl font-semibold leading-relaxed text-white">
                            Daftar dan nikmati kemudahan booking layanan kami.
                        </p>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            {[
                                '✅ Lacak status booking secara real-time',
                                '✅ Riwayat booking & invoice tersimpan',
                                '✅ Akses promo eksklusif member',
                                '✅ Notifikasi email otomatis',
                            ].map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-slate-500 text-sm relative z-10">
                        © {new Date().getFullYear()} GCM Book. Semua hak dilindungi.
                    </p>
                </div>

                {/* Right panel — form */}
                <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex lg:hidden justify-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">GCM Book</span>
                            </Link>
                        </div>

                        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
                            <CardHeader className="space-y-1 pb-6">
                                <CardTitle className="text-2xl font-bold text-white">
                                    Buat akun baru
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Isi data di bawah untuk mendaftar
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-300">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            autoComplete="name"
                                            autoFocus
                                            placeholder="John Doe"
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={cn(
                                                'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500',
                                                errors.name && 'border-red-500',
                                            )}
                                        />
                                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            placeholder="nama@email.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={cn(
                                                'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500',
                                                errors.email && 'border-red-500',
                                            )}
                                        />
                                        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                autoComplete="new-password"
                                                placeholder="Min. 8 karakter"
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={cn(
                                                    'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 pr-10',
                                                    errors.password && 'border-red-500',
                                                )}
                                            />
                                            <button type="button" onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" tabIndex={-1}>
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-slate-300">Konfirmasi Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirm ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                autoComplete="new-password"
                                                placeholder="Ulangi password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={cn(
                                                    'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 pr-10',
                                                    errors.password_confirmation && 'border-red-500',
                                                )}
                                            />
                                            <button type="button" onClick={() => setShowConfirm(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" tabIndex={-1}>
                                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && <p className="text-xs text-red-400">{errors.password_confirmation}</p>}
                                    </div>

                                    <Button type="submit" disabled={processing}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 mt-2">
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Memproses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <UserPlus className="h-4 w-4" />
                                                Daftar Sekarang
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 border-t border-slate-800 pt-6">
                                <p className="text-center text-sm text-slate-400">
                                    Sudah punya akun?{' '}
                                    <Link href={route('login')} className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        Masuk di sini
                                    </Link>
                                </p>
                                <Link href="/" className="text-center text-sm text-slate-500 hover:text-slate-400 transition-colors">
                                    ← Kembali ke beranda
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
