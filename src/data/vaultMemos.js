/**
 * src/data/vaultMemos.js
 * Principal Resolution // Intelligence Memo Registry
 *
 * Single source of truth for all Intelligence Memo metadata.
 * VaultPage, individual memo pages, and getAssetsByState() all import from here.
 * Never define memo data inline in a component.
 *
 * Field reference:
 *   id            — Canonical memo ID. Must match intelligence_memo_ids in vault-manifest.json.
 *                   Format: uppercase MEMO-XX. Note: memos.js uses lowercase memo-XX.
 *                   If memo reader joins on ID, verify [slug]/page.jsx join logic.
 *   state_tag     — Primary institutional state. Must match a STATES key in diagnostic-logic.js.
 *   signal_tag    — The behavioral signal this memo addresses.
 *   impact_tag    — The financial/organizational impact dimension.
 *   gated         — true = social token required. false = public.
 *   published     — ISO date string (YYYY-MM-DD).
 *   slug          — URL path segment under /vault/intelligence/
 *   relatedState  — Placeholder for future "related reading" cross-reference feature.
 *                   Not currently wired to any UI component. Do not suppress.
 *
 * Signal tag options: AVOIDANCE | CULTURAL_AVOIDANCE | DECISIONS | STALLED_DECISIONS | RESOLUTION_BLOCKAGE
 * Impact tag options: LEAK_RATIO | OPPORTUNITY_COST | PERSONNEL_RISK | RADIATED_IMPACT | EXECUTION_GAP
 *
 * UNLIT_ROOM severity constraint: max citation severity for UNLIT_ROOM memos is 2.
 * Do not assign severity-3+ citations to MEMO-06. Preserves diagnostic credibility of low-severity finding.
 *
 * ANCHOR: No memo assigned. Intentional — ANCHOR is the system's only health-positive state.
 * A memo for ANCHOR requires a fundamentally different editorial voice (writing to an org not in crisis).
 * Proposed title: "The Cost of Losing What Works." Tabled for future editorial session.
 */

export const MEMOS = [
  // ── ORIGINAL FIVE ────────────────────────────────────────────────────────

  {
    id: "MEMO-01",
    title: "The Anatomy of Resentment",
    state_tag: "KID_GLOVES",
    signal_tag: "AVOIDANCE",
    impact_tag: "LEAK_RATIO",
    teaser:
      "Resentment isn't a personality problem. It's an organizational output. This memo maps how conflict avoidance builds into institutional rot — and what the financial signature looks like before the exits start.",
    slug: "anatomy-of-resentment",
    published: "2026-02-01",
    gated: true,
    relatedState: "EXIT_PATTERN", // KID_GLOVES left unaddressed frequently precedes EXIT_PATTERN
  },
  {
    id: "MEMO-02",
    title: "Effectiveness Dies in Darkness",
    state_tag: "SILOSOLATION",
    signal_tag: "DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    teaser:
      "Silos don't form because people are selfish. They form because information routing breaks down and self-preservation fills the vacuum. This memo names the structural conditions and the cost of leaving them intact.",
    slug: "effectiveness-dies-in-darkness",
    published: "2026-02-08",
    gated: true,
    relatedState: null,
  },
  {
    id: "MEMO-03",
    title: "Nice is Not a Strategy",
    state_tag: "KID_GLOVES",
    signal_tag: "CULTURAL_AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    teaser:
      "Organizations that confuse warmth with effectiveness don't lose their people in blowups. They lose them quietly, over time, as the most capable people conclude that nothing will ever change.",
    slug: "nice-is-not-a-strategy",
    published: "2026-02-15",
    gated: true,
    relatedState: "EXIT_PATTERN",
  },
  {
    id: "MEMO-04",
    title: "The Cost of Flying Blind",
    state_tag: "BROKEN_COMPASS",
    signal_tag: "STALLED_DECISIONS",
    impact_tag: "RADIATED_IMPACT",
    teaser:
      "Stalled decisions don't stay contained. They radiate. Every week a direction isn't set, a team re-routes around the void — burning capacity, losing confidence, and making bets leadership didn't authorize.",
    slug: "cost-of-flying-blind",
    published: "2026-02-22",
    gated: true,
    relatedState: null,
  },
  {
    id: "MEMO-05",
    title: "The Vanity of Being Right",
    state_tag: "SACRED_COW",
    signal_tag: "RESOLUTION_BLOCKAGE",
    impact_tag: "EXECUTION_GAP",
    teaser:
      "The Sacred Cow persists not because leadership doesn't know. It persists because admitting the problem means admitting the decision that created it. This memo is about what that protection costs.",
    slug: "vanity-of-being-right",
    published: "2026-02-27",
    gated: true,
    relatedState: "EXIT_PATTERN", // SACRED_COW is often the mechanism behind EXIT_PATTERN departures
  },

  // ── EXPANDED REGISTRY (2026-03-01) ───────────────────────────────────────

  {
    id: "MEMO-06",
    title: "The Tax on What Is Not Said",
    state_tag: "UNLIT_ROOM",
    signal_tag: "AVOIDANCE",
    impact_tag: "LEAK_RATIO",
    teaser:
      "The silence in your organization is not peace. It is a calculation — and every person making it is doing the math on whether speaking up is worth what it costs.",
    slug: "tax-on-what-is-not-said",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
    // CONSTRAINT: Do not add severity-3+ citations to this memo. See MOB Section 14.2.
  },
  {
    id: "MEMO-07",
    title: "The Risk of Family Friction",
    state_tag: "FOSSIL_SYSTEM",
    signal_tag: "DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    teaser:
      "The legacy system is not always a process or an org chart. Sometimes it is a family — and the inherited dynamics, the protected loyalties, and the things that cannot be named are load-bearing walls that nobody mapped.",
    slug: "risk-of-family-friction",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
    // NOTE: This memo is more specific than the FOSSIL_SYSTEM state. It addresses one
    // expression of the state (family business friction), not its full definition.
    // A future second FOSSIL_SYSTEM memo should cover non-family legacy dynamics.
  },
  {
    id: "MEMO-08",
    title: "Crisis as a Catalyst for Clarity",
    state_tag: "LAST_LEG",
    signal_tag: "RESOLUTION_BLOCKAGE",
    impact_tag: "RADIATED_IMPACT",
    teaser:
      "The organizations that recover from structural crisis are not the ones that avoided it — they are the ones that stopped pretending the warning signs were not warning signs.",
    slug: "crisis-as-catalyst-for-clarity",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
  },
  {
    id: "MEMO-09",
    title: "The Velocity of Truth",
    state_tag: "DEAD_CALM",
    signal_tag: "STALLED_DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    teaser:
      "The most expensive decisions are not the ones that go wrong. They are the ones that never get made — held in suspension by a room full of capable people who have stopped trusting the room.",
    slug: "velocity-of-truth",
    published: "2026-03-01",
    gated: true,
    relatedState: "CRACKED_MIRROR", // DEAD_CALM sometimes originates in unresolved CRACKED_MIRROR
  },
  {
    id: "MEMO-10",
    title: "The Politeness Tax",
    state_tag: "RUNAWAY_TREADMILL",
    signal_tag: "CULTURAL_AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    teaser:
      "Speed and politeness are a dangerous combination. The organization that cannot slow down long enough to have the hard conversation has confused busyness with momentum — and is paying for both.",
    slug: "politeness-tax",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
  },
  {
    id: "MEMO-11",
    title: "The Intellectual Bottleneck",
    state_tag: "CRACKED_MIRROR",
    signal_tag: "DECISIONS",
    impact_tag: "EXECUTION_GAP",
    teaser:
      "The leader who cannot see themselves clearly is not a moral failure. They are a structural one — and everything downstream of that distortion is being filtered through a lens no one has named.",
    slug: "intellectual-bottleneck",
    published: "2026-03-01",
    gated: true,
    relatedState: "DEAD_CALM", // CRACKED_MIRROR → DEAD_CALM is a documented progression path
  },
  {
    id: "MEMO-12",
    title: "Institutional Memory and Drift",
    state_tag: "FOSSIL_SYSTEM",
    signal_tag: "DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    teaser:
      "Organizations don't fail all at once. They drift — quietly, gradually — until the mission becomes a memory and the process becomes the point.",
    slug: "institutional-memory-and-drift",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
  },
  {
    id: "MEMO-13",
    title: "The Exit Calculation",
    state_tag: "EXIT_PATTERN",
    signal_tag: "AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    teaser:
      "The people who left were not wrong. They were just the first to finish the math. The ones still here are running the same calculation — and they are watching to see what you do next.",
    slug: "exit-calculation",
    published: "2026-03-01",
    gated: true,
    relatedState: "SACRED_COW", // EXIT_PATTERN departures are frequently SACRED_COW in origin
  },
  {
    id: "MEMO-14",
    title: "The Anchor Problem",
    state_tag: "ANCHOR",
    signal_tag: "AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    teaser:
      "Coordination drag is not a people problem. It is a structural one. When the organization grows past the point where trust and familiarity carry communication, something has to replace them — and that something has a cost.",
    slug: "anchor-problem",
    published: "2026-03-01",
    gated: true,
    relatedState: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Signal tag display labels.
// Used by MemoCard and any component rendering signal taxonomy.
// ─────────────────────────────────────────────────────────────────────────────
export const SIGNAL_LABELS = {
  AVOIDANCE:           "Avoidance",
  CULTURAL_AVOIDANCE:  "Cultural Avoidance",
  DECISIONS:           "Slow Decisions",
  STALLED_DECISIONS:   "Stalled Decisions",
  RESOLUTION_BLOCKAGE: "Resolution Blockage",
};

// ─────────────────────────────────────────────────────────────────────────────
// Impact tag display labels.
// Used by MemoCard and any component rendering impact taxonomy.
// ─────────────────────────────────────────────────────────────────────────────
export const IMPACT_LABELS = {
  LEAK_RATIO:       "Leak Ratio",
  OPPORTUNITY_COST: "Opportunity Cost",
  PERSONNEL_RISK:   "Personnel Risk",
  RADIATED_IMPACT:  "Radiated Impact",
  EXECUTION_GAP:    "Execution Gap",
};

// ─────────────────────────────────────────────────────────────────────────────
// getMemoById(id)
// Returns a single memo object by ID, or null if not found.
// ─────────────────────────────────────────────────────────────────────────────
export function getMemoById(id) {
  return MEMOS.find((m) => m.id === id) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// getMemosByState(stateId)
// Returns all memos whose primary state_tag matches the given state ID.
// Sorted by published date ascending.
// ─────────────────────────────────────────────────────────────────────────────
export function getMemosByState(stateId) {
  return MEMOS
    .filter((m) => m.state_tag === stateId)
    .sort((a, b) => a.published.localeCompare(b.published));
}

// ─────────────────────────────────────────────────────────────────────────────
// getMemosByRelatedState(stateId)
// Returns all memos where relatedState matches the given state ID.
// Stub for future "related reading" cross-reference feature.
// Not yet wired to any UI component.
// ─────────────────────────────────────────────────────────────────────────────
export function getMemosByRelatedState(stateId) {
  return MEMOS
    .filter((m) => m.relatedState === stateId)
    .sort((a, b) => a.published.localeCompare(b.published));
}

// ─────────────────────────────────────────────────────────────────────────────
// getMemoBySlug(slug)
// Returns a single memo object by slug, or null if not found.
// Used by the memo reader page. Joins on slug, not ID — avoids
// the uppercase/lowercase ID mismatch between vaultMemos.js and memos.js.
// ─────────────────────────────────────────────────────────────────────────────
export function getMemoBySlug(slug) {
  return MEMOS.find((m) => m.slug === slug) ?? null;
}
