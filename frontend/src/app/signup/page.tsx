'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400">ClearMind AI</h1>
        <form onSubmit={handleSignup} className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" required />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" required minLength={6} />
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition">
            {loading ? 'Creating account...' : 'Sign Up Free'}
          </button>
          <p className="text-center text-gray-400 text-sm">
            Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
