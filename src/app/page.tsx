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
    <div className="min-h-screen bg-green-950 text-white flex items-center justify-center">
      <div className="text-center">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-md border border-white/20">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="bg-white/10 border border-white/20 rounded-md px-6 py-4 text-white/90">
            Coming soon
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
