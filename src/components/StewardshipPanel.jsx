"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, X, Type, Sun, Shield,
  FileText, Terminal, Moon, Eye, RotateCcw, Anchor, Zap
} from 'lucide-react';

/**
 * StewardshipPanel // Principal Resolution
 * Cycle button (click) + Settings panel (gear icon).
 * Default theme: slate (Boardroom).
 * Font scaling with corrected type handling.
 */

const THEMES = [
  {
    id: 'slate',
    label: 'Boardroom',
    icon: <Moon size={18} />,
    desc: 'Where hard decisions get made.',
    swatch: ['#0F1117', '#1C1F2A', '#FF4500'],
  },
  {
    id: 'harbor',
    label: 'Harbor',
    icon: <Sun size={18} />,
    desc: 'Neutral ground. Full visibility.',
    swatch: ['#FAF9F6', '#F0EDE8', '#FF4500'],
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Shield size={18} />,
    desc: 'Built to last. Copper and discipline.',
    swatch: ['#1A1A14', '#2C2A1E', '#B87333'],
  },
  {
    id: 'briefing',
    label: 'Briefing',
    icon: <FileText size={18} />,
    desc: 'Urgent. No ambiguity tolerated.',
    swatch: ['#0D0D0D', '#1A0000', '#CC0000'],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: <Terminal size={18} />,
    desc: 'Analytical. Every variable visible.',
    swatch: ['#030D0D', '#071A1A', '#00E5FF'],
  },
];

const DEFAULT_THEME = 'slate';
const DEFAULT_FONT_SIZE = 100;

export default function StewardshipPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const initialized = useRef(false);

  // ─── Persist & Apply ───────────────────────────────────────────────────────

  const applyTheme = useCallback((id) => {
    setTheme(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('pr-theme', id);
  }, []);

  const applyFontSize = useCallback((percent) => {
    const clamped = Math.min(150, Math.max(80, Number(percent)));
    setFontSize(clamped);
    document.documentElement.style.fontSize = `${(clamped / 100) * 20}px`;
    localStorage.setItem('pr-font-size', String(clamped));
  }, []);

  // ─── Hydrate from storage ──────────────────────────────────────────────────

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const savedTheme = localStorage.getItem('pr-theme') || DEFAULT_THEME;
    const savedSize = Number(localStorage.getItem('pr-font-size')) || DEFAULT_FONT_SIZE;
    applyTheme(savedTheme);
    applyFontSize(savedSize);
  }, [applyTheme, applyFontSize]);

  // ─── Cycle logic ──────────────────────────────────────────────────────────

  const cycleTheme = useCallback(() => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    applyTheme(next.id);
  }, [theme, applyTheme]);

  const resetStewardship = useCallback(() => {
    applyTheme(DEFAULT_THEME);
    applyFontSize(DEFAULT_FONT_SIZE);
  }, [applyTheme, applyFontSize]);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  // ─── Keyboard trap for panel ───────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <>
      {/* ── TRIGGER CLUSTER ─────────────────────────────────────── */}
      <div className="fixed bottom-10 right-10 z-[110] flex items-center gap-2">

        {/* CYCLE BUTTON — primary action */}
        <motion.button
          onClick={cycleTheme}
          whileTap={{ scale: 0.93 }}
          aria-label={`Current theme: ${currentTheme.label}. Click to cycle.`}
          className="flex items-center gap-3 px-5 py-3.5 bg-brand-bg/80 border border-brand-border backdrop-blur-xl shadow-2xl hover:border-brand-accent transition-all duration-300 group"
        >
          {/* Live swatch dots */}
          <div className="flex items-center gap-1">
            {currentTheme.swatch.map((color, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="text-brand-text group-hover:text-brand-accent transition-colors">
            {currentTheme.icon}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-muted group-hover:text-brand-text transition-colors font-bold">
            {currentTheme.label}
          </span>
        </motion.button>

        {/* GEAR ICON — opens the full panel */}
        <motion.button
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 0.93 }}
          aria-label="Open stewardship panel"
          className="p-3.5 bg-brand-bg/80 border border-brand-border backdrop-blur-xl shadow-2xl hover:border-brand-accent transition-all duration-300 group"
        >
          <Settings
            size={16}
            className="text-brand-muted group-hover:text-brand-accent transition-colors duration-300 group-hover:rotate-90 transition-transform"
          />
        </motion.button>
      </div>

      {/* ── STEWARDSHIP PANEL ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-text/30 backdrop-blur-sm z-[201]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-brand-bg border-l border-brand-border z-[202] flex flex-col overflow-hidden"
              role="dialog"
              aria-label="Stewardship Panel"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-10 py-8 border-b border-brand-border/50 shrink-0">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent font-bold block">
                    Control Deck
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-brand-muted/60">
                    PR-v2 // Stewardship
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-brand-muted hover:text-brand-text transition-colors p-2"
                  aria-label="Close panel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 no-scrollbar">

                {/* ── TEXT LEGIBILITY ── */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Type size={14} className="text-brand-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-text font-bold">
                      Text Legibility
                    </span>
                  </div>
                  <div className="flex items-center gap-0 border border-brand-border">
                    <button
                      onClick={() => applyFontSize(fontSize - 10)}
                      disabled={fontSize <= 80}
                      className="px-5 py-4 text-brand-muted hover:text-brand-accent hover:bg-brand-accent/5 transition-all font-mono text-base font-bold disabled:opacity-20 disabled:cursor-not-allowed border-r border-brand-border"
                      aria-label="Decrease font size"
                    >
                      —
                    </button>
                    <span className="flex-grow text-center font-mono text-sm font-bold text-brand-text py-4">
                      {fontSize}%
                    </span>
                    <button
                      onClick={() => applyFontSize(fontSize + 10)}
                      disabled={fontSize >= 150}
                      className="px-5 py-4 text-brand-muted hover:text-brand-accent hover:bg-brand-accent/5 transition-all font-mono text-base font-bold disabled:opacity-20 disabled:cursor-not-allowed border-l border-brand-border"
                      aria-label="Increase font size"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-serif italic text-xs text-brand-muted/60 mt-3 leading-relaxed">
                    Scales the base type size site-wide. 80–150%.
                  </p>
                </section>

                {/* ── ATMOSPHERIC THEMES ── */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye size={14} className="text-brand-accent" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-text font-bold">
                      Atmospheric Themes
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {THEMES.map((t) => {
                      const active = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => applyTheme(t.id)}
                          className={`flex items-center gap-5 p-5 border text-left transition-all duration-300 group/theme ${
                            active
                              ? 'border-brand-accent bg-brand-accent/5'
                              : 'border-brand-border hover:border-brand-text/50'
                          }`}
                        >
                          {/* Swatch strip */}
                          <div className="flex flex-col gap-1 shrink-0">
                            {t.swatch.map((color, i) => (
                              <span
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          {/* Icon */}
                          <div className={`shrink-0 transition-colors ${active ? 'text-brand-accent' : 'text-brand-muted group-hover/theme:text-brand-text'}`}>
                            {t.icon}
                          </div>

                          {/* Labels */}
                          <div className="flex flex-col gap-0.5">
                            <span className={`font-mono text-[10px] uppercase tracking-widest font-bold transition-colors ${active ? 'text-brand-text' : 'text-brand-muted group-hover/theme:text-brand-text'}`}>
                              {t.label}
                            </span>
                            <span className="font-serif italic text-xs text-brand-muted/70 leading-snug">
                              {t.desc}
                            </span>
                          </div>

                          {/* Active indicator */}
                          {active && (
                            <div className="ml-auto shrink-0">
                              <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Footer: reset */}
              <div className="px-10 py-8 border-t border-brand-border/50 shrink-0">
                <button
                  onClick={resetStewardship}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-brand-border text-brand-muted font-mono text-[9px] uppercase tracking-[0.4em] hover:text-brand-accent hover:border-brand-accent transition-all font-bold"
                >
                  <RotateCcw size={13} />
                  Reset All Variables
                </button>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-brand-muted/30 text-center mt-4">
                  Restores Boardroom // 100% Scale
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
