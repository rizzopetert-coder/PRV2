"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * src/app/vault/verify/page.jsx
 * Principal Resolution // Vault Access Verification
 *
 * Accepts a client access key, validates against PR_CLIENT_KEY env var,
 * sets the pr_vault_token cookie (matching middleware.ts Phase I contract),
 * and redirects to /secure/vault.
 *
 * Auth contract (middleware.ts Phase I):
 *   - Cookie name: pr_vault_token
 *   - Validation: existence check only (non-empty value passes)
 *   - Cookie is NOT HttpOnly here — Phase II migrates to server-side POST
 *     at /api/vault/token which sets HttpOnly via Set-Cookie header
 *
 * Environment variable required:
 *   NEXT_PUBLIC_PR_CLIENT_KEY — the valid access key
 *   Note: NEXT_PUBLIC_ prefix makes it available client-side.
 *   Phase II: move validation to /api/vault/token (server-side) so the
 *   key is read from PR_CLIENT_KEY (no NEXT_PUBLIC_ prefix) and never
 *   exposed to the browser.
 */

const VALID_KEY = process.env.NEXT_PUBLIC_PR_CLIENT_KEY ?? "";

function setVaultCookie(token) {
  // 72-hour expiry — matches the access window described in Vault UI copy
  const expires = new Date(Date.now() + 72 * 60 * 60 * 1000).toUTCString();
  document.cookie = `pr_vault_token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Strict`;
}

export default function VaultVerifyPage() {
  const router = useRouter();
  const [key, setKey]         = useState("");
  const [status, setStatus]   = useState("idle"); // idle | checking | success | error
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "checking" || status === "success") return;

    setStatus("checking");

    // Simulate a brief validation delay — gives the UI a moment to breathe
    // and prevents instant brute-force feel
    setTimeout(() => {
      const trimmed = key.trim();

      if (!trimmed) {
        setStatus("error");
        setAttempts((n) => n + 1);
        return;
      }

      // Phase I: compare against env var
      // Phase II: POST to /api/vault/token, receive HttpOnly cookie
      if (VALID_KEY && trimmed !== VALID_KEY) {
        setStatus("error");
        setAttempts((n) => n + 1);
        return;
      }

      // Valid — set cookie and redirect
      setVaultCookie(trimmed);
      setStatus("success");

      setTimeout(() => {
        router.push("/secure/vault");
      }, 1000);
    }, 600);
  };

  return (
    <main className="bg-brand-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-brand-muted mb-4">
            Principal Resolution // Vault Access
          </p>
          <h1
            className="text-3xl text-brand-text leading-tight"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            Verify Access
          </h1>
          <div className="w-12 h-px bg-brand-border mt-4" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-0">

          {/* Input */}
          <div className="border border-brand-border focus-within:border-brand-accent transition-colors duration-200">
            <label
              htmlFor="access-key"
              className="font-mono text-[8px] tracking-[0.4em] uppercase text-brand-muted px-4 pt-3 block"
            >
              Access Key
            </label>
            <input
              id="access-key"
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your client key"
              autoComplete="off"
              autoFocus
              disabled={status === "success"}
              className="w-full bg-transparent px-4 pb-3 pt-1 font-mono text-sm text-brand-text placeholder:text-brand-muted/40 outline-none disabled:opacity-50"
            />
          </div>

          {/* Error message */}
          {status === "error" && (
            <div className="border border-brand-accent/50 bg-brand-accent/5 px-4 py-3">
              <p className="font-mono text-[10px] text-brand-accent">
                {attempts >= 3
                  ? "Access denied. Contact Principal Resolution directly."
                  : "Key not recognized. Verify and try again."}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "checking" || status === "success" || !key.trim()}
            className={`w-full font-mono text-[10px] tracking-[0.4em] uppercase py-4 border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              status === "success"
                ? "border-brand-accent text-brand-accent"
                : "border-brand-text text-brand-text hover:bg-brand-text hover:text-brand-bg"
            }`}
          >
            {status === "checking" && "Verifying..."}
            {status === "success"  && "Access Granted — Redirecting"}
            {status === "idle"     && "Verify Access →"}
            {status === "error"    && "Verify Access →"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <p className="font-mono text-[9px] text-brand-muted/60 leading-relaxed">
            Access keys are issued directly to verified clients. If you don't have a key,{" "}
            <a
              href="/contact"
              className="text-brand-muted hover:text-brand-accent transition-colors"
            >
              contact us
            </a>
            .
          </p>
          <a
            href="/vault"
            className="font-mono text-[9px] tracking-widest uppercase text-brand-muted/60 hover:text-brand-accent transition-colors mt-4 inline-block"
          >
            ← Return to Vault
          </a>
        </div>

      </div>
    </main>
  );
}