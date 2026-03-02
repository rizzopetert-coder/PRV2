/**
 * src/app/vault/intelligence/page.jsx
 * Principal Resolution // Intelligence Memo Index
 *
 * Public index. No cookie required.
 * Teasers visible to all visitors to drive unlock behavior.
 * Gated memos link to reader — auth wall fires there if no cookie.
 */

import Link from 'next/link';
import { MEMOS, SIGNAL_LABELS, IMPACT_LABELS } from '@/data/vaultMemos';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Intelligence | Principal Resolution Vault',
  description:
    'Institutional intelligence memos from Principal Resolution. Sector observations, signal analysis, and advisory perspective on organizational friction.',
};

export default function IntelligencePage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-700">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24">

        {/* HEADER */}
        <div className="mb-20 max-w-3xl">
          <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold block mb-6">
            Vault // Intelligence
          </span>

          <h1
            className="font-serif italic tracking-tighter leading-none mb-8"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            Intelligence Memos
          </h1>

          <p
            className="font-serif italic text-brand-muted leading-relaxed border-l-2 border-brand-accent/50 pl-6 py-1"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)' }}
          >
            Sector observations and advisory perspective on organizational friction.
            Each memo is tied to a diagnostic state. If you've run the audit,
            you'll know which ones apply.
          </p>
        </div>

        {/* MEMO LIST */}
        <div className="divide-y divide-brand-border/50 border-y border-brand-border/50">
          {MEMOS.map((memo, index) => (
            <MemoCard key={memo.id} memo={memo} index={index} />
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-16 pt-8 border-t border-brand-border/30">
          <p className="font-mono text-brand-muted text-[10px] uppercase tracking-briefing leading-relaxed max-w-xl">
            <span className="text-brand-accent font-bold">Note // </span>
            Seven additional memos are in development. Coverage expands as diagnostic
            state data accumulates. If your state has no linked memo yet, it will.
          </p>
        </div>

      </div>
    </main>
  );
}

function MemoCard({ memo, index }) {
  const signalLabel = SIGNAL_LABELS[memo.signal_tag] ?? memo.signal_tag;
  const impactLabel = IMPACT_LABELS[memo.impact_tag] ?? memo.impact_tag;

  const formattedDate = new Date(memo.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/vault/intelligence/${memo.slug}`}
      className="group block py-10 hover:bg-brand-accent/3 transition-colors duration-500 px-2 -mx-2"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-8">

        {/* Index number */}
        <div className="shrink-0 w-12">
          <span className="font-mono text-[11px] text-brand-muted opacity-50">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-grow min-w-0">

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-briefing border border-cyan-600 text-cyan-600 px-2 py-0.5">
              {signalLabel}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-briefing border border-red-600 text-red-600 px-2 py-0.5">
              {impactLabel}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted opacity-50">
              {memo.state_tag.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-serif italic text-brand-text tracking-tight leading-tight mb-4 group-hover:text-brand-accent transition-colors duration-300"
            style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)' }}
          >
            {memo.title}
          </h2>

          {/* Teaser */}
          <p
            className="font-serif italic text-brand-muted leading-relaxed mb-6 max-w-2xl"
            style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1rem)' }}
          >
            {memo.teaser}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-6">
            <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted opacity-50">
              {formattedDate}
            </span>

            {memo.gated && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-briefing text-brand-muted opacity-60">
                <Lock size={9} />
                Unlock required
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="shrink-0 self-center md:self-start md:pt-2">
          <span className="font-mono text-[10px] text-brand-muted group-hover:text-brand-accent transition-colors duration-300 group-hover:translate-x-1 inline-block transition-transform">
            →
          </span>
        </div>

      </div>
    </Link>
  );
}
