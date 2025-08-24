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
  // Run the intl middleware first
  const intlResponse = intlMiddleware(request);
  
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
  
  return intlResponse;
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}