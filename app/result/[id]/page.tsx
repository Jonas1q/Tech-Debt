'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLang, setExpandedLang] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const pollForResult = async () => {
      const maxAttempts = 20;
      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          const res = await fetch(`http://localhost:8000/result/${id}`);
          if (res.ok) {
            const json = await res.json();
            if (json?.debt_estimate) {
              setData(json);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }

        attempts++;
        await new Promise((res) => setTimeout(res, 2000));
      }

      setError('Job not found or not finished after multiple attempts.');
      setLoading(false);
    };

    pollForResult();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center">
        <div className="loader border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12 animate-spin mb-4" />
        <p className="text-gray-300 text-lg">Analyzing repository, hang tight...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </main>
    );
  }

  if (!data?.debt_estimate) return null;

  const languageScores = data.debt_estimate;
  const languages = Object.keys(languageScores);
  const totalScore = languages.reduce((acc, lang) => acc + languageScores[lang].score, 0);
  const colors = [
    '#2E86AB', '#F26419', '#F6AA1C', '#6A4C93', '#1982C4',
    '#8ACB88', '#FF6F59', '#255F85', '#D90368', '#0B5C86'
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 mx-auto">
      <h1 className="text-4xl font-extrabold mb-8">🧾 Scan Results for Job ID: <span className="text-indigo-400">{id}</span></h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {languages.map((lang, i) => {
          const score = languageScores[lang].score;
          const percent = ((score / totalScore) * 100).toFixed(1);

          return (
            <div key={lang} className="bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer hover:bg-gray-700 transition"
              onClick={() => setExpandedLang(expandedLang === lang ? null : lang)}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{lang}</h3>
                <span
                  className="inline-block px-3 py-1 text-sm font-semibold rounded-full"
                  style={{ backgroundColor: colors[i % colors.length], color: 'white' }}>
                  {score} pts
                </span>
              </div>
              <div className="mt-2 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: colors[i % colors.length],
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <p className="mt-2 text-gray-400 text-sm">{percent}% of total debt</p>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">🔍 Issues Breakdown</h2>

        {languages.map((lang, i) => {
          const issues = languageScores[lang].issues || [];
          const isExpanded = expandedLang === lang;

          return (
            <div key={lang} className="mb-6 border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
              <button
                onClick={() => setExpandedLang(isExpanded ? null : lang)}
                className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-expanded={isExpanded}
              >
                <span className="text-lg font-semibold">{lang} - {issues.length} issue{issues.length !== 1 ? 's' : ''}</span>
                <motion.span
                  initial={false}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-indigo-400 text-2xl"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.ul
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 overflow-auto max-h-64 text-sm text-gray-300"
                  >
                    {issues.length > 0 ? (
                      issues.map((issue: string, idx: number) => (
                        <li key={idx} className="py-1 border-b border-gray-700 last:border-none">
                          {issue}
                        </li>
                      ))
                    ) : (
                      <li className="italic text-gray-500">No issues found</li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>
    </main>
  );
}