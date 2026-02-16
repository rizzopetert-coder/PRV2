"use client";

import HeroV2 from '../components/HeroV2';
import AuditSystem from '../components/diagnostic/AuditSystem';
import Capabilities from '../components/Capabilities';
import Briefings from '../components/Briefings';
import Footer from '../components/Footer';

/**
 * Principal Resolution // Institutional Home
 * Bifurcated Routing: Diagnostic vs. Direct Pathing.
 * Tenet: Results (Effectiveness).
 */

// 🏛️ CENTRAL ROUTING CONSTANTS
const AUDIT_FORM_ID = "698e21f6638e90df485f3b60"; // The Diagnostic Handshake
const DIRECT_FORM_ID = "69937d79a3c62a9b7b4ff167"; // The Direct Handshake

const DIRECT_URL = `https://portal.principalresolution.com/public/form/view/${DIRECT_FORM_ID}`;

export default function Home() {
  return (
    <main className="bg-brand-bg min-h-screen">
      {/* 🏛️ DIRECT PATH: For high-intent/high-urgency Principals */}
      <HeroV2 contactUrl={DIRECT_URL} />
      
      {/* 🏛️ DIAGNOSTIC PATH: Internalized logic for harvesting Audit Data */}
      <AuditSystem formId={AUDIT_FORM_ID} />
      
      {/* 🏛️ SUPPORTING PATHS: All lead to Direct Inquiry */}
      <Capabilities contactUrl={DIRECT_URL} />
      <Briefings contactUrl={DIRECT_URL} />
      <Footer contactUrl={DIRECT_URL} />
    </main>
  );
}