"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * BridgeSection // Principal Resolution
 * Transitional pulled-quote section between Hero and Audit.
 * Creates a threshold moment: who we are → what you're about to experience.
 * Scroll-driven color shift: brand-bg → brand-text → brand-bg.
 * Typography: Newsreader italic for body, Space Mono for attribution.
 * Simple fade-in on scroll entry. No duplicate style props.
 */
export default function BridgeSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.60, 1.0],
    ['#FAF9F6', '#1C1C1C', '#1C1C1C', '#FAF9F6']
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.20, 0.65, 1.0],
    ['#1C1C1C', '#FAF9F6', '#FAF9F6', '#1C1C1C']
  );

  const mutedColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.60, 1.0],
    ['#6B6560', '#A09890', '#A09890', '#6B6560']
  );

  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.60, 1.0],
    ['#FF4500', '#FF6B35', '#FF6B35', '#FF4500']
  );

  const borderColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.60, 1.0],
    ['#D0CBC2', '#2C2C2C', '#2C2C2C', '#D0CBC2']
  );

  const radialOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.60, 0.85],
    [0, 0.07, 0]
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
      className="relative py-40 md:py-56 overflow-hidden border-t border-b"
    >
      {/* Radial accent glow -- appears at peak darkness */}
      <motion.div
        style={{ opacity: radialOpacity }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 12% 50%, #FF4500 0%, transparent 60%)' }}
        />
      </motion.div>

      {/* Vertical accent rule -- left rail */}
      <motion.div
        style={{ backgroundColor: accentColor }}
        className="absolute left-6 lg:left-24 top-1/2 -translate-y-1/2 w-px h-24 hidden md:block opacity-20"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
        <div className="max-w-3xl md:ml-12 lg:ml-16">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-5 mb-12"
          >
            <motion.div style={{ backgroundColor: accentColor }} className="w-6 h-px" />
            <motion.span
              style={{ color: accentColor }}
              className="font-mono text-[10px] uppercase tracking-briefing font-bold"
            >
              A Word // Before You Begin
            </motion.span>
          </motion.div>

          {/* Primary pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mb-10"
          >
            <motion.p
              style={{ color: textColor }}
              className="font-serif italic leading-tight tracking-tighter"
              css-size="clamp(1.55rem, 3vw, 2.7rem)"
            >
              <span style={{ fontSize: 'clamp(1.55rem, 3vw, 2.7rem)' }}>
                Most assessments tell you what you already suspected. This one tells you what it's been costing you -- precisely, personally, and in plain language. It takes three minutes. Most people find it unsettling in the best possible way.
              </span>
            </motion.p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ backgroundColor: accentColor }}
            className="w-full h-px mb-10 origin-left opacity-20"
          />

          {/* Secondary pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="mb-10 pl-6 border-l-2"
            style={{ borderLeftColor: '#FF450040' }}
          >
            <motion.p
              style={{ color: mutedColor }}
              className="font-serif italic leading-relaxed"
            >
              <span style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>
                We built this because the conversation most organizations need to have doesn't have a safe place to start. Consider this the safe place.
              </span>
            </motion.p>
          </motion.div>

          {/* Attribution -- PR */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <motion.div
              style={{ backgroundColor: accentColor }}
              className="w-8 h-px opacity-40"
            />
            <motion.span
              style={{ color: accentColor }}
              className="font-mono text-[11px] uppercase tracking-briefing font-bold"
            >
              -- PR
            </motion.span>
          </motion.div>

        </div>
      </div>

      {/* Bottom-right atmospheric accent -- mirrors left glow */}
      <motion.div
        style={{ opacity: radialOpacity }}
        className="absolute bottom-0 right-0 w-96 h-64 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, #FF4500 0%, transparent 65%)' }}
        />
      </motion.div>

    </motion.section>
  );
}