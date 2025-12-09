'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-[#0f0f11] flex flex-col items-center justify-center text-white text-center p-4">
      <h1 className="font-serif text-9xl opacity-10">404</h1>
      <h2 className="text-2xl font-sans uppercase tracking-widest mb-8">
        Lost in the Moment
      </h2>
      <Link
        href="/"
        className="px-8 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
