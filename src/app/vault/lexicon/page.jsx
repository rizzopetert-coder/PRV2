"use client";

import { getAllStates } from "@/lib/vaultAssets";

/**
 * src/app/vault/lexicon/page.jsx
 * Principal Resolution // The Lexicon — Periodic Table of Institutional States
 *
 * Renders all 12 states sorted by ui_severity_rating DESC (critical first).
 * Each card shows: label, severity bar, short_description quick-look,
 * citation count, and linked memo count.
 */

// ─── Severity helpers ─────────────────────────────────────────────────────────

const SEVERITY_LABEL = { 5: "Critical", 4: "High", 3: "Elevated", 2: "Moderate", 1: "Stable" };

const severityAccent = (rating) => {
  if (rating >= 4) return "text-brand-accent border-brand-accent";
  if (rating === 3) return "text-amber-600 border-amber-600";
  return "text-brand-muted border-brand-muted";
};

function SeverityPips({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-4 h-1 transition-colors duration-300 ${
            n <= rating
              ? rating >= 4 ? "bg-brand-accent"
              : rating === 3 ? "bg-amber-600"
              : "bg-brand-muted"
              : "bg-brand-border"
          }`}
        />
      ))}
    </div>
  );
}

// ─── State card ───────────────────────────────────────────────────────────────

function StateCard({ state }) {
  const {
    state_id, slug, label, short_description,
    ui_severity_rating, service_tier_recommendation,
    hammer_citation_ids, memos,
  } = state;

  const accentClass = severityAccent(ui_severity_rating);

  return (
    <a
      href={`/vault/lexicon/${slug}`}
      className="border border-brand-border bg-brand-bg p-6 flex flex-col gap-4 hover:border-brand-accent transition-all duration-200 group relative"
    >
      {/* Severity badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SeverityPips rating={ui_severity_rating} />
          <span className={`font-mono text-[9px] tracking-widest uppercase border px-1.5 py-0.5 self-start ${accentClass}`}>
            {SEVERITY_LABEL[ui_severity_rating]}
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-widest uppercase text-brand-muted/50 group-hover:text-brand-muted transition-colors">
          {state_id}
        </span>
      </div>

      {/* Label */}
      <h2
        className="text-2xl leading-tight text-brand-text group-hover:text-brand-accent transition-colors duration-300"
        style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
      >
        {label}
      </h2>

      {/* Quick look */}
      <p className="font-mono text-[10px] text-brand-muted leading-relaxed line-clamp-3">
        {short_description}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4 pt-3 border-t border-brand-border mt-auto">
        <div>
          <p className="font-mono text-[8px] tracking-widest uppercase text-brand-muted/60 mb-0.5">Citations</p>
          <p
            className="text-lg text-brand-accent leading-none"
            style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}
          >
            {hammer_citation_ids.length}
          </p>
        </div>
        <div className="w-px h-6 bg-brand-border" />
        <div>
          <p className="font-mono text-[8px] tracking-widest uppercase text-brand-muted/60 mb-0.5">Memos</p>
          <p
            className="text-lg text-brand-text leading-none"
            style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}
          >
            {memos.length}
          </p>
        </div>
        <div className="w-px h-6 bg-brand-border" />
        <div className="ml-auto">
          <p className="font-mono text-[8px] tracking-widest uppercase text-brand-muted/60 mb-0.5">Tier</p>
          <p className="font-mono text-[9px] text-brand-muted uppercase tracking-wider">
            {service_tier_recommendation.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      {/* Hover arrow */}
      <span className="absolute bottom-6 right-6 font-mono text-[9px] tracking-widest uppercase text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Dossier →
      </span>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LexiconIndexPage() {
  // getAllStates() returns all 12 states sorted by ui_severity_rating DESC
  const states = getAllStates();

  const totalCitations = states.reduce((sum, s) => sum + s.hammer_citation_ids.length, 0);

  return (
    <main className="bg-brand-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="border-b border-brand-border px-6 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted mb-6">
            Principal Resolution // Vault Lexicon
          </p>
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h1
              className="text-5xl md:text-7xl leading-none text-brand-text"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              The Institutional<br />Lexicon.
            </h1>
            <div className="flex gap-8 items-end shrink-0">
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">States Defined</p>
                <p className="text-4xl text-brand-accent" style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}>12</p>
              </div>
              <div className="w-px h-10 bg-brand-border" />
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">Citations Indexed</p>
                <p className="text-4xl text-brand-accent" style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}>{totalCitations}</p>
              </div>
            </div>
          </div>

          <p className="font-mono text-sm text-brand-muted leading-relaxed max-w-2xl mt-8">
            Every pattern of organizational dysfunction, named and mapped. Each state includes the
            forensic proof layer, the diagnostic indicators, and the resolution tier. Sorted by
            severity — most critical first.
          </p>
        </div>
      </section>

      {/* ── Severity key ── */}
      <section className="border-b border-brand-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 items-center">
          <span className="font-mono text-[9px] tracking-widest uppercase text-brand-muted shrink-0">
            Severity Key:
          </span>
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-3 h-1 ${n >= 4 ? "bg-brand-accent" : n === 3 ? "bg-amber-600" : "bg-brand-muted"}`} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-muted">
                {n} — {SEVERITY_LABEL[n]}
              </span>
            </div>
          ))}
          <div className="ml-auto">
            <a
              href="/vault/lexicon#hammer"
              className="font-mono text-[9px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              Hammer Index →
            </a>
          </div>
        </div>
      </section>

      {/* ── State grid ── */}
      <section className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {states.map((state) => (
              <StateCard key={state.state_id} state={state} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Hammer Index anchor section ── */}
      <section id="hammer" className="border-t border-brand-border px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-2">
                Forensic Proof Layer
              </p>
              <h2
                className="text-3xl text-brand-text"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                The Hammer Index
              </h2>
              <p className="font-mono text-xs text-brand-muted mt-3 max-w-xl leading-relaxed">
                100 verified citations indexed against the 12 Institutional States. The proof is
                public — you can read the same research we do. What's restricted is the resolution.
              </p>
            </div>
            <a
              href="/vault/lexicon/hammer-index"
              className="shrink-0 font-mono text-[10px] tracking-widest uppercase border border-brand-text text-brand-text px-6 py-3 hover:bg-brand-text hover:text-brand-bg transition-all duration-200"
            >
              View Full Index →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer nav ── */}
      <section className="border-t border-brand-border px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-6">
            <a href="/vault" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">← The Vault</a>
            <a href="/vault/intelligence" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">Intelligence Memos →</a>
            <a href="/audit" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">Run the Diagnostic →</a>
          </div>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
            Principal Resolution // Lexicon v2.1
          </p>
        </div>
      </section>

    </main>
  );
}