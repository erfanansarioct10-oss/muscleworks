import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js 16 Request Proxy & Edge Security Guard (Successor to middleware.ts)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block common malicious bot scanning probes
  const blockedPrefixes = [
    '/wp-admin',
    '/wp-login',
    '/.env',
    '/.git',
    '/xmlrpc.php',
    '/phpmyadmin',
    '/admin.php',
  ];

  if (blockedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Clone response and attach hardened HTTP security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|brnding-assets|hero|goals|deals|feature-products|images|favicon.ico).*)',
  ],
};
