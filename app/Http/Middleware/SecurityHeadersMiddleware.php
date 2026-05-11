<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (!app()->environment('local')) {
            $response->headers->set('Content-Security-Policy', implode(' ', [
                "default-src 'self';",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
                "style-src 'self' 'unsafe-inline' https://fonts.bunny.net;",
                "font-src 'self' data: https://fonts.bunny.net;",
                "img-src 'self' data: blob:;",
                "connect-src 'self';",
                "frame-ancestors 'self';",
            ]));
        }

        return $response;
    }
}
