"use client";

import { useState, useMemo } from "react";

// ─── Seed Data (replace with import from hammer-citations.json) ───────────────

const CITATIONS = [
  {
    citation_id: "HC-001",
    title: "Only 21% of Employees Are Engaged at Work",
    source: "Gallup",
    publication: "State of the Global Workplace Report",
    year: 2023,
    url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx",
    source_type: "survey",
    state_ids: ["KID_GLOVES", "SILOSOLATION"],
    severity: 4,
    diagnostic_signal: "AVOIDANCE",
    impact_tag: "LEAK_RATIO",
    advisor_take:
      "This isn't a motivation problem. When 79% of your people are disengaged, you have a leadership architecture problem. No ping-pong table fixes that.",
    tags: ["engagement", "leadership", "culture"],
  },
  {
    citation_id: "HC-002",
    title: "Manager Effectiveness Accounts for 70% of Team Engagement Variance",
    source: "Gallup",
    publication: "State of the American Manager",
    year: 2022,
    url: "https://www.gallup.com/services/182138/state-american-manager.aspx",
    source_type: "survey",
    state_ids: ["SACRED_COW", "KID_GLOVES", "SILOSOLATION"],
    severity: 5,
    diagnostic_signal: "RESOLUTION_BLOCKAGE",
    impact_tag: "EXECUTION_GAP",
    advisor_take:
      "Seventy percent. Not culture. Not comp. Not purpose. The manager. If you haven't fixed who you're putting in charge of people, you haven't fixed anything.",
    tags: ["management", "engagement", "accountability"],
  },
  {
    citation_id: "HC-003",
    title: "Voluntary Turnover Costs Employers 33% of a Worker's Annual Salary",
    source: "Work Institute",
    publication: "2023 Retention Report",
    year: 2023,
    url: "https://workinstitute.com/retention-report/",
    source_type: "industry-report",
    state_ids: ["EXIT_PATTERN", "LAST_LEG"],
    severity: 4,
    diagnostic_signal: "PERSONNEL_LOST",
    impact_tag: "LEAK_RATIO",
    advisor_take:
      "Turnover isn't a feelings problem. It's a balance sheet problem. At 33% of annual salary per exit, you're funding your own dysfunction.",
    tags: ["turnover", "retention", "cost"],
  },
  {
    citation_id: "HC-004",
    title: "58% of Employees Would Trust a Stranger More Than Their Boss",
    source: "Harvard Business Review",
    publication: "The Neuroscience of Trust",
    year: 2017,
    url: "https://hbr.org/2017/01/the-neuroscience-of-trust",
    source_type: "academic",
    state_ids: ["CRACKED_MIRROR", "FOSSIL_SYSTEM"],
    severity: 5,
    diagnostic_signal: "CULTURAL_AVOIDANCE",
    impact_tag: "RADIATED_IMPACT",
    advisor_take:
      "When your people trust strangers more than they trust you, the problem isn't communication style. It's a credibility gap that no town hall is going to close.",
    tags: ["trust", "leadership", "credibility"],
  },
  {
    citation_id: "HC-005",
    title: "Organizations With Clear Accountability Structures Are 2.5x More Likely to Outperform",
    source: "McKinsey",
    publication: "Organizational Health Index",
    year: 2022,
    url: "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights",
    source_type: "industry-report",
    state_ids: ["BROKEN_COMPASS", "ANCHOR"],
    severity: 4,
    diagnostic_signal: "STALLED_DECISIONS",
    impact_tag: "EXECUTION_GAP",
    advisor_take:
      "Accountability isn't a culture value. It's a structure. You can't will your way to 2.5x performance. You have to build it.",
    tags: ["accountability", "performance", "structure"],
  },
  {
    citation_id: "HC-006",
    title: "Companies Lose $1 Trillion Annually to Voluntary Turnover",
    source: "Gallup",
    publication: "State of the American Workplace",
    year: 2019,
    url: "https://www.gallup.com/workplace/247391/fixable-problem-costs-businesses-trillion.aspx",
    source_type: "survey",
    state_ids: ["EXIT_PATTERN", "LAST_LEG"],
    severity: 5,
    diagnostic_signal: "PERSONNEL_LOST",
    impact_tag: "LEAK_RATIO",
    advisor_take:
      "Twelve zeros. That's the price tag on avoidable exits. And Gallup calls it 'fixable.' That's the part that should keep you up at night.",
    tags: ["turnover", "cost", "retention"],
  },
  {
    citation_id: "HC-007",
    title: "Psychological Safety Is the #1 Predictor of Team Performance",
    source: "Google",
    publication: "Project Aristotle",
    year: 2016,
    url: "https://rework.withgoogle.com/guides/understanding-team-effectiveness/steps/introduction/",
    source_type: "longitudinal-study",
    state_ids: ["KID_GLOVES", "DEAD_CALM", "FOSSIL_SYSTEM"],
    severity: 5,
    diagnostic_signal: "CULTURAL_AVOIDANCE",
    impact_tag: "OPPORTUNITY_COST",
    advisor_take:
      "Google ran the numbers across 180 teams. The answer wasn't who was on the team. It was whether people felt safe enough to speak. If they don't, you're flying blind.",
    tags: ["psychological-safety", "team-performance", "culture"],
  },
  {
    citation_id: "HC-008",
    title: "Only 40% of Workers Know What Their Company Stands For",
    source: "Gallup",
    publication: "State of the Workplace",
    year: 2022,
    url: "https://www.gallup.com/workplace/236366/right-culture-not-employee-satisfaction.aspx",
    source_type: "survey",
    state_ids: ["BROKEN_COMPASS", "CRACKED_MIRROR"],
    severity: 3,
    diagnostic_signal: "DECISIONS",
    impact_tag: "OPPORTUNITY_COST",
    advisor_take:
      "You can't execute a strategy that most of your people can't describe. This isn't a branding problem. It's a leadership communication failure with a measurable cost.",
    tags: ["mission", "clarity", "communication"],
  },
  {
    citation_id: "HC-009",
    title: "Employees Who Receive Regular Feedback Are 3x More Engaged",
    source: "Gallup",
    publication: "Re-Engineering Performance Management",
    year: 2021,
    url: "https://www.gallup.com/workplace/182796/why-great-managers-rare.aspx",
    source_type: "survey",
    state_ids: ["SACRED_COW", "SILOSOLATION"],
    severity: 3,
    diagnostic_signal: "AVOIDANCE",
    impact_tag: "EXECUTION_GAP",
    advisor_take:
      "Feedback isn't a nicety. It's a performance mechanism. Three times more engaged means three times more output per salary dollar. The silence is costing you.",
    tags: ["feedback", "engagement", "management"],
  },
  {
    citation_id: "HC-010",
    title: "Toxic Culture Is 10.4x More Predictive of Attrition Than Compensation",
    source: "MIT Sloan Management Review",
    publication: "Toxic Culture Is Driving the Great Resignation",
    year: 2022,
    url: "https://sloanreview.mit.edu/article/toxic-culture-is-driving-the-great-resignation/",
    source_type: "academic",
    state_ids: ["CRACKED_MIRROR", "EXIT_PATTERN", "LAST_LEG"],
    severity: 5,
    diagnostic_signal: "CULTURAL_AVOIDANCE",
    impact_tag: "PERSONNEL_RISK",
    advisor_take:
      "10.4 times. Not comp. Not benefits. Not remote work policy. Culture. When people leave, they're not chasing money. They're escaping something you built.",
    tags: ["culture", "attrition", "toxicity"],
  },
  {
    citation_id: "HC-011",
    title: "Burned-Out Employees Are 2.6x More Likely to Leave",
    source: "Gallup",
    publication: "Employee Burnout: Causes and Cures",
    year: 2020,
    url: "https://www.gallup.com/workplace/282659/employee-burnout-perspective-paper.aspx",
    source_type: "survey",
    state_ids: ["RUNAWAY_TREADMILL", "LAST_LEG"],
    severity: 4,
    diagnostic_signal: "PERSONNEL_RISK",
    impact_tag: "LEAK_RATIO",
    advisor_take:
      "Burnout isn't an individual problem. It's an organizational output. If people are running on empty, you built the system that drained them.",
    tags: ["burnout", "attrition", "workload"],
  },
  {
    citation_id: "HC-012",
    title: "High-Trust Organizations Outperform Low-Trust Peers by 286% in Total Return",
    source: "Harvard Business Review",
    publication: "The Business Case for Purpose",
    year: 2020,
    url: "https://hbr.org/2020/05/the-trust-crisis",
    source_type: "academic",
    state_ids: ["CRACKED_MIRROR", "DEAD_CALM"],
    severity: 5,
    diagnostic_signal: "RESOLUTION_BLOCKAGE",
    impact_tag: "RADIATED_IMPACT",
    advisor_take:
      "286%. That's not a soft number. That's compounding. The cost of low trust doesn't show up as a line item. It shows up as everything you left on the table.",
    tags: ["trust", "performance", "returns"],
  },
];

const SOURCE_TYPE_LABELS = {
  survey: "Survey",
  "industry-report": "Industry Report",
  academic: "Academic",
  "longitudinal-study": "Longitudinal Study",
  government: "Government",
};

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityDots({ severity }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="w-1.5 h-1.5 rounded-full"
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

function CitationRow({ citation, expanded, onToggle }) {
  return (
    <div className="border-b border-[#D0CBC2] last:border-b-0">
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-4 hover:bg-[#1C1C1C]/[0.02] transition-colors duration-150 group"
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* ID */}
          <div className="col-span-1">
            <span className="font-mono text-[9px] tracking-widest text-[#6B6560]">
              {citation.citation_id}
            </span>
          </div>

          {/* Title */}
          <div className="col-span-5">
            <p className="font-mono text-xs text-[#1C1C1C] leading-snug group-hover:text-[#FF4500] transition-colors">
              {citation.title}
            </p>
          </div>

          {/* Source */}
          <div className="col-span-2">
            <span className="font-mono text-[10px] text-[#6B6560]">
              {citation.source} // {citation.year}
            </span>
          </div>

          {/* Signal tag */}
          <div className="col-span-2">
            <span className="font-mono text-[9px] tracking-widest uppercase border border-[#0891B2] text-[#0891B2] px-1.5 py-0.5">
              {SIGNAL_LABELS[citation.diagnostic_signal] || citation.diagnostic_signal}
            </span>
          </div>

          {/* Severity + expand indicator */}
          <div className="col-span-2 flex items-center justify-between">
            <SeverityDots severity={citation.severity} />
            <span
              className={`font-mono text-[10px] text-[#6B6560] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </div>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-6 pb-6 grid grid-cols-2 gap-6 bg-[#1C1C1C]/[0.02] border-t border-[#D0CBC2]">
          {/* The What */}
          <div className="pt-4">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#6B6560] mb-2">
              The Source // What
            </p>
            <p className="font-mono text-[11px] text-[#1C1C1C] leading-relaxed mb-3">
              {citation.title}
            </p>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-[#6B6560]">
                {citation.source} — {citation.publication}, {citation.year}
              </p>
              <p className="font-mono text-[10px] text-[#6B6560] uppercase tracking-wider">
                {SOURCE_TYPE_LABELS[citation.source_type]}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="font-mono text-[9px] tracking-widest uppercase border border-[#0891B2] text-[#0891B2] px-1.5 py-0.5">
                {SIGNAL_LABELS[citation.diagnostic_signal] || citation.diagnostic_signal}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase border border-[#DC2626] text-[#DC2626] px-1.5 py-0.5">
                {IMPACT_LABELS[citation.impact_tag] || citation.impact_tag}
              </span>
            </div>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] tracking-widest uppercase text-[#FF4500] hover:text-[#1C1C1C] transition-colors mt-3 inline-block"
            >
              Primary Source →
            </a>
          </div>

          {/* The Advisor Take */}
          <div className="pt-4 border-l border-[#D0CBC2] pl-6">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FF4500] mb-2">
              Advisor // So What
            </p>
            <blockquote
              className="text-base leading-relaxed text-[#1C1C1C]"
              style={{
                fontFamily: "'Sorts Mill Goudy', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {citation.advisor_take}
            </blockquote>
            <div className="mt-3 flex flex-wrap gap-1">
              {citation.state_ids.map((id) => (
                <span
                  key={id}
                  className="font-mono text-[9px] tracking-widest uppercase border border-[#FF4500] text-[#FF4500] px-1.5 py-0.5"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HammerIndex() {
  const [expandedId, setExpandedId] = useState(null);
  const [activeSignal, setActiveSignal] = useState(null);
  const [activeImpact, setActiveImpact] = useState(null);
  const [sortField, setSortField] = useState("citation_id");

  const filtered = useMemo(() => {
    return CITATIONS.filter((c) => {
      if (activeSignal && c.diagnostic_signal !== activeSignal) return false;
      if (activeImpact && c.impact_tag !== activeImpact) return false;
      return true;
    }).sort((a, b) => {
      if (sortField === "severity") return b.severity - a.severity;
      if (sortField === "year") return b.year - a.year;
      return a.citation_id.localeCompare(b.citation_id);
    });
  }, [activeSignal, activeImpact, sortField]);

  const uniqueSignals = [...new Set(CITATIONS.map((c) => c.diagnostic_signal))];
  const uniqueImpacts = [...new Set(CITATIONS.map((c) => c.impact_tag))];

  return (
    <section className="bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#D0CBC2] px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#6B6560] mb-1">
                Principal Resolution // Forensic Proof Layer
              </p>
              <h2
                className="text-2xl text-[#1C1C1C]"
                style={{ fontFamily: "'Sorts Mill Goudy', Georgia, serif", fontStyle: "italic" }}
              >
                The Hammer Index
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560]">
                {filtered.length} Citations // Active
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1.5 items-center">
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560]">
                Signal:
              </span>
              {uniqueSignals.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSignal((prev) => (prev === s ? null : s))}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    activeSignal === s
                      ? "bg-[#0891B2] text-[#FAF9F6] border-[#0891B2]"
                      : "border-[#0891B2] text-[#0891B2] hover:bg-[#0891B2]/10"
                  }`}
                >
                  {SIGNAL_LABELS[s] || s}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 items-center">
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560]">
                Impact:
              </span>
              {uniqueImpacts.map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveImpact((prev) => (prev === i ? null : i))}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    activeImpact === i
                      ? "bg-[#DC2626] text-[#FAF9F6] border-[#DC2626]"
                      : "border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10"
                  }`}
                >
                  {IMPACT_LABELS[i] || i}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex gap-1.5 items-center">
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#6B6560]">
                Sort:
              </span>
              {[
                { key: "citation_id", label: "Index" },
                { key: "severity", label: "Severity" },
                { key: "year", label: "Year" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortField(key)}
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 transition-all duration-150 ${
                    sortField === key
                      ? "bg-[#1C1C1C] text-[#FAF9F6] border-[#1C1C1C]"
                      : "border-[#D0CBC2] text-[#6B6560] hover:border-[#6B6560]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="border-b border-[#D0CBC2] px-6 py-2 bg-[#1C1C1C]/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1">
              <span className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">ID</span>
            </div>
            <div className="col-span-5">
              <span className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">Finding</span>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">Source</span>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">Signal</span>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[8px] tracking-widest uppercase text-[#6B6560]">Weight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Citation rows */}
      <div className="max-w-7xl mx-auto px-6">
        {filtered.map((citation) => (
          <CitationRow
            key={citation.citation_id}
            citation={citation}
            expanded={expandedId === citation.citation_id}
            onToggle={() =>
              setExpandedId((prev) =>
                prev === citation.citation_id ? null : citation.citation_id
              )
            }
          />
        ))}
      </div>
    </section>
  );
}