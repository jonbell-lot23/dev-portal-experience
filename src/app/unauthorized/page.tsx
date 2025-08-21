import { SignOutButton } from '@clerk/nextjs';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto text-white/80">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="mb-6">This app is restricted to allowed users only.</p>
        <div className="flex justify-center">
          <SignOutButton>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-md border border-white/20">
              Sign out & try again
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}