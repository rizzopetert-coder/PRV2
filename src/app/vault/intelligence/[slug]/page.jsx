"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MEMOS, SIGNAL_LABELS, IMPACT_LABELS } from "@/data/vaultMemos";
import { strategicBriefings } from "@/data/memos";

/**
 * src/app/vault/intelligence/[slug]/page.jsx
 * Principal Resolution // Intelligence Memo Reader
 *
 * Join logic:
 *   1. Find metadata in vaultMemos.js by slug → gets id, state_tag, signal_tag, etc.
 *   2. Use MEMO-XX id to match title → find full content in memos.js (strategicBriefings)
 *
 * Auth gate:
 *   Reads pr_vault_token cookie client-side on mount.
 *   If missing → redirects to /vault?auth_trigger=true&attempted_path=[current]
 *   This mirrors the middleware.ts Phase I contract for public routes.
 */

// ─── Cookie reader ────────────────────────────────────────────────────────────

function getVaultCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("pr_vault_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

// ─── State labels (local — only 5 memos so keeping inline) ───────────────────

const STATE_DISPLAY = {
  KID_GLOVES:     "Kid Gloves",
  SILOSOLATION:   "Silosolation",
  BROKEN_COMPASS: "Broken Compass",
  SACRED_COW:     "The Sacred Cow",
  LAST_LEG:       "Last Leg",
  DEAD_CALM:      "Dead Calm",
  CRACKED_MIRROR: "Cracked Mirror",
  FOSSIL_SYSTEM:  "The Fossil System",
  EXIT_PATTERN:   "The Exit Pattern",
  RUNAWAY_TREADMILL: "Runaway Treadmill",
  ANCHOR:         "The Anchor",
  UNLIT_ROOM:     "The Unlit Room",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemoReaderPage({ params }) {
  const { slug } = params;
  const router = useRouter();

  const [authStatus, setAuthStatus] = useState("checking"); // checking | granted | denied

  // Auth gate — check cookie on mount
  useEffect(() => {
    const token = getVaultCookie();
    if (token && token.trim() !== "") {
      setAuthStatus("granted");
    } else {
      setAuthStatus("denied");
      const currentPath = `/vault/intelligence/${slug}`;
      router.replace(
        `/vault?auth_trigger=true&attempted_path=${encodeURIComponent(currentPath)}`
      );
    }
  }, [slug, router]);

  // ── Data join ──────────────────────────────────────────────────────────────
  const metadata = MEMOS.find((m) => m.slug === slug);
  const content = metadata
    ? strategicBriefings.find((b) => b.title === metadata.title)
    : null;

  // ── Loading / auth states ──────────────────────────────────────────────────
  if (authStatus === "checking") {
    return (
      <main className="bg-brand-bg min-h-screen flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </main>
    );
  }

  if (authStatus === "denied") {
    return (
      <main className="bg-brand-bg min-h-screen flex items-center justify-center">
        <p className="font-mono text-xs text-brand-muted">Redirecting...</p>
      </main>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!metadata || !content) {
    return (
      <main className="bg-brand-bg min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted mb-4">
            Principal Resolution // 404
          </p>
          <p
            className="text-2xl text-brand-text mb-6"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            Memo not found.
          </p>
          <a
            href="/vault/intelligence"
            className="font-mono text-[10px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors"
          >
            ← Return to Intelligence
          </a>
        </div>
      </main>
    );
  }

  // ── Full render ────────────────────────────────────────────────────────────
  return (
    <main className="bg-brand-bg min-h-screen">

      {/* ── Header ── */}
      <section className="border-b border-brand-border px-6 pt-16 pb-12">
        <div className="max-w-3xl mx-auto">

          {/* Nav */}
          <a
            href="/vault/intelligence"
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-muted hover:text-brand-accent transition-colors flex items-center gap-4 mb-16 group"
          >
            <div className="w-8 h-px bg-brand-border group-hover:w-16 group-hover:bg-brand-accent transition-all duration-500" />
            Return to Intelligence
          </a>

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-accent font-bold">
              {content.category} // Intelligence Memo
            </span>
            <div className="h-px flex-1 bg-brand-border/40" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
              {metadata.id}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl leading-tight text-brand-text mb-8"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {metadata.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-brand-border/40">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">Published</p>
              <p className="font-mono text-xs text-brand-text">{metadata.published}</p>
            </div>
            <div className="w-px h-8 bg-brand-border" />
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-1">State</p>
              <a
                href={`/vault/lexicon/${metadata.state_tag.toLowerCase().replace(/_/g, "-")}`}
                className="font-mono text-xs text-brand-accent hover:text-brand-text transition-colors uppercase tracking-wider"
              >
                {STATE_DISPLAY[metadata.state_tag] || metadata.state_tag}
              </a>
            </div>
            <div className="w-px h-8 bg-brand-border" />
            <div className="flex gap-1.5">
              <span className="font-mono text-[9px] tracking-widest uppercase border border-cyan-600 text-cyan-600 px-1.5 py-0.5">
                {SIGNAL_LABELS[metadata.signal_tag] || metadata.signal_tag}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase border border-red-600 text-red-600 px-1.5 py-0.5">
                {IMPACT_LABELS[metadata.impact_tag] || metadata.impact_tag}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">

          {/* Excerpt / lede */}
          <p
            className="text-2xl md:text-3xl leading-relaxed text-brand-muted mb-16 border-l-4 border-brand-accent pl-8 py-2"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {content.excerpt}
          </p>

          {/* Full content */}
          <div
            className="text-xl md:text-2xl leading-relaxed text-brand-text space-y-10 whitespace-pre-wrap"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {content.content}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-brand-border px-6 py-16">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted mb-2">
              End of Memo // {metadata.id}
            </p>
            <p
              className="text-xl text-brand-text"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              Immediate action required?
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href={`/vault/lexicon/${metadata.state_tag.toLowerCase().replace(/_/g, "-")}`}
              className="font-mono text-[10px] tracking-widest uppercase border border-brand-border text-brand-muted px-6 py-4 hover:border-brand-text hover:text-brand-text transition-all duration-200 whitespace-nowrap"
            >
              View State Dossier →
            </a>
            <a
              href="/contact"
              className="font-mono text-[10px] tracking-widest uppercase border border-brand-text text-brand-text px-6 py-4 hover:bg-brand-text hover:text-brand-bg transition-all duration-200 whitespace-nowrap"
            >
              Initiate Resolution →
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}