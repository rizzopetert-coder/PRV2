"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * SocialTokenTrigger // Principal Resolution
 *
 * UPGRADED: Phase I → Phase I.5
 * Token storage: sessionStorage → pr_vault_token cookie (72-hour, path=/)
 * This matches the middleware.ts Phase I contract and the vault/verify page.
 * VaultNav listens for PR_TOKEN_ISSUED to update the access indicator reactively.
 *
 * Phase II note: move token issuance to POST /api/vault/token (server-side)
 * so the token is set as HttpOnly via Set-Cookie header, not client JS.
 */

const TOKEN_DURATION_MS = 72 * 60 * 60 * 1000;

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function setVaultCookie(tokenValue, expiresAt) {
  const expires = new Date(expiresAt).toUTCString();
  document.cookie = `pr_vault_token=${encodeURIComponent(tokenValue)}; path=/; expires=${expires}; SameSite=Strict`;
}

function getVaultCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((r) => r.startsWith("pr_vault_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function clearVaultCookie() {
  document.cookie = "pr_vault_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function generateToken(memoId) {
  const issuedAt  = Date.now();
  const expiresAt = issuedAt + TOKEN_DURATION_MS;
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { memo_id: memoId, issued_at: issuedAt, expires_at: expiresAt, token: hex };
}

function getStoredToken(memoId) {
  try {
    const cookieValue = getVaultCookie();
    if (!cookieValue) return null;
    const raw = sessionStorage.getItem(`vault_meta_${memoId}`);
    if (!raw) return { memo_id: memoId, issued_at: null, expires_at: null, token: cookieValue };
    const meta = JSON.parse(raw);
    if (Date.now() > meta.expires_at) {
      sessionStorage.removeItem(`vault_meta_${memoId}`);
      clearVaultCookie();
      return null;
    }
    return meta;
  } catch {
    return null;
  }
}

function storeToken(memoId, tokenObj) {
  setVaultCookie(tokenObj.token, tokenObj.expires_at);
  try {
    sessionStorage.setItem(`vault_meta_${memoId}`, JSON.stringify(tokenObj));
  } catch { /* cookie still works */ }
}

// ─── Platforms ────────────────────────────────────────────────────────────────

const PLATFORMS = {
  linkedin: {
    label: "LinkedIn",
    buildUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  twitter: {
    label: "X / Twitter",
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
};

// ─── UI state machine ─────────────────────────────────────────────────────────

const TRIGGER_STATES = {
  IDLE: "IDLE", WAITING: "WAITING", VERIFYING: "VERIFYING",
  GRANTED: "GRANTED", ALREADY_GRANTED: "ALREADY_GRANTED", FAILED: "FAILED",
};

const STATE_COPY = {
  IDLE:            { eyebrow: "Vault Access",                headline: "Read the Resolution",       body: "The diagnostic result tells you what. This memo tells you why — and what to do about it. Share to unlock 72-hour access.", cta: "Share to Unlock" },
  WAITING:         { eyebrow: "Vault Access // Pending",     headline: "Complete the share.",        body: "The share window is open. Finish the post, then return here. Access is granted on your return.",                          cta: "Verifying..."   },
  VERIFYING:       { eyebrow: "Vault Access // Verifying",   headline: "Confirming intent.",         body: null,                                                                                                                      cta: null             },
  GRANTED:         { eyebrow: "Vault Access // Granted",     headline: "72 hours. Use them.",        body: "You have full access to this memo and its resolution framework. The token expires in 72 hours.",                         cta: "Enter The Vault →" },
  ALREADY_GRANTED: { eyebrow: "Vault Access // Active",      headline: "You're already in.",         body: null,                                                                                                                      cta: "Enter The Vault →" },
  FAILED:          { eyebrow: "Vault Access // Not Confirmed",headline: "We didn't detect the share.",body: "The window closed before we could confirm. Try again — it takes less than 30 seconds.",                                  cta: "Try Again"      },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SocialTokenTrigger({
  memoId,
  memoTitle = "Principal Resolution // Intelligence Memo",
  memoUrl,
  platform = "linkedin",
  onTokenGranted,
  className = "",
}) {
  const [triggerState, setTriggerState]         = useState(TRIGGER_STATES.IDLE);
  const [token, setToken]                       = useState(null);
  const [timeRemaining, setTimeRemaining]       = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(platform);
  const focusHandlerRef  = useRef(null);
  const verifyTimeoutRef = useRef(null);
  const shareUrl = memoUrl || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    const existing = getStoredToken(memoId);
    if (existing) { setToken(existing); setTriggerState(TRIGGER_STATES.ALREADY_GRANTED); }
  }, [memoId]);

  useEffect(() => {
    if (!token?.expires_at) return;
    const tick = () => {
      const remaining = token.expires_at - Date.now();
      if (remaining <= 0) { setToken(null); setTriggerState(TRIGGER_STATES.IDLE); setTimeRemaining(null); clearVaultCookie(); return; }
      setTimeRemaining(`${Math.floor(remaining / 3600000)}h ${Math.floor((remaining % 3600000) / 60000)}m remaining`);
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [token]);

  useEffect(() => () => {
    if (focusHandlerRef.current) window.removeEventListener("focus", focusHandlerRef.current);
    if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);
  }, []);

  const grantAccess = useCallback(() => {
    const newToken = generateToken(memoId);
    storeToken(memoId, newToken);
    setToken(newToken);
    setTriggerState(TRIGGER_STATES.GRANTED);
    window.dispatchEvent(new CustomEvent("PR_TOKEN_ISSUED", {
      detail: { memo_id: memoId, expires_at: newToken.expires_at }, bubbles: true,
    }));
    if (onTokenGranted) onTokenGranted(newToken);
  }, [memoId, onTokenGranted]);

  const handleShare = useCallback(() => {
    if (triggerState === TRIGGER_STATES.GRANTED || triggerState === TRIGGER_STATES.ALREADY_GRANTED) return;
    window.open(PLATFORMS[selectedPlatform].buildUrl(shareUrl, memoTitle), "_blank", "width=600,height=500,noopener,noreferrer");
    setTriggerState(TRIGGER_STATES.WAITING);
    const onFocusReturn = () => {
      window.removeEventListener("focus", onFocusReturn);
      focusHandlerRef.current = null;
      setTriggerState(TRIGGER_STATES.VERIFYING);
      verifyTimeoutRef.current = setTimeout(grantAccess, 800);
    };
    focusHandlerRef.current = onFocusReturn;
    window.addEventListener("focus", onFocusReturn);
    verifyTimeoutRef.current = setTimeout(() => {
      window.removeEventListener("focus", onFocusReturn);
      focusHandlerRef.current = null;
      setTriggerState(TRIGGER_STATES.FAILED);
    }, 5 * 60 * 1000);
  }, [triggerState, selectedPlatform, shareUrl, memoTitle, grantAccess]);

  const handleReset = () => {
    setTriggerState(TRIGGER_STATES.IDLE);
    if (focusHandlerRef.current) { window.removeEventListener("focus", focusHandlerRef.current); focusHandlerRef.current = null; }
    if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);
  };

  const copy       = STATE_COPY[triggerState];
  const isGranted  = triggerState === TRIGGER_STATES.GRANTED || triggerState === TRIGGER_STATES.ALREADY_GRANTED;
  const isVerifying = triggerState === TRIGGER_STATES.VERIFYING;
  const isFailed   = triggerState === TRIGGER_STATES.FAILED;
  const isWaiting  = triggerState === TRIGGER_STATES.WAITING;

  return (
    <div className={`border font-mono transition-all duration-500 ${isGranted ? "border-brand-accent bg-brand-accent/5" : isFailed ? "border-red-600/40 bg-red-600/5" : "border-brand-border bg-brand-bg"} ${className}`}>
      <div className="p-6">

        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-4">
          <p className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${isGranted ? "text-brand-accent" : "text-brand-muted"}`}>
            {copy.eyebrow}
          </p>
          <div className="flex items-center gap-3">
            {isGranted && timeRemaining && <p className="text-[9px] tracking-widest uppercase text-brand-muted">{timeRemaining}</p>}
            {isGranted && <div className="flex gap-0.5">{[0,1,2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-accent" />)}</div>}
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-xl mb-3 text-brand-text" style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}>
          {copy.headline}
        </h3>

        {/* Body */}
        {copy.body && <p className="text-[11px] text-brand-muted leading-relaxed mb-5">{copy.body}</p>}

        {/* Verifying */}
        {isVerifying && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-1">{[0,1,2].map((i) => <div key={i} className="w-1 h-1 bg-brand-accent rounded-full animate-pulse" style={{ animationDelay: `${i*150}ms` }} />)}</div>
            <span className="text-[9px] tracking-widest uppercase text-brand-muted">Confirming intent</span>
          </div>
        )}

        {/* Platform selector */}
        {triggerState === TRIGGER_STATES.IDLE && (
          <div className="flex gap-2 mb-4">
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <button key={key} onClick={() => setSelectedPlatform(key)}
                className={`text-[9px] tracking-widest uppercase border px-2 py-1 transition-all duration-150 ${selectedPlatform === key ? "bg-brand-text text-brand-bg border-brand-text" : "border-brand-border text-brand-muted hover:border-brand-muted"}`}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        {copy.cta && !isVerifying && (
          <button
            onClick={isFailed ? handleReset : isGranted || isWaiting ? undefined : handleShare}
            disabled={isWaiting}
            className={`w-full py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              isGranted   ? "bg-brand-accent text-brand-bg hover:bg-brand-text cursor-pointer"
              : isWaiting ? "bg-brand-border text-brand-muted cursor-wait"
              : isFailed  ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-brand-bg"
              :             "border border-brand-text text-brand-text hover:bg-brand-text hover:text-brand-bg"
            }`}
          >
            {isWaiting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 border border-current rounded-full animate-spin" style={{ borderTopColor: "transparent" }} />
                Waiting for return
              </span>
            ) : copy.cta}
          </button>
        )}

        {/* Footer tag */}
        <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
          <span className="text-[8px] tracking-[0.2em] uppercase text-brand-muted">Memo // {memoId}</span>
          {isGranted && <span className="text-[8px] tracking-[0.2em] uppercase text-brand-accent">Token Active // Cookie</span>}
        </div>
      </div>
    </div>
  );
}