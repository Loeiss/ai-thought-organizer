'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Thought { id: string; content: string; created_at: string; }

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchThoughts();
  }, [session]);

  async function fetchThoughts() {
    const { data } = await supabase
      .from('thoughts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setThoughts(data);
  }

  async function addThought(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !session) return;
    setLoading(true);
    await supabase.from('thoughts').insert({ content: input.trim(), user_id: session.user.id });
    setInput('');
    await fetchThoughts();
    setLoading(false);
  }

  async function deleteThought(id: string) {
    await supabase.from('thoughts').delete().eq('id', id);
    setThoughts(t => t.filter(x => x.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-indigo-400">ClearMind AI</h1>
        <p className="text-gray-400 text-lg">Organize your thoughts instantly with AI.</p>
        <div className="flex gap-4">
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition">
            Sign In
          </Link>
          <Link href="/signup" className="border border-indigo-600 hover:bg-indigo-600/20 px-6 py-3 rounded-lg font-semibold transition">
            Sign Up Free
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition">
            Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-400">ClearMind AI</span>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition text-sm">Pricing</Link>
          <span className="text-gray-500 text-sm">{session.user.email}</span>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-red-400 transition">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Thoughts</h1>

        <form onSubmit={addThought} className="mb-8 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter a new thought..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-3 rounded-lg font-semibold transition"
          >
            {loading ? '...' : 'Add'}
          </button>
        </form>

        <div className="space-y-3">
          {thoughts.length === 0 && (
            <p className="text-gray-500 text-center py-8">No thoughts yet. Add your first one above.</p>
          )}
          {thoughts.map(t => (
            <div key={t.id} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between group">
              <span className="text-white">{t.content}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-xs">{new Date(t.created_at).toLocaleDateString()}</span>
                <button
                  onClick={() => deleteThought(t.id)}
                  className="text-gray-600 hover:text-red-400 transition text-sm opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
