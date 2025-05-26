/* File: frontend/app/page.tsx */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.startsWith('http')) {
      setError('Please enter a valid GitHub HTTPS URL.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('http://localhost:8000/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_url: repoUrl })
        });

        const data = await res.json();

        if (data.job_id) {
          router.push(`/result/${data.job_id}`);
        } else {
          throw new Error('No job ID returned');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to start scan. Please try again.');
      }
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-4"
      >
        📊 Technical Debt Scanner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-400 mb-8 text-center max-w-md"
      >
        Paste your GitHub repository URL below and we'll scan it for code smells, bugs, and more.
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-xl space-y-4"
      >
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/your/repo"
          className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 p-4 rounded-lg text-lg font-medium disabled:opacity-50"
        >
          {isPending ? '🔎 Scanning...' : '🚀 Scan Repo'}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </motion.form>
    </main>
  );
}
