'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Error: ' + (data.error || 'Could not start checkout'));
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-400">ClearMind AI</Link>
        <Link href="/" className="text-gray-400 hover:text-white transition text-sm">Back to App</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-gray-400 text-lg mb-12">Start free, upgrade when you need more.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-bold mb-6">$0<span className="text-gray-400 text-base font-normal">/mo</span></div>
            <ul className="text-gray-300 space-y-2 mb-8 text-sm">
              <li> 10 thoughts/day</li>
              <li> Basic organization</li>
              <li> Unlimited access</li>
            </ul>
            <Link href="/signup" className="block w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition">
              Get Started
            </Link>
          </div>

          <div className="bg-indigo-900 border border-indigo-500 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <div className="text-4xl font-bold mb-6">$9<span className="text-gray-300 text-base font-normal">/mo</span></div>
            <ul className="text-gray-200 space-y-2 mb-8 text-sm">
              <li> Unlimited thoughts</li>
              <li> AI-powered organization</li>
              <li> Priority support</li>
              <li> Advanced analytics</li>
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Loading...' : 'Upgrade to Pro '}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
