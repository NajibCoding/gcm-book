<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class AuditLogMiddleware
{
    private const AUDITED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (in_array($request->method(), self::AUDITED_METHODS, true)) {
            AuditLog::create([
                'user_id' => $request->user()?->id,
                'action' => $request->method() . ' ' . $request->path(),
                'model_type' => null,
                'model_id' => null,
                'old_values' => null,
                'new_values' => $this->sanitizeInput($request->except(['password', 'password_confirmation', '_token'])),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $response;
    }

    private function sanitizeInput(array $input): array
    {
        return array_filter($input, fn ($v) => !is_null($v));
    }
}
