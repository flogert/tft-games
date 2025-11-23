import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gaming-dark/90 backdrop-blur-sm border-b border-slate-700 text-white sticky top-0 z-50">
      <Link href='/'>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gaming-accent to-yellow-200 hover:opacity-80 transition-opacity">
          TFTdle
        </h1>
      </Link>
      <nav className="flex gap-6">
        <Link href="/" className="text-gray-300 hover:text-gaming-accent transition-colors font-medium">
          Home
        </Link>
        <Link href="/leaderboard" className="text-gray-300 hover:text-gaming-accent transition-colors font-medium">
          Leaderboard
        </Link>
      </nav>
    </header>
  );
}