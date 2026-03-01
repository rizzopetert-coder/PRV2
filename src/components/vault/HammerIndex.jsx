"use client";

import { useState, useMemo } from "react";
import CITATIONS_RAW from "@/data/hammer-citations.json";

/**
 * HammerIndex // Principal Resolution
 * Reads from src/data/hammer-citations.json — single source of truth.
 * Field mapping: vault_signal_tag (JSON) → diagnostic_signal (component display)
 * All colors use brand-* tokens for StewardshipPanel compatibility.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

// hammer-citations.json wraps citations in a root object.
// Handle both { citations: [...] } and a bare array.
const CITATIONS = Array.isArray(CITATIONS_RAW)
  ? CITATIONS_RAW
  : CITATIONS_RAW.citations ?? [];

// ─── Display label maps ───────────────────────────────────────────────────────

const SOURCE_TYPE_LABELS = {
  survey:             "Survey",
  "industry-report":  "Industry Report",
  academic:           "Academic",
  "longitudinal-study": "Longitudinal Study",
  practitioner:       "Practitioner",
  government:         "Government",
};

// vault_signal_tag values are snake_case — convert to readable labels
function signalLabel(tag) {
  if (!tag) return tag;
  return tag
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const IMPACT_LABELS = {
  LEAK_RATIO:       "Leak Ratio",
  OPPORTUNITY_COST: "Opportunity Cost",
  EXECUTION_GAP:    "Execution Gap",
  RADIATED_IMPACT:  "Radiated Impact",
  PERSONNEL_RISK:   "Personnel Risk",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityDots({ severity }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            n <= severity
              ? severity >= 4
                ? "bg-brand-accent"
                : severity === 3
                ? "bg-amber-700"
                : "bg-brand-muted"
              : "bg-brand-border"
          }`}
        />
      ))}
    </div>
  );
}

function CitationRow({ citation, expanded, onToggle }) {
  const signal = citation.vault_signal_tag;
  const impact = citation.impact_tag;

  return (
    <div className="border-b border-brand-border last:border-b-0">

      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-4 hover:bg-brand-text/[0.02] transition-colors duration-150 group"
      >
        <div className="grid grid-cols-12 gap-4 items-center">

          {/* ID */}
          <div className="col-span-1">
            <span className="font-mono text-[9px] tracking-widest text-brand-muted">
              {citation.citation_id}
            </span>
          </div>

          {/* Title */}
          <div className="col-span-5">
            <p className="font-mono text-xs text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
              {citation.title}
            </p>
          </div>

          {/* Source */}
          <div className="col-span-2">
            <span className="font-mono text-[10px] text-brand-muted">
              {citation.source} // {citation.year}
            </span>
          </div>

          {/* Signal tag */}
          <div className="col-span-2">
            <span className="font-mono text-[9px] tracking-widest uppercase border border-cyan-600 text-cyan-600 px-1.5 py-0.5 leading-none">
              {signalLabel(signal)}
            </span>
          </div>

          {/* Severity + expand */}
          <div className="col-span-2 flex items-center justify-between">
            <SeverityDots severity={citation.severity} />
            <span
              className={`font-mono text-[10px] text-brand-muted transition-transform duration-200 inline-block ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </div>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-6 pb-6 grid grid-cols-2 gap-6 bg-brand-text/[0.02] border-t border-brand-border">

          {/* The What */}
          <div className="pt-4">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-muted mb-2">
              The Source // What
            </p>
            <p className="font-mono text-[11px] text-brand-text leading-relaxed mb-3">
              {citation.title}
            </p>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-brand-muted">
                {citation.source} — {citation.publication}, {citation.year}
              </p>
              <p className="font-mono text-[10px] text-brand-muted uppercase tracking-wider">
                {SOURCE_TYPE_LABELS[citation.source_type] || citation.source_type}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="font-mono text-[9px] tracking-widest uppercase border border-cyan-600 text-cyan-600 px-1.5 py-0.5">
                {signalLabel(signal)}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase border border-red-600 text-red-600 px-1.5 py-0.5">
                {IMPACT_LABELS[impact] || impact}
              </span>
            </div>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors mt-3 inline-block"
            >
              Primary Source →
            </a>
          </div>

          {/* Advisor Take */}
          <div className="pt-4 border-l border-brand-border pl-6">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-accent mb-2">
              Advisor // So What
            </p>
            <blockquote
              className="text-base leading-relaxed text-brand-text"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              {citation.advisor_take}
            </blockquote>
            <div className="mt-3 flex flex-wrap gap-1">
              {citation.state_ids.map((id) => (
                <span
                  key={id}
                  className="font-mono text-[9px] tracking-widest uppercase border border-brand-accent text-brand-accent px-1.5 py-0.5"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HammerIndex() {
  const [expandedId, setExpandedId]     = useState(null);
  const [activeSignal, setActiveSignal] = useState(null);
  const [activeImpact, setActiveImpact] = useState(null);
  const [sortField, setSortField]       = useState("citation_id");

  const uniqueSignals = useMemo(
    () => [...new Set(CITATIONS.map((c) => c.vault_signal_tag))].sort(),
    []
  );

  const uniqueImpacts = useMemo(
    () => [...new Set(CITATIONS.map((c) => c.impact_tag))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return CITATIONS.filter((c) => {
      if (activeSignal && c.vault_signal_tag !== activeSignal) return false;
      if (activeImpact && c.impact_tag !== activeImpact) return false;
      return true;
    }).sort((a, b) => {
      if (sortField === "severity")
        return b.severity - a.severity;
      if (sortField === "year")
        return b.year - a.year;
      return a.citation_id.localeCompare(b.citation_id);
    });
  }, [activeSignal, activeImpact, sortField]);

  return (
    <section className="bg-brand-bg min-h-screen">

      {/* ── Header ── */}
      <div className="border-b border-brand-border px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-muted mb-1">
                Principal Resolution // Forensic Proof Layer
              </p>
              <h2
                className="text-2xl text-brand-text"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                The Hammer Index
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
                {filtered.length} of {CITATIONS.length} Citations
              </p>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-3 items-start">

            {/* Signal filter */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="font-mono text-[9px] tracking-widest uppercase text-brand-muted shrink-0">
                Signal:
              </span>
              {uniqueSignals.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSignal((prev) => (prev === s ? null : s))}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    activeSignal === s
                      ? "bg-cyan-600 text-brand-bg border-cyan-600"
                      : "border-cyan-600 text-cyan-600 hover:bg-cyan-600/10"
                  }`}
                >
                  {signalLabel(s)}
                </button>
              ))}
            </div>

            {/* Impact filter */}
            <div className="flex flex-wrap gap-1.5 items-center mt-2">
              <span className="font-mono text-[9px] tracking-widest uppercase text-brand-muted shrink-0">
                Impact:
              </span>
              {uniqueImpacts.map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveImpact((prev) => (prev === i ? null : i))}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    activeImpact === i
                      ? "bg-red-600 text-brand-bg border-red-600"
                      : "border-red-600 text-red-600 hover:bg-red-600/10"
                  }`}
                >
                  {IMPACT_LABELS[i] || i}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex gap-1.5 items-center mt-2">
              <span className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
                Sort:
              </span>
              {[
                { key: "citation_id", label: "Index" },
                { key: "severity",    label: "Severity" },
                { key: "year",        label: "Year" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortField(key)}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    sortField === key
                      ? "bg-brand-text text-brand-bg border-brand-text"
                      : "border-brand-border text-brand-muted hover:border-brand-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="border-b border-brand-border px-6 py-2 bg-brand-text/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {[
              { span: 1, label: "ID" },
              { span: 5, label: "Finding" },
              { span: 2, label: "Source" },
              { span: 2, label: "Signal" },
              { span: 2, label: "Weight" },
            ].map(({ span, label }) => (
              <div key={label} className={`col-span-${span}`}>
                <span className="font-mono text-[8px] tracking-widest uppercase text-brand-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Citation rows ── */}
      <div className="max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-brand-muted">
              No citations match the active filters.
            </p>
            <button
              onClick={() => { setActiveSignal(null); setActiveImpact(null); }}
              className="font-mono text-[10px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors mt-4 inline-block"
            >
              Clear Filters →
            </button>
          </div>
        ) : (
          filtered.map((citation) => (
            <CitationRow
              key={citation.citation_id}
              citation={citation}
              expanded={expandedId === citation.citation_id}
              onToggle={() =>
                setExpandedId((prev) =>
                  prev === citation.citation_id ? null : citation.citation_id
                )
              }
            />
          ))
        )}
      </div>
    </section>
  );
}