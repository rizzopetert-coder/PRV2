"use client";

import { useState, useMemo } from "react";

// ─── Seed Data (replace with vault-manifest.json import in production) ───────

const STATES = [
  {
    id: "LAST_LEG",
    label: "Last Leg",
    severity: 5,
    slug: "last-leg",
    short_description:
      "The organization is in active institutional failure. Leadership capacity is consumed by crisis, not direction.",
    signals: ["PERSONNEL_LOST", "ACTIVE_BLOCKAGE", "STALLED_DECISIONS"],
    impacts: ["EXECUTION_GAP", "RADIATED_IMPACT"],
  },
  {
    id: "SACRED_COW",
    label: "The Sacred Cow",
    severity: 5,
    slug: "sacred-cow",
    short_description:
      "A protected person or practice is producing measurable dysfunction. Everyone knows. No one moves.",
    signals: ["RESOLUTION_BLOCKAGE", "AVOIDANCE", "STALLED_DECISIONS"],
    impacts: ["EXECUTION_GAP", "LEAK_RATIO"],
  },
  {
    id: "CRACKED_MIRROR",
    label: "Cracked Mirror",
    severity: 4,
    slug: "cracked-mirror",
    short_description:
      "Leadership's self-image has diverged from organizational reality. The gap is producing strategic drift.",
    signals: ["CULTURAL_AVOIDANCE", "STALLED_DECISIONS", "DECISIONS"],
    impacts: ["OPPORTUNITY_COST", "RADIATED_IMPACT"],
  },
  {
    id: "EXIT_PATTERN",
    label: "The Exit Pattern",
    severity: 4,
    slug: "exit-pattern",
    short_description:
      "Voluntary attrition has developed a pattern. The exits are telling you something leadership hasn't said out loud.",
    signals: ["PERSONNEL_LOST", "PERSONNEL_RISK", "AVOIDANCE"],
    impacts: ["LEAK_RATIO", "PERSONNEL_RISK"],
  },
  {
    id: "DEAD_CALM",
    label: "Dead Calm",
    severity: 3,
    slug: "dead-calm",
    short_description:
      "Surface stability is masking arrested development. Nothing is breaking. Nothing is moving.",
    signals: ["CULTURAL_AVOIDANCE", "DECISIONS", "AVOIDANCE"],
    impacts: ["OPPORTUNITY_COST", "EXECUTION_GAP"],
  },
  {
    id: "SILOSOLATION",
    label: "Silosolation",
    severity: 3,
    slug: "silosolation",
    short_description:
      "Cross-functional friction has hardened into structural isolation. Teams are optimizing for their own survival.",
    signals: ["DECISIONS", "ACTIVE_BLOCKAGE"],
    impacts: ["OPPORTUNITY_COST", "RADIATED_IMPACT"],
  },
  {
    id: "RUNAWAY_TREADMILL",
    label: "Runaway Treadmill",
    severity: 3,
    slug: "runaway-treadmill",
    short_description:
      "High activity is producing low output. The organization is burning capacity without generating progress.",
    signals: ["STALLED_DECISIONS", "DECISIONS"],
    impacts: ["EXECUTION_GAP", "LEAK_RATIO"],
  },
  {
    id: "FOSSIL_SYSTEM",
    label: "The Fossil System",
    severity: 3,
    slug: "fossil-system",
    short_description:
      "Outdated structures and processes are constraining performance. The org has outgrown its own architecture.",
    signals: ["CULTURAL_AVOIDANCE", "RESOLUTION_BLOCKAGE"],
    impacts: ["EXECUTION_GAP", "OPPORTUNITY_COST"],
  },
  {
    id: "ANCHOR",
    label: "The Anchor",
    severity: 2,
    slug: "anchor",
    short_description:
      "A single individual or unit is constraining the velocity of the broader organization.",
    signals: ["RESOLUTION_BLOCKAGE", "PERSONNEL_RISK"],
    impacts: ["RADIATED_IMPACT", "EXECUTION_GAP"],
  },
  {
    id: "BROKEN_COMPASS",
    label: "Broken Compass",
    severity: 2,
    slug: "broken-compass",
    short_description:
      "Strategic direction is unclear or contested. Execution suffers because the destination keeps moving.",
    signals: ["STALLED_DECISIONS", "DECISIONS"],
    impacts: ["RADIATED_IMPACT", "OPPORTUNITY_COST"],
  },
  {
    id: "KID_GLOVES",
    label: "Kid Gloves",
    severity: 2,
    slug: "kid-gloves",
    short_description:
      "Conflict avoidance has become institutional policy. Necessary conversations aren't happening.",
    signals: ["AVOIDANCE", "CULTURAL_AVOIDANCE"],
    impacts: ["LEAK_RATIO", "PERSONNEL_RISK"],
  },
  {
    id: "UNLIT_ROOM",
    label: "The Unlit Room",
    severity: 1,
    slug: "unlit-room",
    short_description:
      "Friction exists but hasn't been located. The organization knows something is wrong -- not yet what.",
    signals: ["AVOIDANCE"],
    impacts: ["OPPORTUNITY_COST"],
  },
];

const SIGNAL_TAGS = [
  "AVOIDANCE",
  "CULTURAL_AVOIDANCE",
  "DECISIONS",
  "STALLED_DECISIONS",
  "RESOLUTION_BLOCKAGE",
  "ACTIVE_BLOCKAGE",
  "PERSONNEL_RISK",
  "PERSONNEL_LOST",
];

const IMPACT_TAGS = [
  "LEAK_RATIO",
  "OPPORTUNITY_COST",
  "EXECUTION_GAP",
  "RADIATED_IMPACT",
  "PERSONNEL_RISK",
];

const SIGNAL_LABELS = {
  AVOIDANCE: "Avoidance",
  CULTURAL_AVOIDANCE: "Cultural Avoidance",
  DECISIONS: "Slow Decisions",
  STALLED_DECISIONS: "Stalled Decisions",
  RESOLUTION_BLOCKAGE: "Resolution Blockage",
  ACTIVE_BLOCKAGE: "Active Blockage",
  PERSONNEL_RISK: "Personnel Risk",
  PERSONNEL_LOST: "Personnel Lost",
};

const IMPACT_LABELS = {
  LEAK_RATIO: "Leak Ratio",
  OPPORTUNITY_COST: "Opportunity Cost",
  EXECUTION_GAP: "Execution Gap",
  RADIATED_IMPACT: "Radiated Impact",
  PERSONNEL_RISK: "Personnel Risk",
};

const SEVERITY_LABELS = { 5: "Critical", 4: "High", 3: "Elevated", 2: "Moderate", 1: "Ambient" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ label, color, onClick, active }) {
  const colors = {
    orange: active
      ? "bg-[#FF4500] text-[#FAF9F6] border-[#FF4500]"
      : "border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500]/10",
    cyan: active
      ? "bg-[#0891B2] text-[#FAF9F6] border-[#0891B2]"
      : "border-[#0891B2] text-[#0891B2] hover:bg-[#0891B2]/10",
    red: active
      ? "bg-[#DC2626] text-[#FAF9F6] border-[#DC2626]"
      : "border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10",
  };

  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${colors[color]} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
    </button>
  );
}

function SeverityBar({ severity }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="h-1 w-4 transition-all duration-300"
          style={{
            backgroundColor:
              n <= severity
                ? severity >= 4
                  ? "#FF4500"
                  : severity === 3
                  ? "#B45309"
                  : "#6B6560"
                : "#D0CBC2",
          }}
        />
      ))}
    </div>
  );
}

function StateCard({ state, onSignalClick, onImpactClick }) {
  return (
    <div className="border border-[#D0CBC2] bg-[#FAF9F6] p-5 flex flex-col gap-4 hover:border-[#6B6560] transition-colors duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#6B6560] mb-1">
            {state.id} // Severity {state.severity} -- {SEVERITY_LABELS[state.severity]}
          </p>
          <h3
            className="text-xl leading-tight text-[#1C1C1C]"
            style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
          >
            {state.label}
          </h3>
        </div>
        <SeverityBar severity={state.severity} />
      </div>

      {/* Description */}
      <p className="text-sm text-[#1C1C1C] leading-relaxed font-mono">{state.short_description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#D0CBC2]">
        {state.signals.map((s) => (
          <Tag
            key={s}
            label={SIGNAL_LABELS[s] || s}
            color="cyan"
            onClick={() => onSignalClick(s)}
          />
        ))}
        {state.impacts.map((i) => (
          <Tag
            key={i}
            label={IMPACT_LABELS[i] || i}
            color="red"
            onClick={() => onImpactClick(i)}
          />
        ))}
      </div>

      {/* CTA */}
      <a
        href={`/vault/lexicon/${state.slug}`}
        className="font-mono text-[10px] tracking-widest uppercase text-[#FF4500] hover:text-[#1C1C1C] transition-colors duration-150 mt-auto"
      >
        Full State Record →
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LexiconGrid() {
  const [activeSignal, setActiveSignal] = useState(null);
  const [activeImpact, setActiveImpact] = useState(null);
  const [severityFilter, setSeverityFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = useMemo(() => {
    return STATES.filter((state) => {
      if (activeSignal && !state.signals.includes(activeSignal)) return false;
      if (activeImpact && !state.impacts.includes(activeImpact)) return false;
      if (severityFilter && state.severity !== severityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          state.label.toLowerCase().includes(q) ||
          state.short_description.toLowerCase().includes(q) ||
          state.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeSignal, activeImpact, severityFilter, searchQuery]);

  const handleSignalClick = (signal) =>
    setActiveSignal((prev) => (prev === signal ? null : signal));
  const handleImpactClick = (impact) =>
    setActiveImpact((prev) => (prev === impact ? null : impact));

  const clearAll = () => {
    setActiveSignal(null);
    setActiveImpact(null);
    setSeverityFilter(null);
    setSearchQuery("");
  };

  const hasActiveFilter = activeSignal || activeImpact || severityFilter || searchQuery;

  return (
    <section className="bg-[#FAF9F6] min-h-screen">
      {/* Filter Bar */}
      <div className="border-b border-[#D0CBC2] px-6 py-4 sticky top-0 bg-[#FAF9F6] z-10">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-mono text-xs bg-transparent border border-[#D0CBC2] px-3 py-1.5 text-[#1C1C1C] placeholder-[#6B6560] focus:outline-none focus:border-[#6B6560] w-64"
            />
            <span className="font-mono text-[10px] text-[#6B6560] tracking-widest uppercase">
              {filteredStates.length} of {STATES.length} States
            </span>
            {hasActiveFilter && (
              <button
                onClick={clearAll}
                className="font-mono text-[10px] tracking-widest uppercase text-[#FF4500] hover:text-[#1C1C1C] transition-colors"
              >
                Clear Filters ×
              </button>
            )}
          </div>

          {/* Signal filters (Cyan) */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560] mr-1">
              Signal:
            </span>
            {SIGNAL_TAGS.map((s) => (
              <Tag
                key={s}
                label={SIGNAL_LABELS[s]}
                color="cyan"
                active={activeSignal === s}
                onClick={() => handleSignalClick(s)}
              />
            ))}
          </div>

          {/* Impact filters (Red) */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560] mr-1">
              Impact:
            </span>
            {IMPACT_TAGS.map((i) => (
              <Tag
                key={i}
                label={IMPACT_LABELS[i]}
                color="red"
                active={activeImpact === i}
                onClick={() => handleImpactClick(i)}
              />
            ))}
          </div>

          {/* Severity filters */}
          <div className="flex gap-2 items-center">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560] mr-1">
              Severity:
            </span>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter((prev) => (prev === s ? null : s))}
                className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                  severityFilter === s
                    ? "bg-[#1C1C1C] text-[#FAF9F6] border-[#1C1C1C]"
                    : "border-[#D0CBC2] text-[#6B6560] hover:border-[#6B6560]"
                }`}
              >
                {SEVERITY_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredStates.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-mono text-sm text-[#6B6560]">No states match the active filters.</p>
            <button
              onClick={clearAll}
              className="font-mono text-[10px] tracking-widest uppercase text-[#FF4500] mt-4 hover:text-[#1C1C1C] transition-colors"
            >
              Clear All →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStates.map((state) => (
              <StateCard
                key={state.id}
                state={state}
                onSignalClick={handleSignalClick}
                onImpactClick={handleImpactClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}