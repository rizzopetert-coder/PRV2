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
 *   state_tag     — Primary institutional state. Must match a STATES key in diagnostic-logic.js.
 *   signal_tag    — The behavioral signal this memo addresses.
 *   impact_tag    — The financial/organizational impact dimension.
 *   gated         — true = social token required. false = public.
 *   published     — ISO date string (YYYY-MM-DD).
 *   slug          — URL path segment under /vault/intelligence/
 */

export const MEMOS = [
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
  },
];

/**
 * Signal tag display labels.
 * Used by MemoCard and any component rendering signal taxonomy.
 */
export const SIGNAL_LABELS = {
  AVOIDANCE:           "Avoidance",
  CULTURAL_AVOIDANCE:  "Cultural Avoidance",
  DECISIONS:           "Slow Decisions",
  STALLED_DECISIONS:   "Stalled Decisions",
  RESOLUTION_BLOCKAGE: "Resolution Blockage",
};

/**
 * Impact tag display labels.
 * Used by MemoCard and any component rendering impact taxonomy.
 */
export const IMPACT_LABELS = {
  LEAK_RATIO:       "Leak Ratio",
  OPPORTUNITY_COST: "Opportunity Cost",
  PERSONNEL_RISK:   "Personnel Risk",
  RADIATED_IMPACT:  "Radiated Impact",
  EXECUTION_GAP:    "Execution Gap",
};

/**
 * getMemoById(id)
 * Returns a single memo object by ID, or null if not found.
 */
export function getMemoById(id) {
  return MEMOS.find((m) => m.id === id) ?? null;
}

/**
 * getMemosByState(stateId)
 * Returns all memos whose primary state_tag matches the given state ID.
 * Sorted by published date ascending.
 */
export function getMemosByState(stateId) {
  return MEMOS
    .filter((m) => m.state_tag === stateId)
    .sort((a, b) => a.published.localeCompare(b.published));
}