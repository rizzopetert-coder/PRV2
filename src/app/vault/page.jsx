"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SocialTokenTrigger from "@/components/vault/SocialTokenTrigger";

// ─── Auth Trigger (Suspense boundary required for useSearchParams) ─────────────
// Next.js App Router requires any component using useSearchParams() to be wrapped
// in <Suspense> during static generation. Isolating the hook here keeps the
// static shell of VaultPage clean and avoids a full-page Suspense boundary.

function VaultAuthTrigger() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("auth_trigger") !== "true") return;

    const attemptedPath = searchParams.get("attempted_path") ?? "/secure/vault";
    const mode = attemptedPath.includes("exec") ? "inquiry" : "token";

    window.dispatchEvent(
      new CustomEvent("PR_TRIGGER_UNLOCK", {
        detail: { mode, href: attemptedPath, source: "middleware_redirect" },
        bubbles: true,
      })
    );

    const clean = new URL(window.location.href);
    clean.searchParams.delete("auth_trigger");
    clean.searchParams.delete("attempted_path");
    window.history.replaceState({}, "", clean.toString());
  }, [searchParams]);

  return null;
}

// ─── Intelligence Memo seed data (Batch 01) ───────────────────────────────────

const MEMOS = [
  {
    id: "MEMO-01",
    title: "The Anatomy of Resentment",
    state_tag: "KID_GLOVES",
    signal_tag: "AVOIDANCE",
    impact_tag: "LEAK_RATIO",
    teaser:
      "Resentment isn't a personality problem. It's an organizational output. This memo maps how conflict avoidance builds into institutional rot -- and what the financial signature looks like before the exits start.",
    slug: "anatomy-of-resentment",
    published: "2026-02-01",
    gated: true,
  },
  {
    id: "MEMO-02",
    title: "Effectiveness Dies in Darkness",
    state_tag: "SILOSOLATION",
    signal_tag: "DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    teaser:
      "Silos don't form because people are selfish. They form because information routing breaks down and self-preservation fills the vacuum. This memo names the structural conditions and the cost of leaving them intact.",
    slug: "effectiveness-dies-in-darkness",
    published: "2026-02-08",
    gated: true,
  },
  {
    id: "MEMO-03",
    title: "Nice is Not a Strategy",
    state_tag: "KID_GLOVES",
    signal_tag: "CULTURAL_AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    teaser:
      "Organizations that confuse warmth with effectiveness don't lose their people in blowups. They lose them quietly, over time, as the most capable employees conclude that nothing will ever change.",
    slug: "nice-is-not-a-strategy",
    published: "2026-02-15",
    gated: true,
  },
  {
    id: "MEMO-04",
    title: "The Cost of Flying Blind",
    state_tag: "BROKEN_COMPASS",
    signal_tag: "STALLED_DECISIONS",
    impact_tag: "RADIATED_IMPACT",
    teaser:
      "Stalled decisions don't stay contained. They radiate. Every week a direction isn't set, a team re-routes around the void -- burning capacity, losing confidence, and making bets leadership didn't authorize.",
    slug: "cost-of-flying-blind",
    published: "2026-02-22",
    gated: true,
  },
  {
    id: "MEMO-05",
    title: "The Vanity of Being Right",
    state_tag: "SACRED_COW",
    signal_tag: "RESOLUTION_BLOCKAGE",
    impact_tag: "EXECUTION_GAP",
    teaser:
      "The Sacred Cow persists not because leadership doesn't know. It persists because admitting the problem means admitting the decision that created it. This memo is about what that protection costs.",
    slug: "vanity-of-being-right",
    published: "2026-02-27",
    gated: true,
  },
];

// ─── Tag label maps ───────────────────────────────────────────────────────────

const STATE_LABELS = {
  KID_GLOVES:     "Kid Gloves",
  SILOSOLATION:   "Silosolation",
  BROKEN_COMPASS: "Broken Compass",
  SACRED_COW:     "The Sacred Cow",
};

const SIGNAL_LABELS = {
  AVOIDANCE:           "Avoidance",
  CULTURAL_AVOIDANCE:  "Cultural Avoidance",
  DECISIONS:           "Slow Decisions",
  STALLED_DECISIONS:   "Stalled Decisions",
  RESOLUTION_BLOCKAGE: "Resolution Blockage",
};

const IMPACT_LABELS = {
  LEAK_RATIO:      "Leak Ratio",
  OPPORTUNITY_COST:"Opportunity Cost",
  PERSONNEL_RISK:  "Personnel Risk",
  RADIATED_IMPACT: "Radiated Impact",
  EXECUTION_GAP:   "Execution Gap",
};

// ─── MemoCard ─────────────────────────────────────────────────────────────────

function MemoCard({ memo, onUnlock }) {
  return (
    <div className="border border-brand-border bg-brand-bg p-6 flex flex-col gap-4 hover:border-brand-muted transition-colors duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted mb-1.5">
            {memo.id} // {memo.published}
          </p>
          <h3
            className="text-xl leading-tight text-brand-text"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {memo.title}
          </h3>
        </div>
        {memo.gated && (
          <span className="font-mono text-[8px] tracking-widest uppercase border border-brand-border text-brand-muted px-2 py-1 shrink-0">
            Restricted
          </span>
        )}
      </div>

      {/* Teaser */}
      <p className="font-mono text-xs text-brand-muted leading-relaxed">{memo.teaser}</p>

      {/* Tags — semantic taxonomy colors, intentionally theme-independent */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-brand-border">
        {/* State tag: accent (PR brand orange) */}
        <span className="font-mono text-[9px] tracking-widest uppercase border border-brand-accent text-brand-accent px-1.5 py-0.5">
          {STATE_LABELS[memo.state_tag] || memo.state_tag}
        </span>
        {/* Signal tag: cyan — diagnostic signal category */}
        <span className="font-mono text-[9px] tracking-widest uppercase border border-cyan-600 text-cyan-600 px-1.5 py-0.5">
          {SIGNAL_LABELS[memo.signal_tag] || memo.signal_tag}
        </span>
        {/* Impact tag: red — financial/risk impact */}
        <span className="font-mono text-[9px] tracking-widest uppercase border border-red-600 text-red-600 px-1.5 py-0.5">
          {IMPACT_LABELS[memo.impact_tag] || memo.impact_tag}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => onUnlock(memo)}
        className="font-mono text-[10px] tracking-widest uppercase border border-brand-text text-brand-text py-2.5 hover:bg-brand-text hover:text-brand-bg transition-all duration-200 mt-auto"
      >
        Unlock This Memo →
      </button>
    </div>
  );
}

// ─── VaultPage ────────────────────────────────────────────────────────────────

export default function VaultPage() {
  const [selectedMemo, setSelectedMemo] = useState(null);

  return (
    <main className="bg-brand-bg min-h-screen">

      {/* ── Auth trigger — isolated Suspense boundary for useSearchParams ── */}
      <Suspense fallback={null}>
        <VaultAuthTrigger />
      </Suspense>

      {/* ── Hero ── */}
      <section className="border-b border-brand-border px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted mb-6">
            Principal Resolution // Intelligence Repository
          </p>

          <h1
            className="text-5xl md:text-6xl leading-none text-brand-text mb-8"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            The Vault //<br />
            Institutional Intelligence.
          </h1>

          <p className="font-mono text-sm text-brand-text leading-relaxed max-w-2xl mb-6">
            You've seen the diagnostic result. Now see the mechanics behind the friction. This is
            the forensic proof and resolution architecture for the twelve patterns that consume
            leadership capacity.
          </p>

          <div className="flex items-start gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-muted mb-1">
                Public Access
              </p>
              <p className="font-mono text-xs text-brand-text">Lexicon // Hammer Citations</p>
            </div>
            <div className="w-px h-8 bg-brand-border self-center" />
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-accent mb-1">
                Restricted Access
              </p>
              <p className="font-mono text-xs text-brand-text">Intelligence Memos // Resolution Core</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Doctrine block ── */}
      <section className="border-b border-brand-border px-6 py-14">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">

          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-4">
              The Structure
            </p>
            <div className="space-y-6">
              {[
                {
                  label: "Public Reference",
                  path: "/vault/lexicon",
                  description:
                    "The 12 Institutional States defined. The Hammer Citation Index -- 100+ validated data points that explain why the diagnostic inferences hold. No paywall. The proof is public.",
                },
                {
                  label: "Public Editorial",
                  path: "/vault/intelligence",
                  description:
                    "Intelligence Memos on specific friction patterns. The teaser is free. The resolution requires a share. This is the mechanism that earns access -- not a credit card form.",
                },
                {
                  label: "The Core",
                  path: "/secure/vault",
                  description:
                    "The proprietary resolution architecture. Case frameworks, diagnostic supplements, and the operational detail that doesn't belong in a public index. Gated. Earned.",
                },
              ].map((layer) => (
                <div key={layer.label} className="border-l-2 border-brand-border pl-4">
                  <p
                    className="text-base text-brand-text mb-1"
                    style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
                  >
                    {layer.label}
                  </p>
                  <p className="font-mono text-[10px] text-brand-muted leading-relaxed">
                    {layer.description}
                  </p>
                  <a
                    href={layer.path}
                    className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors mt-2 inline-block"
                  >
                    Enter →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-4">
              The Position
            </p>
            <div className="space-y-5">
              {[
                {
                  stat: "100+",
                  label: "Validated citations",
                  detail: "Public data points indexed against the 12 States.",
                },
                {
                  stat: "12",
                  label: "Institutional States",
                  detail: "Every pattern we've observed, named, and mapped to resolution.",
                },
                {
                  stat: "72h",
                  label: "Access window",
                  detail: "Share an Intelligence Memo. Earn a 72-hour resolution token.",
                },
              ].map((item) => (
                <div key={item.stat} className="flex items-baseline gap-4">
                  <span
                    className="text-3xl text-brand-accent shrink-0 w-16"
                    style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}
                  >
                    {item.stat}
                  </span>
                  <div>
                    <p className="font-mono text-xs text-brand-text uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="font-mono text-[10px] text-brand-muted mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="font-mono text-xs text-brand-muted leading-relaxed">
                The proof is public because it should be. You don't have to trust our diagnostic
                conclusions -- you can read the same research we do. What's restricted is the
                resolution. That's proprietary because it took years of operational work to build,
                and it's not a blog post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intelligence Memos ── */}
      <section className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-2">
                Intelligence Memos // Batch 01
              </p>
              <h2
                className="text-3xl text-brand-text"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                Active Intelligence
              </h2>
            </div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
              {MEMOS.length} Memos Published
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MEMOS.map((memo) => (
              <MemoCard key={memo.id} memo={memo} onUnlock={setSelectedMemo} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Token Unlock Modal ── */}
      {selectedMemo && (
        <div
          className="fixed inset-0 bg-brand-text/60 z-50 flex items-center justify-center p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMemo(null);
          }}
        >
          <div className="w-full max-w-md">
            <div className="bg-brand-bg border border-brand-border p-4 mb-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted mb-1">
                    Unlocking
                  </p>
                  <p
                    className="text-lg text-brand-text"
                    style={{
                      fontFamily: "'Sorts Mill Goudy', Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    {selectedMemo.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMemo(null)}
                  className="font-mono text-brand-muted hover:text-brand-text text-sm mt-1"
                >
                  ×
                </button>
              </div>
            </div>
            <SocialTokenTrigger
              memoId={selectedMemo.id}
              memoTitle={selectedMemo.title}
              onTokenGranted={() => {
                setTimeout(() => {
                  window.location.href = `/vault/intelligence/${selectedMemo.slug}`;
                }, 1200);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Footer nav ── */}
      <section className="border-t border-brand-border px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-6">
            <a
              href="/vault/lexicon"
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              Lexicon →
            </a>
            <a
              href="/vault/lexicon#hammer"
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              Hammer Index →
            </a>
            <a
              href="/audit"
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              Run the Diagnostic →
            </a>
          </div>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
            Principal Resolution // The Vault v1.0
          </p>
        </div>
      </section>

    </main>
  );
}