"use client";

import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/vaultAssets";
import { strategicBriefings } from "@/data/memos";
import { MEMOS, SIGNAL_LABELS, IMPACT_LABELS } from "@/data/vaultMemos";

/**
 * src/app/vault/lexicon/[slug]/page.jsx
 * Principal Resolution // Forensic Dossier
 *
 * Advisor Take sourcing (two-source model, driven by vault-manifest.json):
 *   advisor_take_source = 'manifest' → use advisor_take field directly
 *   advisor_take_source = 'MEMO-XX'  → join to memos.js by ID, use excerpt
 * No copy is hardcoded in this component. All editorial lives in data files.
 */

// ─── Advisor Take resolver ────────────────────────────────────────────────────

function resolveAdvisorTake(advisorTake, advisorTakeSource) {
  if (advisorTakeSource === "manifest" && advisorTake) return advisorTake;
  if (advisorTakeSource?.startsWith("MEMO-")) {
    const vaultMemo = MEMOS.find((m) => m.id === advisorTakeSource);
    if (vaultMemo) {
      const briefing = strategicBriefings.find((b) => b.title === vaultMemo.title);
      if (briefing) return briefing.excerpt;
    }
  }
  return null;
}

// ─── Severity display ─────────────────────────────────────────────────────────

function SeverityBar({ rating }) {
  const labels = { 5: "Critical", 4: "High", 3: "Elevated", 2: "Moderate", 1: "Stable" };
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`w-6 h-1.5 transition-colors duration-300 ${
              n <= rating
                ? rating >= 4 ? "bg-brand-accent"
                : rating === 3 ? "bg-amber-600"
                : "bg-brand-muted"
                : "bg-brand-border"
            }`}
          />
        ))}
      </div>
      <span
        className="text-2xl text-brand-accent"
        style={{ fontFamily: "'Fjalla One', Impact, sans-serif" }}
      >
        {labels[rating] ?? rating}
      </span>
    </div>
  );
}

// ─── Citation row ─────────────────────────────────────────────────────────────

function CitationLine({ citation }) {
  return (
    <div className="border-b border-brand-border py-4 grid grid-cols-12 gap-4 items-start group hover:bg-brand-text/[0.02] transition-colors px-4">
      <div className="col-span-1">
        <span className="font-mono text-[9px] tracking-widest text-brand-muted">
          {citation.citation_id}
        </span>
      </div>
      <div className="col-span-7">
        <p className="font-mono text-xs text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
          {citation.title}
        </p>
        <p className="font-mono text-[10px] text-brand-muted mt-1">
          {citation.source} — {citation.publication}, {citation.year}
        </p>
      </div>
      <div className="col-span-2">
        <div className="flex gap-0.5 items-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`w-1.5 h-1.5 rounded-full ${
                n <= citation.severity ? "bg-brand-accent" : "bg-brand-border"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2 flex justify-end">
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors"
        >
          Source →
        </a>
      </div>
    </div>
  );
}

// ─── Memo card ────────────────────────────────────────────────────────────────

function LexiconMemoCard({ memo }) {
  return (
    <a
      href={`/vault/intelligence/${memo.slug}`}
      className="border border-brand-border bg-brand-bg p-5 flex flex-col gap-3 hover:border-brand-accent transition-colors duration-200 group"
    >
      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted">
        {memo.id} // {memo.published}
      </p>
      <h3
        className="text-lg leading-tight text-brand-text group-hover:text-brand-accent transition-colors"
        style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
      >
        {memo.title}
      </h3>
      <p className="font-mono text-xs text-brand-muted leading-relaxed">{memo.teaser}</p>
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-brand-border">
        <span className="font-mono text-[9px] tracking-widest uppercase border border-cyan-600 text-cyan-600 px-1.5 py-0.5">
          {SIGNAL_LABELS[memo.signal_tag] || memo.signal_tag}
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase border border-red-600 text-red-600 px-1.5 py-0.5">
          {IMPACT_LABELS[memo.impact_tag] || memo.impact_tag}
        </span>
      </div>
      <span className="font-mono text-[9px] tracking-widest uppercase text-brand-accent mt-auto">
        Read Memo →
      </span>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LexiconStatePage({ params }) {
  const assets = getStateBySlug(params.slug);
  if (!assets?.found) notFound();

  const {
    state_id, label, short_description,
    ui_severity_rating, service_tier_recommendation,
    hammer_citation_ids, memos, resolution_playbook_ids,
    advisor_take, advisor_take_source,
  } = assets;

  const advisorTake = resolveAdvisorTake(advisor_take, advisor_take_source);

  let allCitations = [];
  try {
    const raw = require("@/data/hammer-citations.json");
    const list = Array.isArray(raw) ? raw : raw.citations ?? [];
    allCitations = list.filter((c) => hammer_citation_ids.includes(c.citation_id));
  } catch { /* graceful degradation */ }

  return (
    <main className="bg-brand-bg min-h-screen">

      {/* ── 1. THE VERDICT ── */}
      <section className="border-b border-brand-border px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted mb-6">
            Principal Resolution // Institutional State
          </p>
          <div className="flex items-start justify-between gap-8 mb-8">
            <h1
              className="text-5xl md:text-6xl leading-none text-brand-text"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              {label}
            </h1>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-2">Severity</p>
              <SeverityBar rating={ui_severity_rating} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">Resolution Tier</p>
              <span className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                {service_tier_recommendation.replace(/_/g, " ")}
              </span>
            </div>
            <div className="w-px h-8 bg-brand-border" />
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">Forensic Citations</p>
              <span className="font-mono text-xs text-brand-text">{hammer_citation_ids.length} Verified</span>
            </div>
            <div className="w-px h-8 bg-brand-border" />
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">State ID</p>
              <span className="font-mono text-xs text-brand-text">{state_id}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE MECHANICS ── */}
      <section className="border-b border-brand-border px-6 py-14">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-4">The Pattern</p>
            <p className="font-mono text-sm text-brand-text leading-relaxed">{short_description}</p>
          </div>
          {advisorTake && (
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-accent mb-4">Advisor // So What</p>
              <blockquote
                className="text-xl leading-relaxed text-brand-text border-l-2 border-brand-accent pl-6"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                {advisorTake}
              </blockquote>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. THE PROOF ── */}
      <section className="border-b border-brand-border px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-2">The Proof</p>
              <h2
                className="text-2xl text-brand-text"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                Hammer Index Citations
              </h2>
            </div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
              {hammer_citation_ids.length} Linked
            </p>
          </div>

          {allCitations.length > 0 ? (
            <div className="border border-brand-border">
              <div className="border-b border-brand-border px-4 py-2 bg-brand-text/[0.03] grid grid-cols-12 gap-4">
                {[{ span: 1, label: "ID" }, { span: 7, label: "Finding" }, { span: 2, label: "Weight" }, { span: 2, label: "" }].map(
                  ({ span, label }) => (
                    <div key={label} className={`col-span-${span}`}>
                      <span className="font-mono text-[8px] tracking-widest uppercase text-brand-muted">{label}</span>
                    </div>
                  )
                )}
              </div>
              {allCitations.map((c) => <CitationLine key={c.citation_id} citation={c} />)}
            </div>
          ) : (
            <div className="border border-brand-border px-6 py-8">
              <p className="font-mono text-xs text-brand-muted mb-4">
                Citations loading.{" "}
                <a href="/vault/lexicon#hammer" className="text-brand-accent hover:text-brand-text transition-colors">
                  View full index →
                </a>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hammer_citation_ids.map((id) => (
                  <span key={id} className="font-mono text-[9px] tracking-widest text-brand-muted border border-brand-border px-1.5 py-0.5">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. THE INTELLIGENCE ── */}
      <section className="border-b border-brand-border px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-2">The Intelligence</p>
          <h2
            className="text-2xl text-brand-text mb-8"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            Intelligence Memos
          </h2>
          {memos.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {memos.map((memo) => <LexiconMemoCard key={memo.id} memo={memo} />)}
            </div>
          ) : (
            <div className="border border-brand-border px-6 py-8">
              <p className="font-mono text-xs text-brand-muted">No Intelligence Memos linked to this state yet.</p>
              <a href="/vault/intelligence" className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors mt-4 inline-block">
                Browse all memos →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. THE RESOLUTION ── */}
      <section className="px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-2">The Resolution</p>
          <h2
            className="text-2xl text-brand-text mb-8"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            Resolution Core
          </h2>
          <div className="border border-brand-border px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="font-mono text-[9px] tracking-widest uppercase border border-brand-accent text-brand-accent px-2 py-0.5 mb-4 inline-block">
                Restricted
              </span>
              <p
                className="text-xl text-brand-text mb-2"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                Resolution Core is gated.
              </p>
              <p className="font-mono text-xs text-brand-muted leading-relaxed max-w-md">
                The proprietary resolution architecture for {label} — case frameworks,
                intervention sequences, and operational detail — is available to verified clients only.
              </p>
            </div>
            <a
              href="/contact"
              className="shrink-0 font-mono text-[10px] tracking-widest uppercase border border-brand-text text-brand-text px-8 py-4 hover:bg-brand-text hover:text-brand-bg transition-all duration-200 whitespace-nowrap"
            >
              Request Verified Access →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="border-t border-brand-border px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-6">
            <a href="/vault/lexicon" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">← All States</a>
            <a href="/vault/lexicon#hammer" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">Hammer Index →</a>
            <a href="/audit" className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors">Run the Diagnostic →</a>
          </div>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
            {state_id} // Principal Resolution
          </p>
        </div>
      </section>

    </main>
  );
}