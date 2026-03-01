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
// ─────────────────────────────────────────────────────────────────────────────
// vaultMemos.js — ADDITIONS // Session 2026-03-01
// Merge these entries into the existing vaultMemos.js strategicBriefings array.
// IDs follow the existing pattern: uppercase MEMO-XX.
// All fields match the v2.0 schema established in MEMO-01 through MEMO-05.
//
// CROSS-REFERENCE NOTE (A-05):
// The relatedState field is a placeholder for a future "related reading" feature.
// It is not currently wired to any UI component. Do not suppress it — it will be
// used when the intelligence index gains cross-reference capability.
// ─────────────────────────────────────────────────────────────────────────────

export const VAULT_MEMO_ADDITIONS = [

  // ── MEMO-06 ──────────────────────────────────────────────────────────────
  // State: UNLIT_ROOM
  // Signal: AVOIDANCE (individual calculation, not cultural climate)
  // Confirmed: Session 2026-03-01 — "Unlit room = tax on what is not said"
  {
    id: 'MEMO-06',
    slug: 'tax-on-what-is-not-said',
    title: 'The Tax on What Is Not Said',
    state_tag: 'UNLIT_ROOM',
    signal_tag: 'AVOIDANCE',
    impact_tag: 'RADIATED_IMPACT',
    teaser: 'The silence in your organization is not peace. It is a calculation — and every person making it is doing the math on whether speaking up is worth what it costs.',
    published: '2026-03-01',
    gated: true,
    relatedState: null, // no cross-reference for UNLIT_ROOM
    // Editorial notes:
    // - Severity ceiling: max citation severity for UNLIT_ROOM is 2. Do not add
    //   severity-3+ citations to this memo. See MOB constraint C-02.
    // - Source memos.js slug: 'tax-on-what-is-not-said' (verify against strategicBriefings)
    supporting_citations: ['HC-038', 'HC-039', 'HC-047', 'HC-051', 'HC-053', 'HC-054', 'HC-068', 'HC-069', 'HC-097', 'HC-098'],
  },

  // ── MEMO-07 ──────────────────────────────────────────────────────────────
  // State: LAST_LEG
  // Signal: RESOLUTION_BLOCKAGE
  // Impact: RADIATED_IMPACT
  {
    id: 'MEMO-07',
    slug: 'crisis-as-catalyst-for-clarity',
    title: 'Crisis as a Catalyst for Clarity',
    state_tag: 'LAST_LEG',
    signal_tag: 'RESOLUTION_BLOCKAGE',
    impact_tag: 'RADIATED_IMPACT',
    teaser: 'The organizations that recover from structural crisis are not the ones that avoided it — they are the ones that stopped pretending the warning signs were not warning signs.',
    published: '2026-03-01',
    gated: true,
    relatedState: null,
    supporting_citations: ['HC-003', 'HC-006', 'HC-010', 'HC-011', 'HC-049', 'HC-050', 'HC-052', 'HC-059', 'HC-060', 'HC-081', 'HC-082'],
  },

  // ── MEMO-08 ──────────────────────────────────────────────────────────────
  // State: SACRED_COW
  // Signal: RESOLUTION_BLOCKAGE
  // Impact: EXECUTION_GAP
  {
    id: 'MEMO-08',
    slug: 'the-vanity-of-being-right',
    title: 'The Vanity of Being Right',
    state_tag: 'SACRED_COW',
    signal_tag: 'RESOLUTION_BLOCKAGE',
    impact_tag: 'EXECUTION_GAP',
    teaser: 'An organization that cannot name its own problem has made a political decision dressed up as a management one. The cost of protecting what cannot be named accumulates with precision.',
    published: '2026-03-01',
    gated: true,
    relatedState: 'EXIT_PATTERN', // See MOB C-03: SACRED_COW is often the mechanism behind EXIT_PATTERN departures
    supporting_citations: ['HC-002', 'HC-007', 'HC-010', 'HC-020', 'HC-023', 'HC-053', 'HC-054', 'HC-065', 'HC-066', 'HC-070', 'HC-089', 'HC-093'],
  },

  // ── MEMO-09 ──────────────────────────────────────────────────────────────
  // State: CRACKED_MIRROR
  // Signal: DECISIONS
  // Impact: EXECUTION_GAP
  {
    id: 'MEMO-09',
    slug: 'the-intellectual-bottleneck',
    title: 'The Intellectual Bottleneck',
    state_tag: 'CRACKED_MIRROR',
    signal_tag: 'DECISIONS',
    impact_tag: 'EXECUTION_GAP',
    teaser: 'The leader who cannot see themselves clearly is not a moral failure. They are a structural one — and everything downstream of that distortion is being filtered through a lens no one has named.',
    published: '2026-03-01',
    gated: true,
    relatedState: 'DEAD_CALM', // See MOB C-01: CRACKED_MIRROR → DEAD_CALM is a documented progression path
    supporting_citations: ['HC-002', 'HC-004', 'HC-016', 'HC-030', 'HC-032', 'HC-061', 'HC-066', 'HC-073', 'HC-075', 'HC-079', 'HC-080', 'HC-093'],
  },

  // ── MEMO-10 ──────────────────────────────────────────────────────────────
  // State: EXIT_PATTERN
  // Signal: AVOIDANCE
  // Impact: PERSONNEL_RISK
  // Note: "Anatomy of Resentment" — confirmed session 2026-03-01
  // Note: Also serves KID_GLOVES as secondary state (see existing MEMO-01 assignment logic)
  {
    id: 'MEMO-10',
    slug: 'the-anatomy-of-resentment',
    title: 'The Anatomy of Resentment',
    state_tag: 'EXIT_PATTERN',
    signal_tag: 'AVOIDANCE',
    impact_tag: 'PERSONNEL_RISK',
    teaser: 'The people who left were not wrong. They were just the first to finish the math. The ones still here are running the same calculation — and they are watching to see what you do next.',
    published: '2026-03-01',
    gated: true,
    relatedState: 'SACRED_COW', // See MOB C-03: EXIT_PATTERN departures are frequently SACRED_COW in origin
    supporting_citations: ['HC-003', 'HC-006', 'HC-010', 'HC-017', 'HC-018', 'HC-029', 'HC-035', 'HC-060', 'HC-063', 'HC-064', 'HC-077', 'HC-095', 'HC-096'],
  },

  // ── MEMO-11 ──────────────────────────────────────────────────────────────
  // State: DEAD_CALM
  // Signal: STALLED_DECISIONS
  // Impact: OPPORTUNITY_COST
  {
    id: 'MEMO-11',
    slug: 'the-velocity-of-truth',
    title: 'The Velocity of Truth',
    state_tag: 'DEAD_CALM',
    signal_tag: 'STALLED_DECISIONS',
    impact_tag: 'OPPORTUNITY_COST',
    teaser: 'The most expensive decisions are not the ones that go wrong. They are the ones that never get made — held in suspension by a room full of capable people who have stopped trusting the room.',
    published: '2026-03-01',
    gated: true,
    relatedState: 'CRACKED_MIRROR', // See MOB C-01: DEAD_CALM sometimes originates in unresolved CRACKED_MIRROR
    supporting_citations: ['HC-001', 'HC-004', 'HC-007', 'HC-012', 'HC-019', 'HC-024', 'HC-025', 'HC-026', 'HC-028', 'HC-043', 'HC-056', 'HC-057', 'HC-058', 'HC-072', 'HC-075', 'HC-076', 'HC-083', 'HC-087'],
  },

  // ── MEMO-12 ──────────────────────────────────────────────────────────────
  // State: SILOSOLATION
  // Signal: DECISIONS
  // Impact: OPPORTUNITY_COST
  {
    id: 'MEMO-12',
    slug: 'effectiveness-dies-in-darkness',
    title: 'Effectiveness Dies in Darkness',
    state_tag: 'SILOSOLATION',
    signal_tag: 'DECISIONS',
    impact_tag: 'OPPORTUNITY_COST',
    teaser: 'Each unit is performing. The organization is not. When the incentives, the information, and the accountability all point inward, coordination becomes a favor — and favors run out.',
    published: '2026-03-01',
    gated: true,
    relatedState: null,
    supporting_citations: ['HC-005', 'HC-014', 'HC-015', 'HC-033', 'HC-034', 'HC-036', 'HC-041', 'HC-042', 'HC-043', 'HC-046', 'HC-071', 'HC-072', 'HC-083', 'HC-084', 'HC-085', 'HC-091'],
  },

  // ── MEMO-13 ──────────────────────────────────────────────────────────────
  // State: RUNAWAY_TREADMILL
  // Signal: CULTURAL_AVOIDANCE
  // Impact: PERSONNEL_RISK
  {
    id: 'MEMO-13',
    slug: 'the-politeness-tax',
    title: 'The Politeness Tax',
    state_tag: 'RUNAWAY_TREADMILL',
    signal_tag: 'CULTURAL_AVOIDANCE',
    impact_tag: 'PERSONNEL_RISK',
    teaser: 'Speed and politeness are a dangerous combination. The organization that cannot slow down long enough to have the hard conversation has confused busyness with momentum — and is paying for both.',
    published: '2026-03-01',
    gated: true,
    relatedState: null,
    supporting_citations: ['HC-011', 'HC-013', 'HC-014', 'HC-027', 'HC-029', 'HC-035', 'HC-046', 'HC-058', 'HC-059', 'HC-077', 'HC-085', 'HC-086'],
  },

  // ── MEMO-14 ──────────────────────────────────────────────────────────────
  // State: FOSSIL_SYSTEM
  // Signal: DECISIONS
  // Impact: OPPORTUNITY_COST
  // Note: Family friction framing — confirmed session 2026-03-01
  // Note: Memo is more specific than state. See MOB M-02. Future second FOSSIL_SYSTEM
  //       memo should cover non-family legacy dynamics.
  {
    id: 'MEMO-14',
    slug: 'the-risk-of-family-friction',
    title: 'The Risk of Family Friction',
    state_tag: 'FOSSIL_SYSTEM',
    signal_tag: 'DECISIONS',
    impact_tag: 'OPPORTUNITY_COST',
    teaser: 'The legacy system is not always a process or an org chart. Sometimes it is a family — and the inherited dynamics, the protected loyalties, and the things that cannot be named are load-bearing walls that nobody mapped.',
    published: '2026-03-01',
    gated: true,
    relatedState: null,
    supporting_citations: ['HC-005', 'HC-008', 'HC-012', 'HC-022', 'HC-025', 'HC-028', 'HC-031', 'HC-034', 'HC-040', 'HC-045', 'HC-065', 'HC-073', 'HC-074', 'HC-081', 'HC-089', 'HC-090', 'HC-092'],
  },

  // ── MEMO-15 ──────────────────────────────────────────────────────────────
  // State: BROKEN_COMPASS
  // Signal: STALLED_DECISIONS
  // Impact: RADIATED_IMPACT
  {
    id: 'MEMO-15',
    slug: 'the-cost-of-flying-blind',
    title: 'The Cost of Flying Blind',
    state_tag: 'BROKEN_COMPASS',
    signal_tag: 'STALLED_DECISIONS',
    impact_tag: 'RADIATED_IMPACT',
    teaser: 'The organization is moving. Nobody at the top is navigating toward the same destination — and that conversation has not happened yet. Every decision made in the meantime is made against an assumption that may no longer be shared.',
    published: '2026-03-01',
    gated: true,
    relatedState: null,
    supporting_citations: ['HC-005', 'HC-008', 'HC-009', 'HC-019', 'HC-033', 'HC-048', 'HC-056', 'HC-057', 'HC-058', 'HC-061', 'HC-071', 'HC-079', 'HC-086', 'HC-091', 'HC-092', 'HC-094'],
  },

  // ── MEMO-16 ──────────────────────────────────────────────────────────────
  // State: KID_GLOVES (primary) / EXIT_PATTERN (secondary, via shared mechanism)
  // Signal: AVOIDANCE
  // Impact: LEAK_RATIO
  {
    id: 'MEMO-16',
    slug: 'nice-is-not-a-strategy',
    title: 'Nice Is Not a Strategy',
    state_tag: 'KID_GLOVES',
    signal_tag: 'AVOIDANCE',
    impact_tag: 'LEAK_RATIO',
    teaser: 'The culture that avoids hard conversations in the name of relationships is not protecting relationships. It is protecting itself — and the people who most need honest feedback are the ones paying the price.',
    published: '2026-03-01',
    gated: true,
    relatedState: 'EXIT_PATTERN', // KID_GLOVES left unaddressed frequently precedes EXIT_PATTERN
    supporting_citations: ['HC-001', 'HC-002', 'HC-004', 'HC-007', 'HC-009', 'HC-024', 'HC-032', 'HC-047', 'HC-054', 'HC-063', 'HC-066', 'HC-068', 'HC-069', 'HC-075', 'HC-077', 'HC-078', 'HC-080', 'HC-098'],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// UNASSIGNED STATE: ANCHOR
// No memo assigned. Decision tabled — see MOB action item A-06.
// Proposed title: "The Cost of Losing What Works"
// Relevant citations: HC-021, HC-037, HC-040, HC-044, HC-045, HC-055, HC-062, HC-074, HC-099, HC-100
// Editorial note: ANCHOR requires a fundamentally different voice — writing to an org
// that is not in crisis. Table for next editorial planning session.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// MEMO COUNT SUMMARY (post-merge)
// MEMO-01: Anatomy of Resentment (existing — KID_GLOVES primary, now see MEMO-10 for EXIT_PATTERN)
// MEMO-02 through MEMO-05: [existing entries]
// MEMO-06: Tax on What Is Not Said — UNLIT_ROOM
// MEMO-07: Crisis as a Catalyst for Clarity — LAST_LEG
// MEMO-08: The Vanity of Being Right — SACRED_COW
// MEMO-09: The Intellectual Bottleneck — CRACKED_MIRROR
// MEMO-10: The Anatomy of Resentment — EXIT_PATTERN (replaces/supplements MEMO-01 assignment)
// MEMO-11: The Velocity of Truth — DEAD_CALM
// MEMO-12: Effectiveness Dies in Darkness — SILOSOLATION
// MEMO-13: The Politeness Tax — RUNAWAY_TREADMILL
// MEMO-14: The Risk of Family Friction — FOSSIL_SYSTEM
// MEMO-15: The Cost of Flying Blind — BROKEN_COMPASS
// MEMO-16: Nice Is Not a Strategy — KID_GLOVES
// ANCHOR: Unassigned — tabled
// ─────────────────────────────────────────────────────────────────────────────

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
