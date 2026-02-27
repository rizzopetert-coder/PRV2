"use client";

import HeroV2 from '../components/HeroV2';
import AuditSystem from '../components/diagnostic/AuditSystem';
import Capabilities from '../components/Capabilities';
import Briefings from '../components/Briefings';
import Footer from '../components/Footer';
import BridgeSection from '../components/BridgeSection';

/**
 * Principal Resolution // Institutional Home
 * Refactored: Full-Width Architecture and Executive Scale Routing.
 * Tenet: Results (Effectiveness).
 */

const AUDIT_FORM_ID = "698e21f6638e90df485f3b60";
const DIRECT_FORM_ID = "69937d79a3c62a9b7b4ff167";
const DIRECT_URL = `https://portal.principalresolution.com/public/form/view/${DIRECT_FORM_ID}`;

export default function Home() {
  return (
    <main className="bg-brand-bg min-h-screen flex flex-col antialiased">

      <HeroV2 contactUrl={DIRECT_URL} />
      <BridgeSection />
      <AuditSystem formId={AUDIT_FORM_ID} />

      <div className="flex flex-col">
        <Capabilities contactUrl={DIRECT_URL} />
        <Briefings contactUrl={DIRECT_URL} />
      </div>

      <Footer contactUrl={DIRECT_URL} />

    </main>
  );
}