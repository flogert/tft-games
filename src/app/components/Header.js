import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
      <Link href='/'>
        <h1 className="text-2xl font-bold">TFT Guessing Game</h1>
      </Link>
      <nav>
        <Link href="/" legacyBehavior>
          <a className="mr-4 hover:underline">Home</a>
        </Link>
        <Link href="/leaderboard" legacyBehavior>
          <a className="hover:underline">Leaderboard</a>
        </Link>
      </nav>
    </header>
  );
}