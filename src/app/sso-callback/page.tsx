"use client";

import { useEffect } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// This page relies on Clerk client context; avoid static prerendering during build
export const dynamic = 'force-dynamic';

export default function SsoCallback() {
  const { handleRedirectCallback, signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const proceed = async () => {
      if (!isSignedIn) {
        await handleRedirectCallback({ redirectUrl: '/' });
      }
      const email = (user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '').toLowerCase();
      const allowedDomains = (process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ?? process.env.ALLOWED_EMAIL_DOMAINS ?? 'xero.com')
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);
      const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_EMAILS ?? process.env.ALLOWED_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const domain = email.split('@')[1];
      const isAllowed = !!email && (allowedEmails.includes(email) || (!!domain && allowedDomains.includes(domain)));
      if (!isAllowed) {
        await signOut();
        router.replace('/unauthorized');
        return;
      }
      router.replace('/');
    };
    void proceed();
  }, [handleRedirectCallback, isLoaded, isSignedIn, router, signOut, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Finishing sign-in…</p>
    </div>
  );
}


