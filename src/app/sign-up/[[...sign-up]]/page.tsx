import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center">
        <SignUp />
      </div>
    </div>
  );
}