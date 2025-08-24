import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

// Create the intl middleware  
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'never'
});

// Define public routes - Reference: https://clerk.com/docs/references/nextjs/clerk-middleware
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
  
  // Skip intl middleware for Clerk routes
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return;
  }
  
  // Run the intl middleware after auth for non-Clerk routes
  return intlMiddleware(request);
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}