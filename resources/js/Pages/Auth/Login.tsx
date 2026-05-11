import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Eye, EyeOff, LogIn } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Masuk — GCM Book" />

            <div className="min-h-screen flex bg-slate-950">
                {/* Left panel — branding */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
                    {/* Background decoration */}
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

                    <div className="relative z-10 space-y-6">
                        <blockquote className="space-y-3">
                            <p className="text-2xl font-semibold leading-relaxed text-white">
                                Platform booking & invoicing terpercaya untuk layanan kendaraan dan jasa pindahan.
                            </p>
                            <div className="space-y-1">
                                <p className="text-blue-300 font-medium">Layanan tersedia:</p>
                                <ul className="space-y-1 text-slate-300 text-sm">
                                    {['🏍️ Detailing Motor', '🚛 Jasa Pindahan Rumah', '🧼 Cuci Motor'].map((s) => (
                                        <li key={s}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        </blockquote>
                    </div>

                    <p className="text-slate-500 text-sm relative z-10">
                        © {new Date().getFullYear()} GCM Book. Semua hak dilindungi.
                    </p>
                </div>

                {/* Right panel — form */}
                <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md space-y-8">
                        {/* Mobile logo */}
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
                                    Selamat datang kembali
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    Masuk ke akun GCM Book Anda
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {status && (
                                    <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">
                                            Alamat Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            autoFocus
                                            placeholder="nama@email.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={cn(
                                                'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500',
                                                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                                            )}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-slate-300">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    Lupa password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={cn(
                                                    'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 pr-10',
                                                    errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs text-red-400">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Remember me */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked as false)}
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        />
                                        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                            Ingat saya selama 30 hari
                                        </span>
                                    </label>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 transition-colors"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Memproses...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <LogIn className="h-4 w-4" />
                                                Masuk
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 border-t border-slate-800 pt-6">
                                <p className="text-center text-sm text-slate-400">
                                    Belum punya akun?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Daftar sekarang
                                    </Link>
                                </p>
                                <Link
                                    href="/"
                                    className="text-center text-sm text-slate-500 hover:text-slate-400 transition-colors"
                                >
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
