import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center border-b border-slate-800/80 pb-4">
      <Link href="/">
        <Logo />
      </Link>
      <Link
        href="/dashboard"
        className="text-xs font-extrabold text-white px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
      >
        My Dashboard →
      </Link>
    </header>
  );
}
