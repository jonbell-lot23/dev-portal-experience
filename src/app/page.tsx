'use client';

import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
      router.replace('/unauthorized');
    }
  }, [router, user]);
  return (
    <div className="min-h-screen bg-black">
      <SignedIn>
        <div className="absolute top-4 right-4 z-50">
          <button
            aria-label="Open menu"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
            </div>
          </button>
          {menuOpen && (
            <div className="mt-2 w-40 rounded-md bg-white shadow-lg p-2">
              <div className="px-2 py-1 text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress}
              </div>
              <SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">Log out</button>
              </SignOutButton>
            </div>
          )}
        </div>
      </SignedIn>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-md border border-white/20">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="text-white/70">
              {user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress}
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
