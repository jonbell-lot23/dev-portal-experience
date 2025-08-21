export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4">🌍</div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-full px-8 py-4 shadow-lg">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Hello, World!
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8 text-3xl">
          <span className="animate-pulse">✨</span>
          <span className="animate-pulse" style={{animationDelay: '0.2s'}}>🎉</span>
          <span className="animate-pulse" style={{animationDelay: '0.4s'}}>🚀</span>
          <span className="animate-pulse" style={{animationDelay: '0.6s'}}>💖</span>
          <span className="animate-pulse" style={{animationDelay: '0.8s'}}>🌟</span>
        </div>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
          Welcome to your adorable Next.js application! 
          <br />
          <span className="text-sm opacity-75">Built with TypeScript, Tailwind CSS, and lots of love</span>
        </p>
      </div>
    </div>
  );
}
