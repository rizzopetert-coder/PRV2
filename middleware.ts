import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Phase I / Phase II Contract ─────────────────────────────────────────────
//
// PHASE I (current):
//   - Client auth lives in sessionStorage ('pr_vault_token')
//   - VaultNav.jsx reads sessionStorage and manages access state client-side
//   - This middleware is a stub — it does NOT run in Phase I because
//     sessionStorage is inaccessible server-side. The matcher fires but
//     /secure/vault routes are not publicly reachable yet.
//
// PHASE II (next):
//   - Auth token moves to an HttpOnly cookie ('pr_vault_token')
//   - Cookie is set by a POST /api/vault/token endpoint (server-side)
//   - This middleware intercepts /secure/vault/* at the Edge before rendering
//   - VaultNav continues to reflect access state via the cookie echo endpoint
//     or a lightweight /api/vault/session GET that returns { accessLevel, expiry }
//
// STORAGE CONTRACT:
//   sessionStorage  → Phase I client gating only (VaultNav.jsx)
//   HttpOnly cookie → Phase II server enforcement (this middleware)
//   The two are parallel during transition; once Phase II ships,
//   sessionStorage checks in VaultNav become UI-only optimistic state.
//
// UI HANDSHAKE:
//   On redirect, this middleware appends ?auth_trigger=true to the /vault URL.
//   The vault landing page (app/vault/page.jsx) must read this param on mount
//   and dispatch window.dispatchEvent(new CustomEvent('PR_TRIGGER_UNLOCK', {
//     detail: { mode: 'token', href: '/secure/vault' }
//   })) so the TokenModal intercepts it.
//   See: vault-page.jsx — look for auth_trigger handling.

// ─── Token Validation ─────────────────────────────────────────────────────────
//
// Phase I: stub — presence check only, no signature or expiry verification.
// Phase II: replace the body of validateToken() with real verification logic.
//   Options:
//     A. JWT: verify signature against VAULT_JWT_SECRET (env var), check exp claim
//     B. Opaque token: lookup in KV store (Vercel KV / Upstash) and check TTL
//     C. Signed cookie: use @edge-csrf or iron-session for tamper-proof cookies
//
// The function signature is stable — only the implementation changes in Phase II.

function validateToken(token: string): boolean {
  // PHASE I STUB: existence is sufficient for now.
  // A non-empty cookie value passes. No signature check, no expiry check.
  // TODO Phase II: implement real verification (see options above).
  if (!token || token.trim() === '') return false
  return true
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Protected route check
  const isProtectedRoute = pathname.startsWith('/secure/vault')
  if (!isProtectedRoute) return NextResponse.next()

  // 2. Token extraction
  const cookieToken = request.cookies.get('pr_vault_token')?.value ?? ''

  // 3. Validation
  const isAuthorized = validateToken(cookieToken)

  // 4. Gate
  if (!isAuthorized) {
    // Redirect to public vault hub with auth trigger param.
    // The vault landing page reads this param and dispatches PR_TRIGGER_UNLOCK
    // so the TokenModal intercepts without requiring a full page UI.
    const url = new URL('/vault', request.url)
    url.searchParams.set('auth_trigger', 'true')
    url.searchParams.set('attempted_path', pathname) // preserve intent for post-auth redirect
    return NextResponse.redirect(url)
  }

  // 5. Authorized — attach access level to request headers for use in layout/page
  // Phase II: decode token claims here and forward as headers if needed.
  const response = NextResponse.next()
  response.headers.set('x-vault-access', 'tokenized') // placeholder; replace with decoded claim
  return response
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
//
// Scoped to /secure/vault/* only. Public vault routes (/vault, /vault/lexicon,
// /vault/intelligence) are NOT intercepted — they handle their own client-side
// gating via VaultNav and the VERIFIED/TOKENIZED/GUEST access levels.

export const config = {
  matcher: ['/secure/vault/:path*'],
}