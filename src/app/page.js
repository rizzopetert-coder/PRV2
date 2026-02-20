"use client";

import HeroV2 from '../components/HeroV2';
import AuditSystem from '../components/diagnostic/AuditSystem';
import Capabilities from '../components/Capabilities';
import Briefings from '../components/Briefings';
import Footer from '../components/Footer';

/**
 * Principal Resolution // Institutional Home
 * Refactored: Full-Width Architecture and Executive Scale Routing.
 * Tenet: Results (Effectiveness).
 */

// 🏛️ CENTRAL ROUTING CONSTANTS
// These IDs drive the Dubsado Handshake.
const AUDIT_FORM_ID = "698e21f6638e90df485f3b60"; // The Diagnostic Handshake
const DIRECT_FORM_ID = "69937d79a3c62a9b7b4ff167"; // The Direct Handshake

const DIRECT_URL = `https://portal.principalresolution.com/public/form/view/${DIRECT_FORM_ID}`;

export default function Home() {
  return (
    <main className="bg-brand-bg min-h-screen flex flex-col antialiased">
      
      {/* 🏛️ PHASE 01: THE ENTRANCE (DIRECT PATH) 
          Scaled for high-intent Principals who require immediate resolution. */}
      <HeroV2 contactUrl={DIRECT_URL} />
      
      {/* 🏛️ PHASE 02: THE TERMINAL (DIAGNOSTIC PATH)
          Now expanded to full-width to accommodate the Executive Scale audit. */}
      <AuditSystem formId={AUDIT_FORM_ID} />
      
      {/* 🏛️ PHASE 03: THE EVIDENCE (SUPPORTING PATHS)
          Providing the intellectual weight and capability mapping. */}
      <div className="flex flex-col">
        <Capabilities contactUrl={DIRECT_URL} />
        <Briefings contactUrl={DIRECT_URL} />
      </div>
      
      {/* 🏛️ PHASE 04: THE ANCHOR
          Final exit point for the institutional protocol. */}
      <Footer contactUrl={DIRECT_URL} />
      
    </main>
  );
}