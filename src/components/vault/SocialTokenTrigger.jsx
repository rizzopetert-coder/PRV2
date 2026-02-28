"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Token Logic ──────────────────────────────────────────────────────────────

const TOKEN_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours

function generateToken(memoId) {
  const payload = {
    memo_id: memoId,
    issued_at: Date.now(),
    expires_at: Date.now() + TOKEN_DURATION_MS,
    token: Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  };
  return payload;
}

function getStoredToken(memoId) {
  try {
    const raw = sessionStorage.getItem(`vault_token_${memoId}`);
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (Date.now() > token.expires_at) {
      sessionStorage.removeItem(`vault_token_${memoId}`);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function storeToken(memoId, token) {
  try {
    sessionStorage.setItem(`vault_token_${memoId}`, JSON.stringify(token));
  } catch {
    // sessionStorage unavailable -- graceful degradation
  }
}

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORMS = {
  linkedin: {
    label: "LinkedIn",
    color: "#0A66C2",
    buildUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  twitter: {
    label: "X / Twitter",
    color: "#000000",
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

const TRIGGER_STATES = {
  IDLE: "IDLE",
  WAITING: "WAITING",
  VERIFYING: "VERIFYING",
  GRANTED: "GRANTED",
  ALREADY_GRANTED: "ALREADY_GRANTED",
  FAILED: "FAILED",
};

const STATE_COPY = {
  IDLE: {
    eyebrow: "Vault Access",
    headline: "Read the Resolution",
    body: "The diagnostic result tells you what. This memo tells you why -- and what to do about it. Share to unlock 72-hour access.",
    cta: "Share to Unlock",
  },
  WAITING: {
    eyebrow: "Vault Access // Pending",
    headline: "Complete the share.",
    body: "The share window is open. Finish the post, then return here. Access is granted on your return.",
    cta: "Verifying...",
  },
  VERIFYING: {
    eyebrow: "Vault Access // Verifying",
    headline: "Confirming intent.",
    body: null,
    cta: null,
  },
  GRANTED: {
    eyebrow: "Vault Access // Granted",
    headline: "72 hours. Use them.",
    body: "You have full access to this memo and its resolution framework. The token expires in 72 hours.",
    cta: "Enter The Vault →",
  },
  ALREADY_GRANTED: {
    eyebrow: "Vault Access // Active",
    headline: "You're already in.",
    body: null,
    cta: "Enter The Vault →",
  },
  FAILED: {
    eyebrow: "Vault Access // Not Confirmed",
    headline: "We didn't detect the share.",
    body: "The window closed before we could confirm. This can happen if the tab was dismissed too quickly. Try again -- it takes less than 30 seconds.",
    cta: "Try Again",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SocialTokenTrigger({
  memoId,
  memoTitle = "Principal Resolution // Intelligence Memo",
  memoUrl,
  platform = "linkedin",
  onTokenGranted,
  className = "",
}) {
  const [triggerState, setTriggerState] = useState(TRIGGER_STATES.IDLE);
  const [token, setToken] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(platform);

  const focusHandlerRef = useRef(null);
  const windowRef = useRef(null);
  const verifyTimeoutRef = useRef(null);

  const shareUrl = memoUrl || (typeof window !== "undefined" ? window.location.href : "");
  const platformConfig = PLATFORMS[selectedPlatform];

  // Check for existing token on mount
  useEffect(() => {
    const existing = getStoredToken(memoId);
    if (existing) {
      setToken(existing);
      setTriggerState(TRIGGER_STATES.ALREADY_GRANTED);
    }
  }, [memoId]);

  // Countdown for active token
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const remaining = token.expires_at - Date.now();
      if (remaining <= 0) {
        setToken(null);
        setTriggerState(TRIGGER_STATES.IDLE);
        setTimeRemaining(null);
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    }, 30000);
    // Set immediately
    const remaining = token.expires_at - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining(`${hours}h ${minutes}m remaining`);
    return () => clearInterval(interval);
  }, [token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (focusHandlerRef.current) {
        window.removeEventListener("focus", focusHandlerRef.current);
      }
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
    };
  }, []);

  const grantAccess = useCallback(() => {
    const newToken = generateToken(memoId);
    storeToken(memoId, newToken);
    setToken(newToken);
    setTriggerState(TRIGGER_STATES.GRANTED);
    if (onTokenGranted) onTokenGranted(newToken);
  }, [memoId, onTokenGranted]);

  const handleShare = useCallback(() => {
    if (
      triggerState === TRIGGER_STATES.GRANTED ||
      triggerState === TRIGGER_STATES.ALREADY_GRANTED
    )
      return;

    const shareWindow = window.open(
      platformConfig.buildUrl(shareUrl, memoTitle),
      "_blank",
      "width=600,height=500,noopener,noreferrer"
    );

    windowRef.current = shareWindow;
    setTriggerState(TRIGGER_STATES.WAITING);

    // Focus-return handler -- fires when user returns to this tab
    const onFocusReturn = () => {
      window.removeEventListener("focus", onFocusReturn);
      focusHandlerRef.current = null;

      setTriggerState(TRIGGER_STATES.VERIFYING);

      // Grace period: 800ms to simulate async verification
      verifyTimeoutRef.current = setTimeout(() => {
        // Intent verified -- window was opened, user returned
        // In production: POST to /api/vault/verify-intent with memo_id
        grantAccess();
      }, 800);
    };

    focusHandlerRef.current = onFocusReturn;
    window.addEventListener("focus", onFocusReturn);

    // Timeout: if no focus return within 5 minutes, mark failed
    verifyTimeoutRef.current = setTimeout(() => {
      window.removeEventListener("focus", onFocusReturn);
      focusHandlerRef.current = null;
      setTriggerState(TRIGGER_STATES.FAILED);
    }, 5 * 60 * 1000);
  }, [triggerState, platformConfig, shareUrl, memoTitle, grantAccess]);

  const handleReset = () => {
    setTriggerState(TRIGGER_STATES.IDLE);
    if (focusHandlerRef.current) {
      window.removeEventListener("focus", focusHandlerRef.current);
      focusHandlerRef.current = null;
    }
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current);
    }
  };

  const copy = STATE_COPY[triggerState];
  const isGranted =
    triggerState === TRIGGER_STATES.GRANTED ||
    triggerState === TRIGGER_STATES.ALREADY_GRANTED;
  const isVerifying = triggerState === TRIGGER_STATES.VERIFYING;
  const isFailed = triggerState === TRIGGER_STATES.FAILED;
  const isWaiting = triggerState === TRIGGER_STATES.WAITING;

  return (
    <div
      className={`border font-mono transition-all duration-500 ${
        isGranted
          ? "border-[#FF4500] bg-[#FF4500]/5"
          : isFailed
          ? "border-[#DC2626]/40 bg-[#DC2626]/5"
          : "border-[#D0CBC2] bg-[#FAF9F6]"
      } ${className}`}
    >
      <div className="p-6">
        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-4">
          <p
            className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
              isGranted ? "text-[#FF4500]" : "text-[#6B6560]"
            }`}
          >
            {copy.eyebrow}
          </p>
          {isGranted && timeRemaining && (
            <p className="text-[9px] tracking-widest uppercase text-[#6B6560]">{timeRemaining}</p>
          )}
          {isGranted && (
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FF4500]" />
              ))}
            </div>
          )}
        </div>

        {/* Headline */}
        <h3
          className="text-xl mb-3 text-[#1C1C1C] transition-all duration-300"
          style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
        >
          {copy.headline}
        </h3>

        {/* Body */}
        {copy.body && (
          <p className="text-[11px] text-[#6B6560] leading-relaxed mb-5">{copy.body}</p>
        )}

        {/* Verifying state */}
        {isVerifying && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-[#FF4500] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <span className="text-[9px] tracking-widest uppercase text-[#6B6560]">
              Confirming intent
            </span>
          </div>
        )}

        {/* Platform selector (only in IDLE state) */}
        {triggerState === TRIGGER_STATES.IDLE && (
          <div className="flex gap-2 mb-4">
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setSelectedPlatform(key)}
                className={`text-[9px] tracking-widest uppercase border px-2 py-1 transition-all duration-150 ${
                  selectedPlatform === key
                    ? "bg-[#1C1C1C] text-[#FAF9F6] border-[#1C1C1C]"
                    : "border-[#D0CBC2] text-[#6B6560] hover:border-[#6B6560]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Primary CTA */}
        {copy.cta && !isVerifying && (
          <button
            onClick={
              isFailed
                ? handleReset
                : isGranted
                ? undefined
                : isWaiting
                ? undefined
                : handleShare
            }
            disabled={isWaiting}
            className={`w-full py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              isGranted
                ? "bg-[#FF4500] text-[#FAF9F6] hover:bg-[#1C1C1C] cursor-pointer"
                : isWaiting
                ? "bg-[#D0CBC2] text-[#6B6560] cursor-wait"
                : isFailed
                ? "border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-[#FAF9F6]"
                : "border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FAF9F6]"
            }`}
          >
            {isWaiting ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-2 h-2 border border-current rounded-full animate-spin"
                  style={{ borderTopColor: "transparent" }}
                />
                Waiting for return
              </span>
            ) : (
              copy.cta
            )}
          </button>
        )}

        {/* Memo tag */}
        <div className="mt-4 pt-4 border-t border-[#D0CBC2] flex items-center justify-between">
          <span className="text-[8px] tracking-[0.2em] uppercase text-[#6B6560]">
            Memo // {memoId}
          </span>
          {isGranted && (
            <span className="text-[8px] tracking-[0.2em] uppercase text-[#FF4500]">
              Token Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}