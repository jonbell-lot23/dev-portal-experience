import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/unauthorized',
  '/sso-callback(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Enforce allowlist: primary email must match allowed emails or allowed domains
  const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS ?? 'xero.com')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = (process.env.ALLOWED_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const claimEmail = typeof sessionClaims?.email === 'string' ? sessionClaims.email.toLowerCase() : undefined;

  const isEmailAllowedByClaim = (() => {
    if (!claimEmail) return false;
    if (allowedEmails.includes(claimEmail)) return true;
    const domain = claimEmail.split('@')[1];
    return !!domain && allowedDomains.includes(domain);
  })();

  if (!isEmailAllowedByClaim) {
    // Fallback to fetching the user and checking primary email only
    try {
      const user = await clerkClient.users.getUser(userId);
      const primaryEmail = user.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase();
      const domain = primaryEmail?.split('@')[1];
      const isAllowed = !!primaryEmail && (
        allowedEmails.includes(primaryEmail) || (!!domain && allowedDomains.includes(domain))
      );
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};