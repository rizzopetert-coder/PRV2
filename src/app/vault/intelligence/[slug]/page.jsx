/**
 * src/app/vault/intelligence/[slug]/page.jsx
 * Principal Resolution // Intelligence Memo Reader
 *
 * Cookie-gated. Teasers visible to all.
 * Full content requires pr_vault_token cookie (TOKENIZED session).
 * No cookie → redirected to /vault?auth_trigger=true&attempted_path=...
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMemoBySlug } from '@/data/vaultMemos';
import { ArrowLeft, Lock } from 'lucide-react';

function getVaultCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('pr_vault_token='));
  return match ? match.split('=')[1] : null;
}

export default function MemoReaderPage({ params }) {
  const router  = useRouter();
  const { slug } = params;

  const [memo, setMemo]           = useState(null);
  const [access, setAccess]       = useState('checking'); // checking | granted | denied
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    const found = getMemoBySlug(slug);
    if (!found) {
      setNotFound(true);
      return;
    }
    setMemo(found);

    // If memo is not gated, grant immediately
    if (!found.gated) {
      setAccess('granted');
      return;
    }

    // Check for cookie
    const token = getVaultCookie();
    if (token && token.trim() !== '') {
      setAccess('granted');
    } else {
      // Redirect to vault with auth trigger
      router.replace(
        `/vault?auth_trigger=true&attempted_path=/vault/intelligence/${slug}`
      );
    }
  }, [slug, router]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <div className="text-center space-y-6">
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
            Memo not found
          </span>
          <Link
            href="/vault/intelligence"
            className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft size={11} />
            Back to Intelligence
          </Link>
        </div>
      </main>
    );
  }

  if (access === 'checking' || !memo) {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
          Verifying access...
        </span>
      </main>
    );
  }

  if (access === 'denied') {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <div className="text-center space-y-6">
          <Lock size={20} className="text-brand-muted mx-auto" />
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
            Access required
          </span>
          <Link
            href="/vault"
            className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold hover:underline"
          >
            Unlock access
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(memo.published).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-700">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24">

        {/* BACK */}
        <Link
          href="/vault/intelligence"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors font-bold mb-16"
        >
          <ArrowLeft size={10} />
          Intelligence
        </Link>

        {/* HEADER */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-briefing border border-cyan-600 text-cyan-600 px-2 py-0.5">
              {memo.signal_tag.replace(/_/g, ' ')}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-briefing border border-red-600 text-red-600 px-2 py-0.5">
              {memo.impact_tag.replace(/_/g, ' ')}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted opacity-50">
              {memo.state_tag.replace(/_/g, ' ')}
            </span>
          </div>

          <h1
            className="font-serif italic tracking-tighter leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {memo.title}
          </h1>

          <p
            className="font-serif italic text-brand-muted border-l-2 border-brand-accent/50 pl-6 py-1 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)' }}
          >
            {memo.teaser}
          </p>

          <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted opacity-50 block">
            {formattedDate}
          </span>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-brand-border/40 mb-16" />

        {/* BODY */}
        {memo.body ? (
          <div
            className="font-serif italic text-brand-text leading-relaxed space-y-6"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
          >
            {memo.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : (
          <p className="font-serif italic text-brand-muted" style={{ fontSize: '1.05rem' }}>
            Full memo content coming soon.
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-24 pt-8 border-t border-brand-border/30 flex items-center justify-between">
          <Link
            href="/vault/intelligence"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors font-bold"
          >
            <ArrowLeft size={10} />
            All memos
          </Link>
          <Link
            href="/audit"
            className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold hover:underline"
          >
            Run the diagnostic →
          </Link>
        </div>

      </div>
    </main>
  );
}
