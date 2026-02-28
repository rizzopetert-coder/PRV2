"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ─── Token detection ──────────────────────────────────────────────────────────
// Reads any active vault token from sessionStorage.
// In Phase II this will call /api/vault/session to verify server-signed token.

function useVaultSession() {
  const [hasToken, setHasToken] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  useEffect(() => {
    function check() {
      try {
        const keys = Object.keys(sessionStorage).filter((k) =>
          k.startsWith("vault_token_")
        );
        for (const key of keys) {
          const raw = sessionStorage.getItem(key);
          if (!raw) continue;
          const token = JSON.parse(raw);
          if (Date.now() < token.expires_at) {
            setHasToken(true);
            setTokenExpiry(token.expires_at);
            return;
          } else {
            sessionStorage.removeItem(key);
          }
        }
        setHasToken(false);
        setTokenExpiry(null);
      } catch {
        setHasToken(false);
        setTokenExpiry(null);
      }
    }

    check();
    // Re-check on storage events (token earned in another tab or modal)
    window.addEventListener("storage", check);
    // Also re-check every 60s for expiry
    const interval = setInterval(check, 60_000);
    return () => {
      window.removeEventListener("storage", check);
      clearInterval(interval);
    };
  }, []);

  return { hasToken, tokenExpiry };
}

function formatExpiry(ts) {
  if (!ts) return null;
  const remaining = ts - Date.now();
  if (remaining <= 0) return null;
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// ─── Nav structure ────────────────────────────────────────────────────────────

const PUBLIC_LINKS = [
  {
    href: "/vault",
    label: "The Vault",
    sublabel: "Hub",
    exact: true,
  },
  {
    href: "/vault/lexicon",
    label: "Lexicon",
    sublabel: "12 States + Citations",
    exact: false,
  },
  {
    href: "/vault/intelligence",
    label: "Intelligence",
    sublabel: "Memos + Editorial",
    exact: false,
  },
];

const SECURE_LINK = {
  href: "/secure/vault",
  label: "The Core",
  sublabel: "Proprietary Layer",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ href, label, sublabel, isActive, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group flex flex-col gap-0.5 px-4 py-2.5 transition-all duration-150 border-b-2 ${
        isActive
          ? "border-[#FF4500] text-[#1C1C1C]"
          : "border-transparent text-[#6B6560] hover:text-[#1C1C1C] hover:border-[#D0CBC2]"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest uppercase">{label}</span>
      <span className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] opacity-0 group-hover:opacity-100 transition-opacity duration-150 leading-none">
        {sublabel}
      </span>
    </a>
  );
}

function LockIndicator({ hasToken, tokenExpiry, onClick }) {
  const expiry = formatExpiry(tokenExpiry);

  if (hasToken) {
    return (
      <a
        href="/secure/vault"
        className="flex items-center gap-2.5 px-4 py-2.5 border border-[#FF4500]/30 hover:border-[#FF4500] transition-all duration-150 group"
      >
        {/* Active token dot */}
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4500] opacity-50" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4500]" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#FF4500]">
            The Core
          </span>
          {expiry && (
            <span className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] leading-none">
              Token active // {expiry}
            </span>
          )}
        </div>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 border border-[#D0CBC2] hover:border-[#6B6560] transition-all duration-150 group"
      aria-label="The Core -- restricted access. Earn a vault token to unlock."
    >
      {/* Lock icon -- SVG inline, no dependency */}
      <svg
        width="10"
        height="12"
        viewBox="0 0 10 12"
        fill="none"
        className="text-[#6B6560] group-hover:text-[#1C1C1C] transition-colors shrink-0"
      >
        <rect
          x="1"
          y="5"
          width="8"
          height="7"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M3 5V3.5a2 2 0 0 1 4 0V5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[#6B6560] group-hover:text-[#1C1C1C] transition-colors">
          The Core
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          Share to unlock →
        </span>
      </div>
    </button>
  );
}

// ─── Unlock Prompt ────────────────────────────────────────────────────────────
// Inline tooltip/drawer that appears when unauthenticated user clicks The Core.
// Avoids navigating to a dead end. Explains the mechanic and points to memos.

function UnlockPrompt({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 w-72 bg-[#FAF9F6] border border-[#D0CBC2] shadow-lg z-50 p-5"
      role="dialog"
      aria-label="Vault access required"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#6B6560] mb-1">
            Restricted Access
          </p>
          <p
            className="text-base text-[#1C1C1C] leading-tight"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            The Core is locked.
          </p>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-[#6B6560] hover:text-[#1C1C1C] text-sm leading-none mt-0.5"
        >
          ×
        </button>
      </div>

      {/* Explanation */}
      <p className="font-mono text-[10px] text-[#6B6560] leading-relaxed mb-4">
        The resolution architecture is proprietary. Access is earned -- not purchased. Share an
        Intelligence Memo to earn a 72-hour token.
      </p>

      {/* Divider */}
      <div className="border-t border-[#D0CBC2] pt-4 flex flex-col gap-2">
        <a
          href="/vault/intelligence"
          className="font-mono text-[9px] tracking-widest uppercase text-[#FF4500] hover:text-[#1C1C1C] transition-colors"
          onClick={onClose}
        >
          Browse Intelligence Memos →
        </a>
        <a
          href="/vault/lexicon"
          className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560] hover:text-[#1C1C1C] transition-colors"
          onClick={onClose}
        >
          Start with the Lexicon →
        </a>
      </div>

      {/* Token status */}
      <div className="border-t border-[#D0CBC2] mt-4 pt-3">
        <p className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">
          No active token // Session unverified
        </p>
      </div>
    </div>
  );
}

// ─── Mobile menu ──────────────────────────────────────────────────────────────

function MobileMenu({ pathname, hasToken, tokenExpiry, onLockClick, onClose }) {
  const expiry = formatExpiry(tokenExpiry);

  return (
    <div className="absolute top-full left-0 right-0 bg-[#FAF9F6] border-b border-[#D0CBC2] z-40 shadow-md">
      <nav className="px-6 py-4 flex flex-col gap-1">
        {PUBLIC_LINKS.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-3 border-l-2 transition-all duration-150 ${
                isActive
                  ? "border-[#FF4500] text-[#1C1C1C]"
                  : "border-transparent text-[#6B6560] hover:text-[#1C1C1C] hover:border-[#D0CBC2]"
              }`}
            >
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase">{link.label}</p>
                <p className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] mt-0.5">
                  {link.sublabel}
                </p>
              </div>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#FF4500]" />
              )}
            </a>
          );
        })}

        {/* Secure link in mobile */}
        <div className="border-t border-[#D0CBC2] mt-2 pt-3">
          {hasToken ? (
            <a
              href="/secure/vault"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-3"
            >
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#FF4500]">
                  The Core
                </p>
                <p className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] mt-0.5">
                  {expiry ? `Token active // ${expiry}` : "Access granted"}
                </p>
              </div>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4500] opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4500]" />
              </span>
            </a>
          ) : (
            <button
              onClick={() => { onLockClick(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-3 text-left"
            >
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#6B6560]">
                  The Core
                </p>
                <p className="font-mono text-[8px] tracking-wider uppercase text-[#6B6560] mt-0.5">
                  Restricted -- share to unlock
                </p>
              </div>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="text-[#6B6560]">
                <rect x="1" y="5" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VaultNav() {
  const pathname = usePathname();
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hasToken, tokenExpiry } = useVaultSession();
  const lockButtonRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="relative border-b border-[#D0CBC2] bg-[#FAF9F6] z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-stretch justify-between h-12">

          {/* Wordmark */}
          <a
            href="/vault"
            className="flex items-center gap-3 shrink-0 mr-8"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#6B6560]">
              Principal Resolution
            </span>
            <span className="font-mono text-[9px] text-[#D0CBC2]">//</span>
            <span
              className="text-sm text-[#1C1C1C]"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              The Vault
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-stretch gap-0">
            {PUBLIC_LINKS.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  sublabel={link.sublabel}
                  isActive={isActive}
                />
              );
            })}
          </nav>

          {/* Right side: secure access indicator */}
          <div className="hidden md:flex items-center ml-6 relative" ref={lockButtonRef}>
            <LockIndicator
              hasToken={hasToken}
              tokenExpiry={tokenExpiry}
              onClick={() => setShowUnlockPrompt((p) => !p)}
            />
            {showUnlockPrompt && !hasToken && (
              <UnlockPrompt onClose={() => setShowUnlockPrompt(false)} />
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 text-[#6B6560] hover:text-[#1C1C1C] transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="1" y1="1" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="15" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <MobileMenu
          pathname={pathname}
          hasToken={hasToken}
          tokenExpiry={tokenExpiry}
          onLockClick={() => setShowUnlockPrompt(true)}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}