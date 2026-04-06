import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map();

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // API endpoints
  '/api/create-job-pure-server': { windowMs: 15 * 60 * 1000, max: 10 }, // 10 requests per 15 minutes
  '/api/test-telegram': { windowMs: 60 * 1000, max: 5 }, // 5 requests per minute
  '/api/contact': { windowMs: 60 * 1000, max: 3 }, // 3 requests per minute
  
  // Default rate limit for all API routes
  'default': { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
};

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for production behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to request IP
  return (request as any).ip || 'unknown';
}

function getRateLimitConfig(pathname: string) {
  // Check for specific route config
  for (const [route, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      return config;
    }
  }
  
  // Return default config
  return RATE_LIMIT_CONFIG.default;
}

function isRateLimited(clientId: string, pathname: string): boolean {
  const config = getRateLimitConfig(pathname);
  const key = `${clientId}:${pathname}`;
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(key) as RateLimitEntry;
  
  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    rateLimitMap.set(key, entry);
    return false;
  }
  
  // Increment count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > config.max) {
    return true;
  }
  
  return false;
}

// Cleanup old entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitMap, 5 * 60 * 1000);

export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  
  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api/')) {
    return null;
  }
  
  const clientId = getClientIdentifier(request);
  
  if (isRateLimited(clientId, pathname)) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        message: 'Rate limit exceeded',
        retryAfter: 60
      },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + 60).toString()
        }
      }
    );
  }
  
  return null;
}
