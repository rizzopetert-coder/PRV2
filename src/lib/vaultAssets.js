/**
 * src/lib/vaultAssets.js
 * Principal Resolution // Vault Asset Fetcher
 *
 * getAssetsByState(stateId) — primary export.
 * Returns the complete linked asset bundle for a given institutional state:
 *   - State metadata (label, description, severity, tier)
 *   - Hammer citation IDs
 *   - Intelligence memos (hydrated from vaultMemos.js)
 *   - Resolution playbook IDs (reserved, empty at v2.0.0)
 *
 * This is the backbone for:
 *   - Lexicon state pages (/vault/lexicon/[slug])
 *   - Diagnostic result deep-links
 *   - Future: search, cross-state navigation
 *
 * Source of truth hierarchy:
 *   diagnostic-logic.js > vault-manifest.json > vaultMemos.js
 *   On any conflict, the engine file wins.
 */

import manifest from "@/data/vault-manifest.json";
import { MEMOS, getMemoById } from "@/data/vaultMemos";

// ─── Internal lookup ──────────────────────────────────────────────────────────

/**
 * Build a Map of stateId → manifest state object for O(1) lookups.
 * Computed once at module load, not on every call.
 */
const STATE_MAP = new Map(
  manifest.institutional_states.map((s) => [s.state_id, s])
);

// ─── Types (JSDoc only — no TS required) ─────────────────────────────────────

/**
 * @typedef {Object} VaultMemo
 * @property {string} id
 * @property {string} title
 * @property {string} state_tag
 * @property {string} signal_tag
 * @property {string} impact_tag
 * @property {string} teaser
 * @property {string} slug
 * @property {string} published
 * @property {boolean} gated
 */

/**
 * @typedef {Object} StateAssets
 * @property {string}     state_id
 * @property {string}     slug
 * @property {string}     label
 * @property {string}     short_description
 * @property {number}     ui_severity_rating        — 1–5, display layer only
 * @property {string}     engine_severity           — HIGH / MID / LOW, engine layer
 * @property {string}     natural_tier              — Engine's default tier before Z adjustment
 * @property {string}     service_tier_recommendation
 * @property {string[]}   hammer_citation_ids       — All HC-xxx IDs linked to this state
 * @property {VaultMemo[]} memos                    — Hydrated memo objects
 * @property {string[]}   resolution_playbook_ids   — Reserved, empty at v2.0.0
 * @property {Object}     seo_meta
 * @property {boolean}    found                     — false if stateId not in manifest
 */

// ─── Primary export ───────────────────────────────────────────────────────────

/**
 * getAssetsByState(stateId)
 *
 * @param {string} stateId — Semantic state key e.g. "KID_GLOVES", "LAST_LEG"
 * @returns {StateAssets}
 *
 * @example
 * const assets = getAssetsByState("KID_GLOVES");
 * // assets.memos     → [{ id: "MEMO-01", title: "The Anatomy of Resentment", ... }, ...]
 * // assets.hammer_citation_ids → ["HC-001", "HC-002", ...]
 * // assets.label     → "Kid Gloves"
 * // assets.found     → true
 */
export function getAssetsByState(stateId) {
  const state = STATE_MAP.get(stateId);

  if (!state) {
    console.warn(`[vaultAssets] getAssetsByState: unknown stateId "${stateId}"`);
    return {
      state_id:                   stateId,
      slug:                       null,
      label:                      null,
      short_description:          null,
      ui_severity_rating:         null,
      engine_severity:            null,
      natural_tier:               null,
      service_tier_recommendation:null,
      hammer_citation_ids:        [],
      memos:                      [],
      resolution_playbook_ids:    [],
      seo_meta:                   null,
      found:                      false,
    };
  }

  // Hydrate memo IDs → full memo objects
  // Falls back gracefully if a memo ID is in the manifest but not yet in vaultMemos.js
  const memos = state.intelligence_memo_ids
    .map((id) => getMemoById(id))
    .filter(Boolean);

  return {
    state_id:                   state.state_id,
    slug:                       state.slug,
    label:                      state.label,
    short_description:          state.short_description,
    ui_severity_rating:         state.ui_severity_rating,
    engine_severity:            state.engine_severity,
    natural_tier:               state.natural_tier,
    service_tier_recommendation:state.service_tier_recommendation,
    hammer_citation_ids:        state.hammer_citation_ids,
    memos,
    resolution_playbook_ids:    state.resolution_playbook_ids,
    seo_meta:                   state.seo_meta,
    // Advisor Take — two-source model:
    // advisor_take_source='manifest' → use advisor_take string directly
    // advisor_take_source='MEMO-XX'  → join to memos.js by that ID in the consuming component
    advisor_take:               state.advisor_take ?? null,
    advisor_take_source:        state.advisor_take_source ?? null,
    found:                      true,
  };
}

// ─── Secondary exports ────────────────────────────────────────────────────────

/**
 * getAllStates()
 * Returns all 12 state asset bundles, sorted by ui_severity_rating descending
 * (highest severity first). Useful for Lexicon index pages.
 */
export function getAllStates() {
  return manifest.institutional_states
    .map((s) => getAssetsByState(s.state_id))
    .sort((a, b) => b.ui_severity_rating - a.ui_severity_rating);
}

/**
 * getStateBySlug(slug)
 * Looks up a state by its URL slug. Used by dynamic Lexicon routes.
 * Returns null if not found.
 *
 * @param {string} slug — e.g. "kid-gloves", "last-leg"
 * @returns {StateAssets | null}
 */
export function getStateBySlug(slug) {
  const state = manifest.institutional_states.find((s) => s.slug === slug);
  if (!state) return null;
  return getAssetsByState(state.state_id);
}

/**
 * getCitationCountByState()
 * Returns a Map of stateId → citation count.
 * Useful for dashboard displays and Lexicon sorting.
 *
 * @returns {Map<string, number>}
 */
export function getCitationCountByState() {
  return new Map(
    manifest.institutional_states.map((s) => [
      s.state_id,
      s.hammer_citation_ids.length,
    ])
  );
}