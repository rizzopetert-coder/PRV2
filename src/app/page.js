"use client";

import HeroV2 from '../components/HeroV2';
import AuditSystem from '../components/diagnostic/AuditSystem';
import Capabilities from '../components/Capabilities';
import VaultWindow from '../components/VaultWindow';
import Footer from '../components/Footer';

/**
 * Principal Resolution // Institutional Home
 * Section order: Hero > Capabilities (How We Work) > AuditSystem > VaultWindow > Footer
 *
 * Briefings retired from homepage. Content absorbed into VaultWindow.
 * VaultWindow data source: src/data/memos.js (shared with /vault/intelligence)
 */

const DIRECT_FORM_ID = "69937d79a3c62a9b7b4ff167";
const DIRECT_URL = `https://portal.principalresolution.com/public/form/view/${DIRECT_FORM_ID}`;

export default function Home() {
  return (
    <main className="bg-brand-bg min-h-screen flex flex-col antialiased">

      <HeroV2 contactUrl={DIRECT_URL} />

      <Capabilities contactUrl={DIRECT_URL} />

      <AuditSystem />

      <VaultWindow contactUrl={DIRECT_URL} />

      <Footer contactUrl={DIRECT_URL} />

    </main>
  );
}