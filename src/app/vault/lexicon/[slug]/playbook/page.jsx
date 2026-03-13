"use client";

import { notFound } from "next/navigation";
import { getStateBySlug, getPlaybookById } from "@/lib/vaultAssets";

/**
 * src/app/vault/lexicon/[slug]/playbook/page.jsx
 * Principal Resolution // Resolution Playbook
 *
 * Renders the resolution playbook for a given institutional state.
 * Playbook content sourced from playbook-library.json via getPlaybookById().
 * Four sections render as continuous prose — no section labels by design.
 * The writing carries the structure. The labels don't need to.
 */

export default async function PlaybookPage({ params }) {
  const { slug } = await params;
  const assets = getStateBySlug(slug);
  if (!assets?.found) notFound();

  const { label, state_id, resolution_playbook_ids } = assets;

  const playbookId = resolution_playbook_ids?.[0];
  const playbook = playbookId ? getPlaybookById(playbookId) : null;
  if (!playbook) notFound();

  const { sections } = playbook;

  return (
    <main className="bg-brand-bg min-h-screen">

      {/* ── Breadcrumb ── */}
      <section className="border-b border-brand-border px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <a
            href="/vault/lexicon"
            className="font-mono text-[9px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
          >
            Lexicon
          </a>
          <span className="font-mono text-[9px] text-brand-border">/</span>
          <a
            href={`/vault/lexicon/${slug}`}
            className="font-mono text-[9px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
          >
            {label}
          </a>
          <span className="font-mono text-[9px] text-brand-border">/</span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-brand-accent">
            Resolution Playbook
          </span>
        </div>
      </section>

      {/* ── Header ── */}
      <section className="border-b border-brand-border px-6 pt-16 pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted mb-6">
            Principal Resolution // Resolution Playbook
          </p>
          <h1
            className="text-5xl md:text-6xl leading-none text-brand-text mb-4"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {label}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <span className="font-mono text-[9px] tracking-widest uppercase border border-brand-accent text-brand-accent px-2 py-0.5">
              {state_id}
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase border border-brand-border text-brand-muted px-2 py-0.5">
              {playbook.playbook_id}
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase border border-brand-border text-brand-muted px-2 py-0.5">
              {playbook.tier.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </section>

      {/* ── Playbook Body ── */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-16">

          {/* Mirror */}
          <div className="flex flex-col gap-5">
            {sections.mirror.map((paragraph, i) => (
              <p
                key={i}
                className="text-xl leading-relaxed text-brand-text"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-brand-accent" />

          {/* Mechanism */}
          <div className="flex flex-col gap-5">
            {sections.mechanism.map((paragraph, i) => (
              <p
                key={i}
                className="font-mono text-sm text-brand-text leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-brand-border" />

          {/* Cost */}
          <div className="flex flex-col gap-5">
            {sections.cost.map((paragraph, i) => (
              <p
                key={i}
                className="font-mono text-sm text-brand-text leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-brand-border" />

          {/* Resolution */}
          <div className="flex flex-col gap-5">
            {sections.resolution.map((paragraph, i) => (
              <p
                key={i}
                className={`font-mono text-sm leading-relaxed ${
                  i === sections.resolution.length - 1
                    ? "text-brand-accent"
                    : "text-brand-text"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <section className="border-t border-brand-border px-6 py-10">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-6">
            <a
              href={`/vault/lexicon/${slug}`}
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              ← {label}
            </a>
            <a
              href="/vault/lexicon"
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              All States →
            </a>
            <a
              href="/audit"
              className="font-mono text-[10px] tracking-widest uppercase text-brand-muted hover:text-brand-accent transition-colors"
            >
              Run the Diagnostic →
            </a>
          </div>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-muted">
            {state_id} // Principal Resolution
          </p>
        </div>
      </section>

    </main>
  );
}
