"use client";

import { SignIn, useUser, useSignIn } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Page() {
  const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const router = useRouter();

  const hasHandledDisallowedRef = useRef(false);

  useEffect(() => {
    if (!isUserLoaded || !isSignedIn || hasHandledDisallowedRef.current) return;
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
      hasHandledDisallowedRef.current = true;
      (async () => {
        try {
          await signOut({ sessionId: '*' });
        } finally {
          router.replace('/unauthorized');
        }
      })();
    }
  }, [isUserLoaded, isSignedIn, user, router, signOut]);

  if (isUserLoaded && isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="text-white">Stay tuned</div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center">
        <SignIn />

        <div className="mt-4">
          <button
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            disabled={!isLoaded}
            onClick={async () => {
              if (!isLoaded) return;
              try {
                window.open('https://accounts.google.com/Logout', '_blank', 'noopener,noreferrer');
              } catch {}
              setTimeout(() => {
                void signIn?.authenticateWithRedirect({
                  strategy: 'oauth_google',
                  redirectUrl: '/sso-callback',
                  redirectUrlComplete: '/',
                });
              }, 600);
            }}
          >
            Sign in with a different Google account
          </button>
        </div>
      </div>
    </div>
  );
}