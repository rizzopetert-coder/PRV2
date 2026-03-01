"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// ─── Token / Session Detection ────────────────────────────────────────────────
//
// Authority hierarchy (Phase I.5):
//   1. VERIFIED  — sessionStorage.vault_verified === "true" (client access key flow)
//   2. TOKENIZED — pr_vault_token cookie is present and non-empty (SocialTokenTrigger flow)
//   3. TOKENIZED — sessionStorage.vault_token_* JSON (legacy fallback for old tabs)
//   4. GUEST     — no token found
//
// The cookie is set by:
//   - SocialTokenTrigger.jsx (share-to-unlock, 72-hour hex token)
//   - vault/verify/page.jsx (client key entry, 72-hour access)
// Both write pr_vault_token as a plain string (not JSON).
//
// Phase II: cookie will be HttpOnly (set by POST /api/vault/token),
// so client-side reading of the cookie will no longer work.
// At that point, replace cookie check with a fetch to /api/vault/session.

function getVaultCookieValue() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("pr_vault_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function useVaultSession() {
  const [accessLevel, setAccessLevel] = useState("GUEST"); // GUEST | TOKENIZED | VERIFIED
  const [tokenExpiry, setTokenExpiry] = useState(null);

  useEffect(() => {
    function check() {
      try {
        // ── 1. VERIFIED — client access key session (highest authority) ──────
        if (sessionStorage.getItem("vault_verified") === "true") {
          setAccessLevel("VERIFIED");
          setTokenExpiry(null);
          return;
        }

        // ── 2. TOKENIZED — pr_vault_token cookie (primary Phase I.5 source) ─
        // Cookie value is a plain hex string. Existence check is sufficient for Phase I.
        // Expiry is tracked separately in sessionStorage via vault_meta_* (see SocialTokenTrigger).
        const cookieValue = getVaultCookieValue();
        if (cookieValue && cookieValue.trim() !== "") {
          setAccessLevel("TOKENIZED");
          // Try to recover expiry from any vault_meta_* sessionStorage entry
          const metaKey = Object.keys(sessionStorage).find((k) =>
            k.startsWith("vault_meta_")
          );
          if (metaKey) {
            try {
              const meta = JSON.parse(sessionStorage.getItem(metaKey));
              if (meta?.expires_at && Date.now() < meta.expires_at) {
                setTokenExpiry(meta.expires_at);
              }
            } catch { /* expiry display degrades gracefully */ }
          }
          return;
        }

        // ── 3. TOKENIZED — legacy sessionStorage pr_vault_token (JSON) ───────
        // Handles any tabs that ran before the cookie upgrade.
        const canonical = sessionStorage.getItem("pr_vault_token");
        if (canonical) {
          try {
            const token = JSON.parse(canonical);
            if (Date.now() < token.expires_at) {
              setAccessLevel("TOKENIZED");
              setTokenExpiry(token.expires_at);
              return;
            } else {
              sessionStorage.removeItem("pr_vault_token");
            }
          } catch {
            sessionStorage.removeItem("pr_vault_token");
          }
        }

        // ── 4. TOKENIZED — legacy vault_token_* sessionStorage (multi-key) ───
        const keys = Object.keys(sessionStorage).filter((k) =>
          k.startsWith("vault_token_")
        );
        for (const key of keys) {
          const raw = sessionStorage.getItem(key);
          if (!raw) continue;
          try {
            const token = JSON.parse(raw);
            if (Date.now() < token.expires_at) {
              setAccessLevel("TOKENIZED");
              setTokenExpiry(token.expires_at);
              return;
            } else {
              sessionStorage.removeItem(key);
            }
          } catch {
            sessionStorage.removeItem(key);
          }
        }

        // ── 5. GUEST ──────────────────────────────────────────────────────────
        setAccessLevel("GUEST");
        setTokenExpiry(null);
      } catch {
        setAccessLevel("GUEST");
        setTokenExpiry(null);
      }
    }

    check();

    // Sync across tabs and listen for token events dispatched by SocialTokenTrigger,
    // vault/verify page, and AuditSystem
    window.addEventListener("storage", check);
    window.addEventListener("PR_TOKEN_ISSUED", check);
    window.addEventListener("PR_SESSION_CLEARED", check);

    const interval = setInterval(check, 30_000);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("PR_TOKEN_ISSUED", check);
      window.removeEventListener("PR_SESSION_CLEARED", check);
      clearInterval(interval);
    };
  }, []);

  return { accessLevel, tokenExpiry };
}

// ─── Global Event Dispatch ────────────────────────────────────────────────────

function dispatchUnlockTrigger(mode, href) {
  window.dispatchEvent(
    new CustomEvent("PR_TRIGGER_UNLOCK", {
      detail: { mode, href, timestamp: Date.now() },
      bubbles: true,
    })
  );
}

function formatExpiry(ts) {
  if (!ts) return null;
  const remaining = ts - Date.now();
  if (remaining <= 0) return null;
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── Param label maps ─────────────────────────────────────────────────────────
// Signal/impact colors are semantic data, not brand chrome — kept as hex strings
// since they're used in inline styles for filter chips, not Tailwind classes.

const PARAM_META = {
  signal: {
    color: "#0891B2",
    values: {
      AVOIDANCE:          "Avoidance",
      CULTURAL_AVOIDANCE: "Cultural Avoidance",
      DECISIONS:          "Slow Decisions",
      STALLED_DECISIONS:  "Stalled Decisions",
      RESOLUTION_BLOCKAGE:"Resolution Blockage",
      ACTIVE_BLOCKAGE:    "Active Blockage",
      PERSONNEL_RISK:     "Personnel Risk",
      PERSONNEL_LOST:     "Personnel Lost",
    },
  },
  impact: {
    color: "#DC2626",
    values: {
      LEAK_RATIO:       "Leak Ratio",
      OPPORTUNITY_COST: "Opportunity Cost",
      EXECUTION_GAP:    "Execution Gap",
      RADIATED_IMPACT:  "Radiated Impact",
      PERSONNEL_RISK:   "Personnel Risk",
    },
  },
  context: {
    color: "#6B6560",
    values: {
      CONTEXT_TECH_MEDIA:       "High Volatility",
      CONTEXT_FINANCE_HEALTH:   "High Regulation",
      CONTEXT_NONPROFIT:        "Mission Tax",
      CONTEXT_MFG_LOGISTICS:    "Operational Weight",
      CONTEXT_CONSULTING_LEGAL: "Reputation Risk",
      CONTEXT_CONSTRUCTION:     "Project Fragment",
    },
  },
  state: {
    color: "#FF4500",
    values: {
      LAST_LEG:          "Last Leg",
      SACRED_COW:        "The Sacred Cow",
      CRACKED_MIRROR:    "Cracked Mirror",
      EXIT_PATTERN:      "The Exit Pattern",
      DEAD_CALM:         "Dead Calm",
      SILOSOLATION:      "Silosolation",
      RUNAWAY_TREADMILL: "Runaway Treadmill",
      FOSSIL_SYSTEM:     "The Fossil System",
      ANCHOR:            "The Anchor",
      BROKEN_COMPASS:    "Broken Compass",
      KID_GLOVES:        "Kid Gloves",
      UNLIT_ROOM:        "The Unlit Room",
    },
  },
};

const PATH_LABELS = {
  "/vault":             "The Vault",
  "/vault/lexicon":     "Lexicon",
  "/vault/intelligence":"Intelligence",
  "/secure/vault":      "The Core",
  "/secure/vault/core": "Core Frameworks",
  "/secure/vault/exec": "Executive",
};

// ─── Identity Indicator ───────────────────────────────────────────────────────

function IdentityIndicator({ accessLevel, tokenExpiry }) {
  const [hovered, setHovered] = useState(false);
  const expiry = formatExpiry(tokenExpiry);

  const config = {
    GUEST:     { label: "Access: Guest",     dotClass: "bg-brand-muted",   pulse: false },
    TOKENIZED: { label: "Access: Tokenized", dotClass: "bg-cyan-600",      pulse: true  },
    VERIFIED:  { label: "Access: Verified",  dotClass: "bg-brand-accent",  pulse: true  },
  };

  const { label, dotClass, pulse } = config[accessLevel];
  const textClass = accessLevel === "VERIFIED" ? "text-brand-accent"
                  : accessLevel === "TOKENIZED" ? "text-cyan-600"
                  : "text-brand-muted";

  return (
    <div
      className="flex items-center gap-2 select-none cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${dotClass}`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotClass}`} />
      </span>
      <div className="flex flex-col leading-none gap-0.5">
        <span className={`font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 ${textClass}`}>
          {label}
        </span>
        {accessLevel === "TOKENIZED" && hovered && expiry && (
          <span className="font-mono text-[8px] tracking-wider uppercase text-brand-muted">
            {expiry} remaining
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Unlock / Inquiry Prompt ──────────────────────────────────────────────────

function AccessPrompt({ mode, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey   = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  const isInquiry = mode === "inquiry";

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 w-72 bg-brand-bg border border-brand-border shadow-lg z-50 p-5"
      role="dialog"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-brand-muted mb-1">
            {isInquiry ? "Client Access" : "Restricted Access"}
          </p>
          <p
            className="text-base text-brand-text leading-tight"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {isInquiry ? "This requires a client engagement." : "The Core is locked."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-brand-muted hover:text-brand-text text-sm"
        >
          ×
        </button>
      </div>
      <p className="font-mono text-[10px] text-brand-muted leading-relaxed mb-4">
        {isInquiry
          ? "Executive-level access is reserved for active Principal Resolution engagements. If you're working with us, use your verified credentials."
          : "The resolution architecture is proprietary. Access is earned — not purchased. Share an Intelligence Memo to earn a 72-hour token."}
      </p>
      <div className="border-t border-brand-border pt-4 flex flex-col gap-2">
        {isInquiry ? (
          <a
            href="/contact"
            onClick={onClose}
            className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors"
          >
            Start an Inquiry →
          </a>
        ) : (
          <>
            <a
              href="/vault/intelligence"
              onClick={onClose}
              className="font-mono text-[9px] tracking-widest uppercase text-brand-accent hover:text-brand-text transition-colors"
            >
              Browse Intelligence Memos →
            </a>
            <a
              href="/vault/lexicon"
              onClick={onClose}
              className="font-mono text-[9px] tracking-widest uppercase text-brand-muted hover:text-brand-text transition-colors"
            >
              Start with the Lexicon →
            </a>
          </>
        )}
      </div>
      <div className="border-t border-brand-border mt-4 pt-3">
        <p className="font-mono text-[8px] tracking-widest uppercase text-brand-muted">
          {isInquiry ? "Verified session required" : "No active token // Session unverified"}
        </p>
      </div>
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ pathname, searchParams, router }) {
  const segments = [];

  if (pathname !== "/vault") {
    segments.push({ label: "The Vault", onClick: () => router.push("/vault") });
  }
  const currentLabel = PATH_LABELS[pathname];
  if (currentLabel && pathname !== "/vault") {
    segments.push({ label: currentLabel, onClick: () => router.push(pathname) });
  }

  const filterChips = [];
  for (const [paramKey, meta] of Object.entries(PARAM_META)) {
    const value = searchParams?.get(paramKey);
    if (value && meta.values[value]) {
      filterChips.push({
        paramKey,
        label:    meta.values[value],
        color:    meta.color,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete(paramKey);
          const qs = params.toString();
          router.push(pathname + (qs ? `?${qs}` : ""));
        },
      });
    }
  }

  if (segments.length === 0 && filterChips.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap min-h-[20px]">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-mono text-[8px] text-brand-border">›</span>}
          <button
            onClick={seg.onClick}
            className="font-mono text-[9px] tracking-widest uppercase text-brand-muted hover:text-brand-text transition-colors"
          >
            {seg.label}
          </button>
        </span>
      ))}
      {filterChips.map((chip) => (
        <span key={chip.paramKey} className="flex items-center gap-1">
          <span className="font-mono text-[8px] text-brand-border">›</span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase flex items-center gap-1 border px-1.5 py-0.5"
            style={{ color: chip.color, borderColor: chip.color + "40" }}
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              className="hover:opacity-60 transition-opacity ml-0.5 leading-none"
              aria-label={`Remove ${chip.label} filter`}
            >
              ×
            </button>
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── Nav link components ──────────────────────────────────────────────────────

const PUBLIC_LINKS = [
  { href: "/vault/lexicon",      label: "Reference",    sublabel: "12 States + Citations" },
  { href: "/vault/intelligence", label: "Intelligence", sublabel: "Memos + Editorial"     },
];

const SECURE_LINKS = [
  { href: "/secure/vault/core", label: "The Core",  mode: "token"   },
  { href: "/secure/vault/exec", label: "Executive", mode: "inquiry" },
];

function PublicNavLink({ href, label, sublabel, isActive }) {
  return (
    <a
      href={href}
      className={`group flex flex-col gap-0.5 px-4 py-2.5 border-b-2 transition-all duration-150 ${
        isActive
          ? "border-brand-accent text-brand-text"
          : "border-transparent text-brand-muted hover:text-brand-text hover:border-brand-border"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest uppercase">{label}</span>
      <span className="font-mono text-[8px] tracking-wider uppercase text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity leading-none">
        {sublabel}
      </span>
    </a>
  );
}

function SecureNavLink({ href, label, mode, accessLevel, onGuestClick }) {
  const isOpen =
    accessLevel === "VERIFIED" ||
    (accessLevel === "TOKENIZED" && mode === "token");

  if (isOpen) {
    return (
      <a
        href={href}
        className="flex flex-col gap-0.5 px-4 py-2.5 border-b-2 border-transparent hover:border-brand-accent text-brand-accent transition-all duration-150"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">{label}</span>
        <span className="font-mono text-[8px] tracking-wider uppercase text-brand-muted leading-none">Active</span>
      </a>
    );
  }

  function handleRestrictedClick(e) {
    e.preventDefault();
    dispatchUnlockTrigger(mode, href);
    onGuestClick();
  }

  return (
    <button
      onClick={handleRestrictedClick}
      aria-label={`${label} — restricted access`}
      className="flex flex-col gap-0.5 px-4 py-2.5 border-b-2 border-transparent text-brand-muted opacity-20 hover:opacity-50 transition-opacity duration-150 text-left cursor-not-allowed"
    >
      <span className="font-mono text-[10px] tracking-widest uppercase">{label}</span>
      <span className="font-mono text-[8px] tracking-wider uppercase leading-none">Restricted</span>
    </button>
  );
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function MobileMenu({ pathname, accessLevel, tokenExpiry, onSecureClick, onClose }) {
  return (
    <div className="absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-border z-40 shadow-md">
      <nav className="px-6 py-4 flex flex-col gap-1">
        {PUBLIC_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-3 border-l-2 transition-all duration-150 ${
              pathname.startsWith(link.href)
                ? "border-brand-accent text-brand-text"
                : "border-transparent text-brand-muted hover:text-brand-text"
            }`}
          >
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase">{link.label}</p>
              <p className="font-mono text-[8px] uppercase text-brand-muted mt-0.5">{link.sublabel}</p>
            </div>
          </a>
        ))}

        <div className="border-t border-brand-border mt-2 pt-3 flex flex-col gap-1">
          {SECURE_LINKS.map((link) => {
            const isOpen =
              accessLevel === "VERIFIED" ||
              (accessLevel === "TOKENIZED" && link.mode === "token");
            return isOpen ? (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="px-3 py-3 font-mono text-[10px] tracking-widest uppercase text-brand-accent"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.href}
                onClick={() => {
                  dispatchUnlockTrigger(link.mode, link.href);
                  onSecureClick(link.mode);
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-3 opacity-20 text-left w-full cursor-not-allowed"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brand-muted">{link.label}</p>
                  <p className="font-mono text-[8px] uppercase text-brand-muted mt-0.5">Restricted</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-brand-border mt-2 pt-3 px-3">
          <IdentityIndicator accessLevel={accessLevel} tokenExpiry={tokenExpiry} />
        </div>
      </nav>
    </div>
  );
}

// ─── Inner (needs useSearchParams) ───────────────────────────────────────────

function VaultNavInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { accessLevel, tokenExpiry } = useVaultSession();
  const [promptMode, setPromptMode]  = useState(null);
  const [mobileOpen, setMobileOpen]  = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // PR_TRIGGER_UNLOCK: catches external dispatches (e.g. middleware redirect → VaultPage → here)
  useEffect(() => {
    function handleUnlockTrigger(e) {
      const mode = e?.detail?.mode;
      if (mode === "token" || mode === "inquiry") setPromptMode(mode);
    }
    window.addEventListener("PR_TRIGGER_UNLOCK", handleUnlockTrigger);
    return () => window.removeEventListener("PR_TRIGGER_UNLOCK", handleUnlockTrigger);
  }, []);

  const isSecure = pathname.startsWith("/secure/vault");

  return (
    <header
      className={`relative bg-brand-bg z-30 transition-colors duration-400 ${
        isSecure ? "border-b border-brand-accent/30" : "border-b border-brand-border"
      }`}
    >
      {isSecure && <div className="h-px w-full bg-brand-accent/25" />}

      <div className="max-w-7xl mx-auto px-6">
        {/* Main row */}
        <div className="flex items-stretch justify-between h-12">

          {/* Wordmark */}
          <a href="/vault" className="flex items-center gap-3 shrink-0 mr-6">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-muted">
              Principal Resolution
            </span>
            <span className="font-mono text-[9px] text-brand-border">//</span>
            <span
              className="text-sm text-brand-text"
              style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
            >
              The Vault
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-stretch gap-0">
            {PUBLIC_LINKS.map((link) => (
              <PublicNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                sublabel={link.sublabel}
                isActive={pathname.startsWith(link.href)}
              />
            ))}
            <div className="flex items-center px-3">
              <div className="w-px h-5 bg-brand-border" />
            </div>
            {SECURE_LINKS.map((link) => (
              <SecureNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                mode={link.mode}
                accessLevel={accessLevel}
                onGuestClick={() => setPromptMode((p) => (p === link.mode ? null : link.mode))}
              />
            ))}
          </nav>

          {/* Identity indicator + prompt */}
          <div className="hidden md:flex items-center gap-4 ml-4 relative">
            <IdentityIndicator accessLevel={accessLevel} tokenExpiry={tokenExpiry} />
            {promptMode && (
              <AccessPrompt mode={promptMode} onClose={() => setPromptMode(null)} />
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 text-brand-muted hover:text-brand-text transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="1" y1="1" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="15" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="0" y1="1"  x2="16" y2="1"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="6"  x2="16" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Breadcrumb row */}
        <div className="hidden md:block pb-2">
          <Breadcrumb pathname={pathname} searchParams={searchParams} router={router} />
        </div>
      </div>

      {mobileOpen && (
        <MobileMenu
          pathname={pathname}
          accessLevel={accessLevel}
          tokenExpiry={tokenExpiry}
          onSecureClick={(mode) => setPromptMode(mode)}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function VaultNav() {
  return (
    <Suspense fallback={<header className="h-12 border-b border-brand-border bg-brand-bg" />}>
      <VaultNavInner />
    </Suspense>
  );
}