"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, RotateCcw } from 'lucide-react';
import {
  STATES,
  TIERS,
  TIER_META,
  METRIC_LEGEND,
} from '../../lib/diagnostic-logic';
import SignalMatrix from './SignalMatrix';

/**
 * ResultsLedger // Principal Resolution v6.0
 * Triple-File Sync: strings must remain identical to DiagnosticPDF.jsx
 * Engine: runDiagnostic() from diagnostic-logic.js
 * Retired: hammerCitation / Forensic Proof block (relocated to Vault)
 * Retired: v5.0 buildSynthesis interpolation model
 * New: Path to Verdict section
 * New: Glossary section (web: static block at bottom of record)
 */

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(val);

// ─── GLOSSARY DATA ────────────────────────────────────────────────────────────
// Single source of truth for state definitions displayed in the glossary.
// Kept here (not in diagnostic-logic.js) because it is display content,
// not engine logic. Must be audited when state labels change.

export const STATE_GLOSSARY = [
  {
    id:         'LAST_LEG',
    label:      'Last Leg',
    definition: 'The cost of the current situation has already passed the point where incremental recovery is possible. Time is the primary variable and it is working against the organization.',
  },
  {
    id:         'SACRED_COW',
    label:      'The Sacred Cow',
    definition: 'One individual holds disproportionate leverage, and that leverage is being used -- consciously or not -- to make their behavior immune to consequence. The organization knows what the problem is and has decided it cannot afford to address it.',
  },
  {
    id:         'CRACKED_MIRROR',
    label:      'Cracked Mirror',
    definition: 'The person with the authority to resolve the dysfunction is the source of it. The loop runs through one person and cannot be closed from inside it.',
  },
  {
    id:         'DEAD_CALM',
    label:      'Dead Calm',
    definition: 'The leadership team is collectively stuck. No single person is the source but no single person has the standing or the will to move first. Decisions require consensus that nobody is willing to build.',
  },
  {
    id:         'SILOSOLATION',
    label:      'Silosolation',
    definition: 'The organization has fractured into self-contained units that have stopped sharing information, resources, or accountability. Each unit is locally functional. The whole is not.',
  },
  {
    id:         'EXIT_PATTERN',
    label:      'The Exit Pattern',
    definition: 'The environment has become something that people with options have decided is no longer worth tolerating. The organization is now selecting for a specific kind of person -- and it is not the kind it needs.',
  },
  {
    id:         'RUNAWAY_TREADMILL',
    label:      'Runaway Treadmill',
    definition: 'The organization has mistaken motion for progress. Urgency has become a cultural identity. The pace prevents the reflection required to notice that speed and direction are not the same thing.',
  },
  {
    id:         'FOSSIL_SYSTEM',
    label:      'The Fossil System',
    definition: 'The structure, processes, and decision patterns were built for a version of the organization that no longer exists. Nobody designed it this way. The system now resists the changes it needs most.',
  },
  {
    id:         'ANCHOR',
    label:      'The Anchor',
    definition: 'Forward momentum exists and genuine will is present, but the tools, people, or infrastructure in place are creating drag that consumes more energy than the work itself requires.',
  },
  {
    id:         'BROKEN_COMPASS',
    label:      'Broken Compass',
    definition: 'The organization is moving but the people at the top are no longer navigating toward the same destination. The divergence has not been named, confronted, or resolved.',
  },
  {
    id:         'KID_GLOVES',
    label:      'Kid Gloves',
    definition: 'The relationships in the organization are good. That care has become a structural liability. The most important conversations are not happening because the relationships feel too valuable to risk.',
  },
  {
    id:         'UNLIT_ROOM',
    label:      'The Unlit Room',
    definition: 'The organization is early enough or healthy enough that the friction is real but not yet compounding. The leader has the will and the agency to act. What is missing is clarity on where to start.',
  },
];

// ─── STRING TABLES ────────────────────────────────────────────────────────────
// Each state has: synthesis (base), synthesisMod (toneKey overrides),
// inference (base), inferenceMod (toneKey overrides), pathToVerdict.
// Triple-File Sync: these strings must be identical in DiagnosticPDF.jsx.

const STRINGS = {

  LAST_LEG: {
    synthesis: "The math has already turned. This is not a warning about where things are heading -- it is a finding about where they already are. The cost of the current situation has passed the point where careful, incremental action can recover it. That is not a reason to panic. It is a reason to move now, with someone who knows how to move fast in this kind of environment without making it worse.",
    synthesisMod: {
      EXHAUSTION:  "You already know this. The numbers just confirmed what the room has been feeling for a while.",
      FEAR:        "The instinct to hold still when things feel this unstable is understandable. It is also the most expensive option available right now.",
      FRUSTRATION: "The frustration makes sense. You have been watching this compound and the window for the careful approach has closed while it was happening.",
      APATHY:      "If it feels like the moment for decisive action has passed, that feeling is the most accurate thing in the room right now. It has not passed. But it is close.",
    },
    inference: "The people who left were not wrong to leave. The situation has reached a point where the organization's capacity to self-correct has been outrun by the cost of not correcting. Every week this continues, the recovery becomes more expensive and the options become fewer. What is needed now is not a plan -- it is a decision to act, and someone with the experience to execute in conditions like these without adding to the damage.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Last Leg because your financial leak ratio and personnel loss are confirming the same thing at the same time. When those two signals align -- the math and the people -- the diagnostic has a clear finding. We ruled out The Sacred Cow because the problem here is not one protected individual. We ruled out The Exit Pattern because the loss has already crossed from pattern into collapse. The duration of this friction and the failed resolution attempt confirmed that the window for lighter engagement has closed.",
  },

  SACRED_COW: {
    synthesis: "Everyone in the room knows who this is about. The organization has made a calculation -- that this person's output, relationships, or institutional knowledge makes the disruption survivable -- and has been quietly living under that calculation. That accommodation has a ceiling. The rest of the team has been operating beneath it, and the ones paying attention have already started doing the math on how long they are willing to stay.",
    synthesisMod: {
      FRUSTRATION: "The frustration here is not irrational. You have identified the problem, you know what it is costing, and the organization keeps finding reasons not to address it.",
      FEAR:        "The concern about what naming this will cost is legitimate. It will cost something. The question is whether that cost is higher than what the current arrangement is already extracting.",
      EXHAUSTION:  "The exhaustion of managing around one person's behavior while maintaining the appearance that everything is fine is a specific kind of drain. It compounds.",
      APATHY:      "If the energy to address this has run out, that is not weakness -- it is what happens when a solvable problem is left unsolved long enough. The problem is still solvable.",
    },
    inference: "The organization has not failed to act because it does not know what to do. It has failed to act because every internal path to resolution runs through someone with a stake in the current arrangement. An external attempt confirms that -- when outside help could not move it, the political architecture around this person became visible. What breaks this loop is not a better internal process. It is a conversation that happens outside the org chart with someone who has no stake in the outcome and enough standing to make the finding stick.",
    inferenceMod: {},
    pathToVerdict: "We arrived at The Sacred Cow because your avoidance pattern is cultural -- the cost of addressing this feels too high -- and the blockage is known rather than suspected. That combination is specific: the organization is not confused about what is happening, it has decided it cannot afford to act. The personnel risk signal corroborated it. We ruled out Cracked Mirror because the source of dysfunction is not the leader completing this diagnostic -- it is someone they are managing around. We ruled out Last Leg because the financial gravity, while real, has not yet crossed into collapse territory.",
  },

  CRACKED_MIRROR: {
    synthesis: "The authority to resolve this and the dynamic making resolution difficult are sitting in the same chair. That is not an indictment -- it is a structural reality that no amount of self-awareness fully corrects for. A leader can know they are part of the problem and still be unable to see it clearly enough to fix it from the inside. After several years in this role, the patterns that need examining have had time to become invisible.",
    synthesisMod: {
      FRUSTRATION: "The frustration of trying to solve something that keeps reassembling itself after every attempt is a specific signal. It usually means the thing being fixed is not the thing causing the problem.",
      EXHAUSTION:  "Leading through this while also being part of it is an exhausting position. The energy required to maintain perspective on a system you are inside of has a cost that does not show up cleanly on any report.",
      FEAR:        "The instinct to be careful about what gets named here is understandable. External perspective is not about exposure -- it is about seeing what proximity makes invisible.",
      APATHY:      "When the energy to keep examining the same dynamics runs out, that is usually because the examination has been happening without the right vantage point. A different angle changes what is visible.",
    },
    inference: "Internal conversation has surfaced the problem without resolving it -- which is exactly what happens when the conversation and the obstacle share the same address. This is not a failure of the people involved. It is the predictable result of asking a system to diagnose itself without external reference. What is needed is not more introspection. It is a trusted presence outside the dynamic who can name what the people inside it cannot see clearly enough to say.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Cracked Mirror because the friction is located within leadership and the blockage is suspected rather than known -- the loop is visible but has not been fully named yet. Leadership tenure corroborated it: the longer someone has held a position, the more the patterns of that position become part of how they see everything else. We ruled out Dead Calm because this is not a collective paralysis -- there is a specific locus. We ruled out Broken Compass because the issue is not that leadership is pulling in different directions. It is that the instrument being used to navigate is giving a distorted reading.",
  },

  DEAD_CALM: {
    synthesis: "Nobody is fighting. Nobody is moving. The leadership team has reached a state of such careful mutual awareness that the energy required to maintain the peace has crowded out the energy required to make decisions. The absence of visible conflict is not health -- it is what organizational paralysis looks like when the people involved are too professional to let it show.",
    synthesisMod: {
      FRUSTRATION: "The frustration of watching decisions get deferred repeatedly by people who are perfectly capable of making them is a specific kind of organizational pain.",
      EXHAUSTION:  "The exhaustion here is not from conflict. It is from the sustained effort of maintaining a surface that looks functional while nothing underneath it moves.",
      APATHY:      "When the energy to keep pushing for decisions that do not come runs out, the organization often mistakes that quiet for stability. It is not.",
      FEAR:        "The concern about what happens when the stillness breaks is legitimate. Managed disruption is less expensive than the kind that arrives on its own schedule.",
    },
    inference: "No prior attempt to resolve this means the problem has not been named yet -- or it has been named privately and not collectively. Either way, the organization is waiting for someone with standing to call the question in a room where everyone already knows the answer. That is not a leadership failure. It is a structural one. The forum for resolution either does not exist or has not been convened by someone with enough authority to make the outcome stick.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Dead Calm because decisions are stalled and the avoidance pattern is structural -- there is no forum where the real conversation can happen, or the forum exists and the outcome is predetermined. Those two signals together describe a specific kind of organizational freeze. We ruled out Cracked Mirror because the friction is not traceable to one person's position -- it is collective. We ruled out Silosolation because the fracture here is at the leadership level, not between functions. The absence of any prior attempt confirmed that the problem has not been engaged directly yet.",
  },

  SILOSOLATION: {
    synthesis: "The functions are running. The organization is not. Each unit has developed its own logic, its own priorities, and its own definition of success -- and those definitions have quietly stopped being compatible with each other. The coordination that should be happening at the seams between functions has been replaced by workarounds, assumptions, and the low-grade friction of people working hard in directions that no longer compound.",
    synthesisMod: {
      FRUSTRATION: "The frustration of watching capable teams produce outcomes that do not add up is one of the more demoralizing experiences in organizational life. The people are not the problem. The architecture is.",
      EXHAUSTION:  "The energy cost of managing the gaps between functions -- filling them manually, translating between them, absorbing the fallout when they collide -- is real and it accumulates.",
      APATHY:      "When the effort to bridge the gaps between teams stops feeling worth it, that is usually because the bridges have been rebuilt too many times without anything changing on either bank.",
      FEAR:        "The concern about what a structural reset would disrupt is understandable. The disruption of the reset is smaller than the compounding cost of the current arrangement.",
    },
    inference: "The downstream population affected by this is not a side note -- when the fracture runs across the whole organization, the cost is not contained to the seam where it lives. It radiates. Every cross-functional decision made under these conditions is being made with incomplete information, divergent incentives, or both. What is needed is not better communication between the silos. It is an external architect who can redesign the connective tissue those silos depend on.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Silosolation because the friction is cross-functional and the avoidance pattern is structural -- the forums for coordination either do not exist or are not producing resolution. The downstream population size corroborated it. We ruled out Dead Calm because the paralysis here is not at the leadership level -- it is between functions. We ruled out The Anchor because this is not primarily a drag problem caused by the wrong infrastructure. The structure is producing isolation, not just friction.",
  },

  EXIT_PATTERN: {
    synthesis: "The people leaving are not leaving because the work is hard. People with options leave when the environment stops being worth it -- when the gap between how things are and how they should be becomes something they have to carry every day. Over the past year that gap has been wide enough, and persistent enough, that the people best positioned to close it have started calculating their way out instead.",
    synthesisMod: {
      EXHAUSTION:  "The exhaustion of watching good people leave -- and knowing why -- while the conditions that drove them out remain unchanged is its own kind of organizational grief.",
      FRUSTRATION: "The frustration of a recruiting solution being applied to a culture problem is one of the more expensive misdiagnoses an organization can make.",
      FEAR:        "The concern about what happens when the next round of departures comes is well-founded. The ones who left already made a decision about this environment. The ones still here are making it now.",
      APATHY:      "When the energy to address the departure pattern runs out, the organization usually shifts to replacement mode. The next hire walks into the same environment the last person left.",
    },
    inference: "The next hire will face the same conditions. That is the finding this diagnostic is built around -- not the departures themselves, but what the departures reveal about what remains. The environment has been selecting for a specific kind of person and it is not the kind the organization needs to move forward. A pipeline will not fix what a culture produces. What is needed is a reset of the conditions, not a replacement of the people who responded to them.",
    inferenceMod: {},
    pathToVerdict: "We arrived at The Exit Pattern because personnel risk is confirmed and the duration puts this past the threshold of a turnover spike into something more systematic. A year or more of this dynamic is not an anomaly -- it is a filter. The financial leak corroborated it. We ruled out Last Leg because the situation, while serious, has not crossed into full collapse. We ruled out The Sacred Cow because the problem here is not one protected individual -- it is the environment they have collectively produced.",
  },

  RUNAWAY_TREADMILL: {
    synthesis: "The organization is moving fast enough that slowing down feels dangerous. It is not. The pace has become a cultural identity -- and somewhere in the last two years, the speed stopped being a response to opportunity and started being a substitute for direction. Decisions that should stay made keep getting reopened. The machine is running the people now, not the other way around.",
    synthesisMod: {
      EXHAUSTION:  "The exhaustion of sustained high effort that does not seem to compound into progress is a specific signal. It usually means the effort is real but the direction has drifted.",
      FRUSTRATION: "The frustration of working this hard without the results that should follow is the diagnostic finding before the diagnostic. The inputs are there. Something is consuming the output.",
      APATHY:      "When the energy to keep running at this pace without visible progress runs out, that is not a personal failure. It is the treadmill telling you something.",
      FEAR:        "The concern about what happens if you slow down is understandable in an environment that has been running this fast for this long. The cost of not slowing down is higher.",
    },
    inference: "Growth stage organizations with sustained friction are almost always running on a system that made sense eighteen months ago. The pace that got the organization here has started working against the clarity required to get it where it needs to go. What looks like a capacity problem is usually a prioritization problem with a speed layer on top of it. A structured deceleration -- not a stop, a deliberate downshift -- is what creates the visibility required to distinguish motion from progress.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Runaway Treadmill because the organization is in a growth stage with friction that has been present for over two years -- long enough that the pace itself has become structural. Slow decisions corroborated it: in a treadmill, decisions feel slow because they are constantly being revisited. We ruled out Silosolation because the fracture here is not between functions -- it is between speed and direction. We ruled out The Fossil System because this is not legacy calcification. It is a growth organization that has not paused long enough to notice the drift.",
  },

  FOSSIL_SYSTEM: {
    synthesis: "Nobody built it this way on purpose. Good people solving immediate problems in silence, over years, produced a system that now resists the changes it needs most. The processes in place were built for a version of this organization that no longer exists. The decisions that should have updated them are still pending -- and everything constructed around those pending decisions has become weight-bearing in ways nobody fully mapped.",
    synthesisMod: {
      EXHAUSTION:  "The exhaustion of working inside a system that creates resistance faster than effort can overcome it is a specific kind of organizational fatigue. It accumulates silently.",
      FRUSTRATION: "The frustration of knowing what needs to change while watching the system absorb every attempt to change it is one of the more demoralizing dynamics in organizational life.",
      APATHY:      "When the energy to keep pushing against a system that pushes back harder runs out, that is not resignation -- it is accurate feedback about the cost-to-benefit ratio of the current approach.",
      FEAR:        "The concern about disrupting systems that, however imperfect, are keeping things running is legitimate. The forensic approach here is not demolition -- it is knowing what is actually load-bearing before anything is touched.",
    },
    inference: "Long-tenured leadership in a legacy organization does not cause this pattern -- but it does make it harder to see. The longer someone has been inside a system, the more its constraints start to feel like facts. What is needed is an external audit of what was built, why it was built, and which parts of it are load-bearing versus which parts are workarounds that calcified. That distinction is the map. Without it, every change attempt is renovation without blueprints.",
    inferenceMod: {},
    pathToVerdict: "We arrived at The Fossil System because the organization is in a legacy stage with a structural avoidance pattern -- the forums for change either do not exist or produce predetermined outcomes. Leadership tenure corroborated it: the longer the tenure, the more invisible the system's constraints become to the people inside them. We ruled out Dead Calm because the paralysis here is systemic rather than interpersonal. We ruled out The Anchor because the drag here is not infrastructure -- it is a system that was never updated.",
  },

  ANCHOR: {
    synthesis: "The will is there. The momentum is real. Something is consuming more energy than the work itself should require. It is not a people problem in the way that phrase usually gets used -- it is an infrastructure problem. The tools, the processes, or the team composition made sense at an earlier stage. They are still in place. And at this size, the coordination cost of working around them has quietly become one of the organization's largest operating expenses.",
    synthesisMod: {
      FRUSTRATION: "The frustration of putting in the work and watching the output fall short of what the effort should produce is the clearest signal that something structural is absorbing the difference.",
      EXHAUSTION:  "The exhaustion here is not from the work -- it is from the overhead. The energy required to coordinate around the wrong infrastructure is real, and it does not show up cleanly on any report.",
      APATHY:      "When the energy to keep compensating for structural drag runs out, the organization usually mistakes the quiet for acceptance. It is not. It is depletion.",
      FEAR:        "The concern about what a structural audit might surface is understandable. The alternative is continuing to pay the coordination tax without knowing exactly what is generating it.",
    },
    inference: "At this size, coordination tax is predictable -- it is a function of headcount and cross-functional complexity, not of effort or intent. What makes it a diagnostic finding rather than a normal growth cost is when it outpaces the organization's ability to absorb it. The friction is cross-functional, which means it is sitting at the seams between teams rather than within any single one. That is where the audit needs to go first -- not into the teams themselves, but into the connective tissue between them.",
    inferenceMod: {},
    pathToVerdict: "We arrived at The Anchor because headcount has crossed the threshold where coordination tax becomes a structural reality, and the friction is cross-functional -- sitting at the seams rather than within any single team. We ruled out Silosolation because the units have not stopped communicating entirely -- the drag is slowing them, not isolating them. We ruled out Runaway Treadmill because the problem here is not misdirected speed. It is friction consuming the output of directed effort.",
  },

  BROKEN_COMPASS: {
    synthesis: "The people at the top are no longer navigating toward the same destination. That divergence has not been named yet -- which means every decision made in the meantime is being made against an assumption that may no longer be shared. A year or more of internal conversation without resolution is not a failure of effort. It is a signal that the conversation has become the substitute for the decision.",
    synthesisMod: {
      FRUSTRATION: "The frustration of conversations that cover the same ground without producing different outcomes is a specific signal. The room is not missing effort or intelligence. It is missing a neutral party with standing to call the question.",
      EXHAUSTION:  "The exhaustion of sustained navigation conversations that do not produce a shared destination has a cost that compounds. At some point the conversations stop happening and the divergence becomes structural.",
      APATHY:      "When the energy for navigation conversations runs out, the organization usually shifts to parallel operation -- each leader executing against their own version of the destination. That is when the divergence stops being recoverable without external help.",
      FEAR:        "The concern about what a shared direction might require some people to give up is a real political dynamic. It is also exactly why this conversation has not happened internally -- and why it needs to happen with someone outside it.",
    },
    inference: "The conversation has happened. It produced enough shared language to make the problem feel addressed without producing enough shared commitment to make it resolved. That is a specific dynamic -- it means the trust in the room is sufficient for conversation but insufficient for the kind of candor that produces a common direction. An external presence changes the conditions of that conversation. Not by replacing it, but by creating the space where the real version of it can happen.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Broken Compass because friction is located within leadership and the prior attempt stopped at conversation -- the problem has been acknowledged but not resolved. Slow decisions corroborated it: when leadership is not navigating toward the same destination, decisions slow because they are being evaluated against different criteria. We ruled out Cracked Mirror because the issue is not one leader's position relative to the problem -- it is the whole top team pulling in different directions. We ruled out Dead Calm because the organization is still moving, just not in the same direction.",
  },

  KID_GLOVES: {
    synthesis: "The relationships here are genuine. That is not the problem -- it is the context for the problem. The care people have for each other has become the reason the most important conversations are not happening. The culture has developed a shared, unspoken agreement that the relationships are more fragile than they probably are. Careful has become the default. And careful, practiced long enough, is its own kind of expensive.",
    synthesisMod: {
      FRUSTRATION: "The frustration of knowing what needs to be said and watching the room find reasons not to say it -- meeting after meeting -- is a quiet drain that rarely gets named for what it is.",
      EXHAUSTION:  "The exhaustion of maintaining a careful surface in every interaction -- choosing words, softening edges, protecting relationships -- accumulates in ways that do not show up until someone finally says the thing that needed to be said two years ago.",
      APATHY:      "When the energy to keep navigating around the unspoken things runs out, the organization usually mistakes the resulting quiet for health. It is not health. It is avoidance that has stopped requiring effort.",
      FEAR:        "The concern about what honest conversation might cost these relationships is the thing keeping this pattern in place. The relationships are almost certainly more durable than the current arrangement assumes.",
    },
    inference: "A high-trust, low-candor environment is not a cultural failure -- it is a cultural success that has outrun its own design. The trust that makes this organization a good place to work is also the thing making it harder to do the work that matters most. What is needed is not a confrontation. It is a structured space where honest conversation can happen without the relationships bearing the full weight of the discomfort. That is a skill that can be built. The raw material -- genuine care between people -- is already there.",
    inferenceMod: {},
    pathToVerdict: "We arrived at Kid Gloves because the avoidance pattern is cultural -- the cost of honest conversation feels too high -- and personnel risk is absent, which rules out more acute states. The friction duration confirmed it: this pattern takes time to develop and it has been developing. We ruled out The Sacred Cow because there is no single protected individual at the center of this -- the avoidance is collective and evenly distributed. We ruled out Dead Calm because decisions are being made. The problem is not paralysis -- it is that the most important inputs to those decisions are not making it into the room.",
  },

  UNLIT_ROOM: {
    synthesis: "The organization is functioning. The friction is real but it has not compounded into something structural yet. What is present is a gap between where things are and where they could be -- and the clarity to close that gap has not been established yet. That is not a failure. It is the earliest and most correctable version of the pattern this diagnostic exists to find.",
    synthesisMod: {
      FRUSTRATION: "The frustration of knowing something is not quite right without being able to name exactly what it is or where it lives is a legitimate signal. It usually means the friction is real but has not surfaced clearly enough to act on yet.",
      EXHAUSTION:  "The low-grade exhaustion of working in an environment where something feels slightly off -- without a clear source -- is often the first signal that friction is present before it becomes visible.",
      APATHY:      "A mild sense of disconnection from what should feel like forward progress is worth paying attention to. It is usually the earliest signal of drift, before the drift becomes structural.",
      FEAR:        "The instinct to get ahead of something before it becomes a problem is one of the more valuable instincts a leader can have. This diagnostic exists precisely for that moment.",
    },
    inference: "The conditions are good. The agency is high. What is missing is a starting point -- a clear view of where the friction is actually located and what addressing it first would unlock for everything else. That is what a map provides. Not a repair of something broken, but a clear picture of the highest-leverage moves available to an organization that still has the luxury of choosing where to start.",
    inferenceMod: {},
    pathToVerdict: "We arrived at The Unlit Room because no high-severity signal combination was present and the low-water mark conditions were met -- the financial leak is contained, personnel risk is absent, and the path forward is not blocked. This is a genuine finding, not a default. It means the organization is early enough in the friction curve that the next move is clarifying rather than corrective. We ruled out every preceding state because none of their core signal requirements were met. The instrument looked for dysfunction and found early-stage friction instead. That distinction matters.",
  },

};

// ─── STRING ACCESSORS ─────────────────────────────────────────────────────────

export function getSynthesis(stateId, toneKey) {
  const block = STRINGS[stateId];
  if (!block) return '';
  const mod = block.synthesisMod?.[toneKey];
  return mod ? `${mod} ${block.synthesis}` : block.synthesis;
}

export function getInference(stateId, toneKey) {
  const block = STRINGS[stateId];
  if (!block) return null;
  const mod = block.inferenceMod?.[toneKey];
  return mod ? `${mod} ${block.inference}` : block.inference;
}

export function getPathToVerdict(stateId) {
  return STRINGS[stateId]?.pathToVerdict || null;
}

// ─── TIER RECOMMENDATION RATIONALE ───────────────────────────────────────────
// Z-axis aware rationale strings keyed by tier and state severity.
// These explain WHY this tier was recommended for this specific agency profile.

export function buildRecommendationRationale(tier, state, agencyScore, inputData) {
  const { priorAttempt, resolutionBlockage, frictionLocation, personnelRisk, orgStage, leadershipTenure } = inputData;

  if (tier === TIERS.STABILITY_SUPPORT) {
    return "The math has turned on this one. The cost of inaction has exceeded what a structured intervention can address incrementally. What is needed now is not a plan -- it is immediate stabilization. The window for a deliberate process has closed and what happens in the next few weeks will determine what is possible after that.";
  }

  if (tier === TIERS.EXECUTIVE_COUNSEL) {
    if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'ATTEMPTED') {
      return "The Executive Counsel is the right entry point because two prior attempts at resolution have not held. The source of the blockage has institutional protection and a structured engagement will work around it rather than through it. What is needed is a sustained, confidential relationship that can operate outside the dynamics that have protected the problem so far.";
    }
    if (leadershipTenure === 'UNDER_ONE') {
      return "The Executive Counsel is the right entry point because you are navigating a problem you inherited, not one you created. The friction predates your tenure and the people who built it are probably still in the room. What you need is a confidential relationship with someone who can help you see the landscape clearly and move through it without the constraints that come with a formal engagement.";
    }
    if (resolutionBlockage === 'ATTEMPTED') {
      return "The Executive Counsel is the right entry point because something is actively preventing the resolution the organization knows it needs, and a structured engagement alone will not reach it. The failed attempt has confirmed there is a political or structural wall in the way. What is needed is a sustained, confidential presence that can operate where the formal process cannot.";
    }
    return "The Executive Counsel is the right entry point because what this profile describes is not a situation that a time-bound structured engagement will resolve. The friction is too embedded, the stakes are too specific, and what is needed is an ongoing confidential relationship -- not a project with a deliverable at the end.";
  }

  if (tier === TIERS.INTERVENTION) {
    if (priorAttempt === 'EXTERNAL') {
      return "The Intervention is the right entry point because a previous external engagement did not hold, which tells us the resolution needs to go somewhere the last one did not reach. The Intervention does not produce a plan for your organization to execute -- it produces the resolution directly, in the room, with the people who need to be part of it.";
    }
    if (personnelRisk === 'YES' && resolutionBlockage === 'KNOWN') {
      return "The Intervention is the right entry point. There is someone at risk of leaving and a decision the organization knows needs to happen. The situation is already in motion. What is needed is not a roadmap for addressing it -- it is someone in the room to move it through.";
    }
    if (frictionLocation === 'WITHIN_LEADERSHIP' && personnelRisk !== 'NONE') {
      return "The Intervention is the right entry point because the friction is inside the leadership team and there is already a personnel consequence in play. At that combination, a diagnostic and roadmap phase delays the resolution the organization actually needs. We come in, address it directly, and you leave with the thing done -- not a plan to do it.";
    }
    if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') {
      return "The Intervention is the right entry point because what this profile describes has been in place long enough that a roadmap phase would spend its time documenting what everyone already knows. The patterns are established, the cost is confirmed, and the organization needs someone to move it -- not map it.";
    }
    return "The Intervention is the right entry point based on this profile. What is needed is resolution, not a plan for resolution. The Roadmap is the right entry point when the organization needs clarity on what to address. This organization already has that clarity. What it needs now is someone to address it.";
  }

  if (tier === TIERS.ROADMAP) {
    if (priorAttempt === 'NONE') {
      return "The Roadmap is the right entry point because this is the first structured look at what is happening and what it is costing. Before bringing someone in to resolve it, it is worth getting a precise diagnosis of where the friction lives, what is sustaining it, and what resolution actually needs to look like for this specific organization. The Roadmap produces that -- and a plan your team can execute on.";
    }
    if (frictionLocation === 'CROSS_FUNCTIONAL') {
      return "Cross-functional friction is the hardest kind to resolve without first mapping it precisely -- because what looks like a relationship problem is almost always a structural one. The Roadmap will identify whether the friction is in the design of the organization or in the dynamics between the people in it. Those are different problems with different solutions, and the distinction is worth getting right before bringing someone in to address it.";
    }
    return "The Roadmap is the right entry point based on this profile. The friction is real and the cost is confirmed -- but this organization is in a position to address it deliberately rather than urgently. The Roadmap will name the source precisely and give your team a structured path to resolution.";
  }

  if (tier === TIERS.DEVELOPMENT) {
    return "Development is the right entry point because the machine is running. The conditions are good, the agency is high, and what is missing is not a repair -- it is a force multiplier. The highest-leverage investment available to this organization right now is in the people leading it.";
  }

  return null;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ResultsLedger({ summary, dispatchUrl, onReset, inputData }) {
  const {
    total, monthlyBurn, executionGap,
    radiatedImpact, confirmedHistoricalLoss,
    state, tier, agencyScore, toneKey,
    showGravityFloor,
  } = summary;

  const tierMeta = TIER_META[tier] || {};

  const synthesis     = useMemo(() => getSynthesis(state.id, toneKey),     [state.id, toneKey]);
  const inference     = useMemo(() => getInference(state.id, toneKey),     [state.id, toneKey]);
  const pathToVerdict = useMemo(() => getPathToVerdict(state.id),          [state.id]);
  const rationale     = useMemo(() => buildRecommendationRationale(tier, state, agencyScore, inputData), [tier, state, agencyScore, inputData]);

  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery  = monthlyRecovery * 12;
  const returnMultiple  = tierMeta.fee
    ? (annualRecovery / tierMeta.fee).toFixed(1)
    : null;

  // ── EMAIL CAPTURE STATE ──────────────────────────────────────
  const [email, setEmail]                     = useState('');
  const [companyName, setCompanyName]         = useState('');
  const [optSendRecord, setOptSendRecord]     = useState(false);
  const [optIntelligence, setOptIntelligence] = useState(false);
  const [dispatched, setDispatched]           = useState(false);

  const handleEmailDispatch = async () => {
    const resolvedCompany = companyName.trim() || email.split('@')[1] || '';
    try {
      await fetch('/api/diagnostic-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict:             state.label,
          tier,
          monthlyBurn,
          total,
          email,
          companyName:         resolvedCompany,
          optSendRecord,
          optIntelligence,
          prior_attempt:       inputData.priorAttempt,
          personnel_risk:      inputData.personnelRisk,
          resolution_blockage: inputData.resolutionBlockage,
          resolution_vision:   inputData.resolutionVision,
        }),
      });
      setDispatched(true);
    } catch {
      setDispatched(true);
    }
  };

  const downloadPDF = async () => {
  const { pdf } = await import('@react-pdf/renderer');
  const { DiagnosticDocument } = await import('./DiagnosticPDF');
  const blob = await pdf(
    <DiagnosticDocument summary={summary} inputData={inputData} />
  ).toBlob();
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `Principal_Resolution_Record_${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    if (dispatchUrl) {
      fetch('/api/diagnostic-dispatch', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict:      state.label,
          tier,
          monthlyBurn,
          total,
          Client_Email: 'diagnostic@principalresolution.com',
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-10 w-full">

      {/* ── CAPTURE TARGET ─────────────────────────────── */}
      <div
        data-report-container
        className="bg-brand-bg border border-brand-border p-6 md:p-10 lg:p-16 shadow-2xl relative transition-colors duration-700"
      >
        {/* Watermark */}
        <div className="absolute top-10 right-10 font-mono text-[9px] uppercase tracking-institutional opacity-10 rotate-90 origin-top-right text-brand-text font-bold select-none">
          Confidential // Record v6.0
        </div>

        <div className="space-y-12">

          {/* VERDICT */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Institutional State
            </span>
            <h2
              className="font-serif italic tracking-tighter text-brand-text leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
            >
              {state.label}
            </h2>
            {/* State definition sourced from glossary */}
            <p
              className="font-serif italic text-brand-muted border-l-4 border-brand-accent pl-4 md:pl-8 py-2 max-w-3xl leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}
            >
              {STATE_GLOSSARY.find(s => s.id === state.id)?.definition || ''}
            </p>
          </div>

          {/* COST FIGURE */}
          <div className="border-y border-brand-border/40 py-8 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                Annual Institutional Cost
              </span>
              <div style={{ minHeight: '110px' }}>
                {showGravityFloor ? (
                  <p
                    className="font-serif italic text-brand-accent leading-tight"
                    style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
                  >
                    This is the beginning of an expensive pattern.
                  </p>
                ) : (
                  <div
                    className="font-fjalla text-brand-text leading-none overflow-hidden"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
                  >
                    {formatCurrency(total)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">Monthly Burn</span>
                <span className="font-serif italic text-brand-accent block" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}>
                  {formatCurrency(monthlyBurn)}
                </span>
              </div>
              {radiatedImpact > 0 && (
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">Radiated Impact</span>
                  <span className="font-serif italic text-brand-text block" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}>
                    {formatCurrency(radiatedImpact)}
                  </span>
                </div>
              )}
              {confirmedHistoricalLoss > 0 && (
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">Confirmed Historical Loss</span>
                  <span className="font-serif italic text-brand-text block" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}>
                    {formatCurrency(confirmedHistoricalLoss)}
                  </span>
                </div>
              )}
              {executionGap > 0 && (
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">Execution Gap</span>
                  <span className="font-serif italic text-brand-text block" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}>
                    {formatCurrency(executionGap)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SIGNAL MATRIX */}
          <SignalMatrix summary={summary} inputData={inputData} />

          {/* ADVISOR SYNTHESIS */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Advisor Synthesis
            </span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif italic text-brand-text leading-relaxed max-w-3xl border-l-2 border-brand-accent/40 pl-4 md:pl-8"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)' }}
            >
              {synthesis}
            </motion.p>
          </div>

          {/* ADVISOR INFERENCE */}
          {inference && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                  Advisor Inference
                </span>
                <div className="flex-1 h-px bg-brand-border" />
              </div>
              <div className="border-l-4 border-brand-accent/40 pl-4 md:pl-6">
                <p
                  className="font-serif italic text-brand-muted leading-relaxed"
                  style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                >
                  {inference}
                </p>
              </div>
            </div>
          )}

          {/* PATH TO VERDICT */}
          {pathToVerdict && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                  Path to Verdict
                </span>
                <div className="flex-1 h-px bg-brand-border" />
              </div>
              <div className="border-l-4 border-brand-border pl-4 md:pl-6">
                <p
                  className="font-serif italic text-brand-muted leading-relaxed"
                  style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)' }}
                >
                  {pathToVerdict}
                </p>
              </div>
            </div>
          )}

          {/* RECOMMENDED TIER */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Recommended Engagement
            </span>
            <div className="p-6 md:p-8 border border-brand-accent/30 space-y-4">
              <h3
                className="font-serif italic text-brand-text tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
              >
                {tier}
              </h3>
              <p
                className="font-mono text-brand-accent font-bold leading-relaxed"
                style={{ fontSize: 'clamp(0.7rem, 1vw, 0.75rem)' }}
              >
                {tierMeta.outcomeStatement || ''}
              </p>
            </div>
          </div>

          {/* WHY THIS ENGAGEMENT */}
          {rationale && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                  Why This Engagement
                </span>
                <div className="flex-1 h-px bg-brand-border" />
              </div>
              <div className="border-l-4 border-brand-accent pl-4 md:pl-6">
                <p
                  className="font-serif italic text-brand-text leading-relaxed"
                  style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                >
                  {rationale}
                </p>
              </div>
            </div>
          )}

          {/* COST COMPARISON */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              The Case for Action
            </span>
            <div className="grid grid-cols-1 gap-px bg-brand-border/40 border border-brand-border/40">
              <div className="bg-brand-bg p-6 md:p-8 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                  Cost of inaction // Per year
                </span>
                <div
                  className="font-fjalla text-brand-text leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
                >
                  {showGravityFloor ? 'Compounding' : formatCurrency(total)}
                </div>
                <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                  Confirmed by this diagnostic
                </p>
              </div>
              <div className="bg-brand-accent/5 p-6 md:p-8 space-y-3 border-t border-brand-border/40">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                  Cost of resolution // {tier}
                </span>
                <div
                  className="font-fjalla text-brand-accent leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
                >
                  {tierMeta.feeLabel || ''}
                </div>
                {returnMultiple && (
                  <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                    {returnMultiple}x return on a 10% friction reduction
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* METRIC LEGEND */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                How the Math Works
              </span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>
            <div className="space-y-0 border border-brand-border/40">
              {METRIC_LEGEND.map((item, i) => (
                <div
                  key={item.term}
                  className={`p-4 md:p-6 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6${i < METRIC_LEGEND.length - 1 ? ' border-b border-brand-border/40' : ''}`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold shrink-0 sm:w-44 pt-0.5">
                    {item.term}
                  </span>
                  <p
                    className="font-serif italic text-brand-muted leading-relaxed"
                    style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)' }}
                  >
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* GLOSSARY */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                Institutional State Glossary
              </span>
              <div className="flex-1 h-px bg-brand-border/40" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold opacity-60">
              The twelve patterns this instrument is designed to identify. Your result appears above.
            </p>
            <div className="space-y-0 border border-brand-border/30">
              {STATE_GLOSSARY.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`p-4 md:p-5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6${
                    entry.id === state.id ? ' bg-brand-accent/5 border-l-2 border-brand-accent' : ''
                  }${i < STATE_GLOSSARY.length - 1 ? ' border-b border-brand-border/30' : ''}`}
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-briefing font-bold shrink-0 sm:w-44 pt-0.5${
                      entry.id === state.id ? ' text-brand-accent' : ' text-brand-muted opacity-60'
                    }`}
                  >
                    {entry.label}
                  </span>
                  <p
                    className={`font-serif italic leading-relaxed${
                      entry.id === state.id ? ' text-brand-text' : ' text-brand-muted opacity-60'
                    }`}
                    style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)' }}
                  >
                    {entry.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── DISPATCH -- outside PDF capture ─────────────── */}
      <div className="border-t-2 border-brand-accent p-6 md:p-10 space-y-8 bg-brand-bg">
        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
            Next Step
          </span>
          <h4
            className="font-serif italic text-brand-text tracking-tighter leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            You have seen the number. Here is what to do with it.
          </h4>
          <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
            Download the record and sit with it -- or let us talk about what it means for you specifically.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={downloadPDF}
            className="w-full flex items-center justify-center gap-4 border-2 border-brand-border text-brand-text font-mono text-[11px] uppercase tracking-briefing font-bold py-5 hover:border-brand-accent hover:text-brand-accent transition-all group"
          >
            <Download size={13} className="group-hover:translate-y-0.5 transition-transform" />
            Download the Record
          </button>
          <button
            onClick={() => dispatchUrl && (window.location.href = dispatchUrl)}
            className="w-full flex items-center justify-center gap-4 bg-brand-accent text-white font-mono text-[11px] uppercase tracking-briefing font-bold py-5 hover:bg-brand-text transition-all group shadow-lg"
          >
            {tierMeta.cta || 'Get in touch'}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* EMAIL CAPTURE */}
        <div className="border border-brand-border p-5 space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Optional
            </span>
            <p className="font-serif italic text-brand-text leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
              Leave your email to receive this record directly -- and to hear from us when new Intelligence Memos are published.
            </p>
          </div>

          <input
            type="text"
            placeholder="Company name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-3 font-serif italic text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
          />

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-3 font-serif italic text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
          />

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={optSendRecord} onChange={(e) => setOptSendRecord(e.target.checked)} className="mt-1 accent-brand-accent shrink-0 w-4 h-4" />
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
                Send me this record
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={optIntelligence} onChange={(e) => setOptIntelligence(e.target.checked)} className="mt-1 accent-brand-accent shrink-0 w-4 h-4" />
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
                Keep me informed of new Intelligence Memos
              </span>
            </label>
          </div>

          {email && (optSendRecord || optIntelligence) && (
            dispatched ? (
              <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold py-4">
                Received. You will hear from us.
              </p>
            ) : (
              <button
                onClick={handleEmailDispatch}
                className="w-full py-4 border border-brand-accent text-brand-accent font-mono text-[11px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all"
              >
                Submit
              </button>
            )
          )}
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors font-bold"
        >
          <RotateCcw size={12} />
          Run it again with different inputs
        </button>
      </div>
    </div>
  );
}