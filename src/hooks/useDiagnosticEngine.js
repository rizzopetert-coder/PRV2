"use client";

import { useMemo, useRef } from 'react';

/**
 * Principal Resolution // Diagnostic Engine v4.1
 * Three-tier contextual insight system.
 * Tier 1: Industry (1 of 3, sequence-varied)
 * Tier 2: Stage in context of industry
 * Tier 3: Headcount in context of industry + stage
 * Module 2: Behavioral with Module 1 context carried forward
 * Module 3: Financial with alternate phrasings on common triggers
 * Tenet: Absolute Candor.
 */

// ── TIER 1: INDUSTRY INSIGHTS ────────────────────────────────────

const INDUSTRY_INSIGHTS = {
  TECH: [
    "In Technology, speed is the culture, which means dysfunction gets outrun until it doesn't. The pattern I see most is expensive mistakes repeating because nobody stopped long enough to name them.",
    "Tech organizations are unusually good at building around problems. The workaround becomes the process, the process becomes the culture, and eventually nobody remembers what it was working around.",
    "The human variable in Technology is often invisible because the technical variable is so loud. By the time the people problem surfaces, it's usually been running for a long time.",
  ],
  FINANCE: [
    "In Finance, correctness is the floor, not the ceiling. The problem is that cultures of correctness tend to become cultures of silence, and silence is where the real risk lives.",
    "Financial organizations are precise about everything except the conversations that matter most. The irony is that the most expensive line item rarely appears on any report.",
    "Finance leaders are often the most aware of their dysfunction and the least likely to address it. The analytical mind finds endless reasons why now isn't the right time.",
  ],
  CONSULTING: [
    "Consulting firms are the last to see their own dysfunction. By the time it shows up in revenue, it's been visible in culture for years. Your people knew before the numbers did.",
    "There's a specific irony in a consulting firm that can diagnose everyone else's organizational problems while quietly tolerating its own. I see it more often than you'd expect.",
    "In Consulting, reputation is everything, which means internal problems get managed for appearances long after they should have been resolved. The client never sees it. The team sees nothing else.",
  ],
  HEALTH: [
    "Healthcare friction isn't just expensive. It has consequences that don't show up on a balance sheet. The stakes here are different and the cost of avoidance is higher than in almost any other sector.",
    "In Healthcare, the mission is so visible and so urgent that internal dysfunction gets tolerated in its name. The cause becomes the excuse. It doesn't make the dysfunction cheaper.",
    "I've worked with healthcare leaders who would never tolerate in patient care the same ambiguity they tolerate in their leadership teams. The standards don't transfer inward the way they should.",
  ],
  MANUFACTURING: [
    "In Manufacturing, friction usually lives in the leadership layer long before it shows up on the floor. The people closest to the work feel it first and say something last.",
    "Manufacturing organizations are built for precision in production and often surprisingly imprecise in communication. The tolerance for variance that doesn't exist in the build somehow exists in the room where decisions get made.",
    "The handoff is where Manufacturing friction compounds. Between shifts, between departments, between the people who know what's happening and the people who need to. That gap has a daily cost.",
  ],
  RETAIL: [
    "Retail moves fast enough that what leadership avoids on Monday becomes a floor problem by Friday. The delay between dysfunction and consequence is very short.",
    "In Retail, the customer sees the result of leadership dysfunction before leadership does. By the time it's visible internally, it's already been paid for externally.",
    "Retail organizations are unusually good at measuring outcomes and unusually reluctant to trace them back to their cause. The numbers tell the story. The conversation about what's behind the numbers often doesn't happen.",
  ],
  ENERGY: [
    "Energy organizations carry enormous coordination weight. A slow or avoided decision here isn't just a morale problem. It's an infrastructure problem with a very long tail.",
    "In Energy, the complexity of the technical work often provides cover for the simplicity of the people problem underneath it. The answer is rarely as complicated as the environment makes it feel.",
    "Energy leaders are often managing risk everywhere except inside the leadership team itself. The one place they're most exposed is the one place they're least likely to look.",
  ],
  MEDIA: [
    "The human variable in Media is psychological safety. If the room doesn't feel safe enough to say the true thing, the creative output suffers, and everyone performs like everything is fine.",
    "Media organizations run on taste and judgment, which means disagreement feels personal in a way it doesn't in other sectors. That sensitivity is an asset creatively and a liability organizationally.",
    "In Media, the talent knows before the leadership does. The creative quality starts dropping before anyone names the reason, and by the time it's visible in the work it's been felt in the culture for a while.",
  ],
  CONSTRUCTION: [
    "The real project risk in Construction is almost never the build. It's the conversation that didn't happen before the build started. That's where the cost lives.",
    "Construction organizations are extraordinarily good at managing physical risk and often surprisingly poor at managing relational risk. The two skill sets don't transfer the way you'd hope.",
    "In Construction, scope creep on the job site gets addressed immediately. Scope creep in the leadership dynamic gets accommodated indefinitely. The tolerance levels are exactly backwards.",
  ],
  NONPROFIT: [
    "Nonprofits carry a specific friction tax: the idea that the mission makes the mindset of 'dysfunction has to be the cost of doing business' acceptable. No it doesn't. And it isn't. And the inspired, uniquely motivated people doing the work feel it harder than anyone.",
    "In Nonprofits, the hardest conversations get deferred because the mission feels more urgent. What I've found is that the mission suffers most when the people serving it are least supported.",
    "Nonprofit leadership teams often have the highest emotional investment and the least infrastructure for honest disagreement. That combination is more fragile than it looks.",
  ],
  LOGISTICS: [
    "Logistics friction compounds at every handoff. A problem at the top of the chain doesn't stay at the top. It multiplies on the way down and arrives at the end as something much more expensive.",
    "In Logistics, delay is the enemy everywhere except in leadership communication. The urgency that governs operations rarely governs the conversations that operations depends on.",
    "The organizations I've worked with in Logistics are precise about time everywhere except the time it takes to surface a problem. That lag is where the real cost accumulates.",
  ],
  OTHER: [
    "The sector changes the context. The pattern is usually the same. Truth that isn't being spoken, and a cost that keeps accumulating because of it.",
    "Every industry has its own version of this problem. The language is different, the org chart looks different, but the gap between what's known and what's said tends to look remarkably similar.",
    "What I've found working across sectors is that the specifics vary but the dynamic doesn't. Someone in that room knows something that isn't reaching the people who need to act on it.",
  ],
};

// ── TIER 2: STAGE IN CONTEXT OF INDUSTRY ─────────────────────────

const STAGE_INSIGHTS = {
  TECH_STARTUP: [
    "A tech startup is where the human variable is most concentrated and most ignored. Everyone is moving too fast to name the dynamic forming at the top of the room, and that dynamic becomes the culture before anyone realizes it was a choice.",
    "The founding team friction in a tech startup doesn't stay in the founding team. It gets baked into how decisions get made, who gets heard, and what's safe to say. By the time you're hiring your fiftieth person, those patterns are already institutional.",
  ],
  TECH_GROWTH: [
    "Growth-stage tech organizations hit a specific wall where the speed that got them here starts working against them. The coordination cost goes up, the communication quality goes down, and the gap between what leadership thinks is happening and what's actually happening widens fast.",
    "In a growth-stage tech company, the org chart stops reflecting reality before anyone admits it. New layers appear, old relationships persist outside the structure, and decisions start happening in the wrong rooms. That's not growing pains. That's friction with a compounding interest rate.",
  ],
  TECH_ESTABLISHED: [
    "An established tech organization has usually survived long enough to normalize its dysfunction. What started as a workaround is now a process. What started as a personality conflict is now a structural divide. It looks like culture. It costs like a liability.",
  ],
  TECH_LEGACY: [
    "Legacy in technology is a specific kind of trap. The organization that moved fast enough to win is now moving slowly enough to lose, and the people who remember why certain decisions got made are the same people blocking the ones that need to get made now.",
  ],
  CONSULTING_STARTUP: [
    "A consulting startup is where the founder's personal brand and the firm's institutional identity haven't separated yet. That's not always a problem. But when it is, it's a particularly expensive one, because every client relationship runs through the same unresolved dynamic.",
  ],
  CONSULTING_GROWTH: [
    "There's a specific irony in a growth-stage consulting firm. You're selling organizational clarity to clients while building organizational complexity internally and hoping nobody notices the gap. Your senior people notice. They're just being professional about it.",
    "Growth in a consulting firm almost always surfaces the question of who owns what. Clients, relationships, methodology, credit. The answers to those questions either get worked out deliberately or they get worked out through attrition. One of those is much more expensive.",
  ],
  CONSULTING_ESTABLISHED: [
    "An established consulting firm has usually developed a very sophisticated relationship with its own dysfunction. It has been managed, reframed, and professionalized to the point where naming it feels almost rude. That sophistication is exactly what makes it so costly.",
    "In an established consulting firm, the partners who built the culture are often the culture problem. That's a delicate thing to say out loud inside the organization. It's a much easier thing to see from outside it.",
  ],
  HEALTH_STARTUP: [
    "A healthcare startup carries the weight of the mission from day one, which means the internal dynamics get subordinated to the external purpose earlier than in almost any other sector. That's understandable. It's also how the founding-era friction gets permanently embedded.",
  ],
  HEALTH_GROWTH: [
    "Growth in a healthcare organization means the stakes of every leadership dysfunction get multiplied across more patients, more staff, more outcomes. The cost of an unresolved leadership problem here isn't just financial. That's worth sitting with.",
  ],
  HEALTH_ESTABLISHED: [
    "Established healthcare organizations have often built their dysfunction into the accreditation structure. The process exists to manage the problem rather than resolve it, and everyone has learned to work within that. The cost is just absorbed as overhead.",
  ],
  HEALTH_LEGACY: [
    "A legacy healthcare organization is often carrying decades of deferred leadership conversations. The mission made them feel optional. They weren't. They just got more expensive with every year they didn't happen.",
  ],
  NONPROFIT_STARTUP: [
    "A startup nonprofit is where mission intensity is highest and organizational infrastructure is thinnest. The people are extraordinary. The systems for honest disagreement usually don't exist yet. That combination is more fragile than the energy in the room suggests.",
    "In a nonprofit startup, the founding team's shared belief in the mission often substitutes for the hard conversations that belief can't actually replace. It works until it doesn't, and when it stops working the mission feels like it's at stake. It is.",
  ],
  NONPROFIT_GROWTH: [
    "Growth in a nonprofit surfaces a question the founding team often isn't prepared for: what happens when we can't all be in the room for every decision? The answer requires infrastructure for honest communication that most mission-driven organizations never built because the mission made it feel unnecessary.",
    "A growth-stage nonprofit is where the gap between the people who started it and the people who are scaling it becomes visible. That gap is normal. How it gets navigated determines whether the mission scales with the organization or gets left behind in it.",
  ],
  NONPROFIT_ESTABLISHED: [
    "A large established nonprofit has usually developed a very sophisticated relationship with its own dysfunction. The mission provides cover. The longevity provides legitimacy. And the people doing the most important work feel the cost of the unresolved leadership dynamic more acutely than anyone in the leadership team realizes.",
  ],
  FINANCE_LEGACY: [
    "A legacy financial organization has had decades to perfect the art of managing dysfunction without resolving it. The risk frameworks are sophisticated. The conversation frameworks almost never are. The most significant unmanaged risk in the building is usually in the leadership team.",
    "In a legacy finance organization, the culture of correctness has usually been in place long enough that nobody remembers choosing it. It's just how things are done here. Which means the cost of it is completely invisible on any report that matters.",
  ],
  FINANCE_ESTABLISHED: [
    "An established financial organization has usually developed very precise language for everything except the conversations that actually need to happen. The euphemisms are professional. The cost is real.",
  ],
  MANUFACTURING_GROWTH: [
    "Growth in a manufacturing organization tests something specific: whether the precision that governs the floor can be brought into the room where leadership decisions get made. In my experience, that transfer rarely happens on its own. It has to be built deliberately.",
    "A growth-stage manufacturing organization is often scaling its production capacity and its leadership dysfunction at exactly the same rate. The floor gets more efficient. The room where the decisions about the floor get made gets more complicated.",
  ],
  MANUFACTURING_LEGACY: [
    "Legacy in manufacturing means the friction has been load-bearing long enough that people are afraid to touch it. The workarounds are structural. The people who know why certain things are done certain ways are retiring. That institutional knowledge gap is also a friction gap.",
  ],
  CONSTRUCTION_ESTABLISHED: [
    "An established construction organization has usually gotten very good at finishing projects despite the leadership friction rather than because it was resolved. That's a sustainable model right up until the friction costs more than the margin.",
    "In an established construction firm, the accommodation of difficult dynamics has often become a point of pride. We've always found a way to make it work. That's true. It's also not the same as addressing what's making the work harder than it needs to be.",
  ],
  CONSTRUCTION_GROWTH: [
    "Growth in a construction organization means more projects, more relationships, more handoffs, and more places for the friction at the top to show up at the bottom. The job site absorbs what the leadership team doesn't resolve.",
  ],
  MEDIA_STARTUP: [
    "A media startup is where creative identity and organizational identity are most fused and most confused. The founders' taste is the product. That's a strength and a governance problem at the same time, and the two tend to become indistinguishable before anyone thinks to separate them.",
    "In a media startup, the culture of creative honesty and the culture of organizational honesty are often completely different things. People will fight passionately about the work and say nothing about the dynamic making the work harder. Both matter. Only one gets discussed.",
  ],
  MEDIA_GROWTH: [
    "Growth in a media organization means the founder's taste has to somehow travel through more people without losing its integrity. That requires an organizational honesty the creative culture doesn't always support. The tension between those two things is where the friction usually lives.",
  ],
};

// ── TIER 3: HEADCOUNT IN CONTEXT OF INDUSTRY + STAGE ─────────────

const HEADCOUNT_INSIGHTS = {
  TECH_STARTUP_SMALL: "A small tech startup is where the founding dynamic is everything. At this size, every unresolved tension between the people at the top is felt by everyone below them within days. There's nowhere for it to go except into the work.",
  TECH_STARTUP_MID: "This is the size where a tech startup's founding-era friction stops being a personality dynamic and starts being an organizational structure. The patterns formed in the first ten people are now being inherited by fifty. That inheritance is rarely examined and almost never voluntary.",
  TECH_GROWTH_MID: "Twenty-five to a hundred people is the coordination wall for a growth-stage tech company. This is where the communication that worked informally stops working and the systems to replace it haven't been built yet. The friction in that gap is expensive and almost always gets misdiagnosed as a hiring problem.",
  TECH_GROWTH_LARGE: "At this size in a growth-stage tech organization, the distance between a leadership decision and its consequences has grown long enough that feedback loops break down. Leadership thinks things are working better than they are. The people closest to the reality have stopped correcting that impression because it stopped feeling safe to do so.",
  CONSULTING_GROWTH_SMALL: "A small growth-stage consulting firm is carrying a specific tension: the work is scaling but the founding relationships haven't been renegotiated. Who owns what, who decides what, who gets credit for what — those questions are being answered informally every day by people who have never discussed them directly.",
  CONSULTING_ESTABLISHED_MID: "A mid-size established consulting firm has usually reached the size where the founding partners' relationships with each other are the primary governance structure. That works until it doesn't, and when it stops working the whole organization feels it before anyone names it.",
  CONSULTING_ESTABLISHED_LARGE: "At this size and stage in a consulting firm, the dysfunction has almost certainly been professionalized. It has a name that isn't its real name, a process that manages it without resolving it, and a shared agreement among leadership not to look at it directly. That agreement is costing the firm more than anyone has calculated.",
  HEALTH_GROWTH_MID: "A mid-size growth-stage healthcare organization is at the point where the mission can no longer substitute for the infrastructure. The founding team's shared commitment got you here. Getting to the next stage requires organizational honesty that shared commitment alone can't provide.",
  HEALTH_LEGACY_LARGE: "A large legacy healthcare organization has usually built its leadership dysfunction into the accreditation and compliance structure so thoroughly that it looks like governance. Naming it requires someone willing to separate the regulatory necessity from the organizational choice. Those are different things and they've been allowed to look identical for a long time.",
  NONPROFIT_STARTUP_SMALL: "At this size and stage, the nonprofit is essentially the founding team's shared belief made organizational. That's beautiful and fragile in equal measure. The honest conversations that feel optional right now are the ones that will determine whether the mission scales or fractures.",
  NONPROFIT_GROWTH_MID: "A mid-size growth-stage nonprofit is where the gap between the people who started it and the people who are running it becomes undeniable. Navigating that gap well requires a level of organizational candor that most nonprofits haven't built because the mission always felt more urgent. It still is. And this still matters.",
  NONPROFIT_ESTABLISHED_LARGE: "A large established nonprofit has usually developed a very sophisticated relationship with its own dysfunction. The mission provides cover. The longevity provides legitimacy. And the people doing the most important work feel the cost of the unresolved leadership dynamic more acutely than anyone in the leadership team realizes.",
  FINANCE_LEGACY_LARGE: "A large legacy financial organization is carrying decades of deferred leadership conversations inside one of the most risk-aware cultures in any industry. The sophistication applied to market risk and regulatory risk almost never gets applied to the risk sitting inside the leadership team. That asymmetry has a price.",
  FINANCE_ESTABLISHED_MID: "A mid-size established financial organization has usually reached the point where the culture of correctness is self-reinforcing. The people who would challenge it have either left or learned not to. What remains looks like alignment. It functions like a very expensive silence.",
  MANUFACTURING_GROWTH_MID: "A mid-size growth-stage manufacturing organization is scaling two things simultaneously: production capacity and leadership complexity. The first gets measured precisely and managed carefully. The second gets accommodated and hoped about. The cost of that asymmetry shows up in ways that look like operational problems and are almost always people problems.",
  MANUFACTURING_LEGACY_LARGE: "A large legacy manufacturing organization has usually built its friction into the shift structure, the department boundaries, and the informal authority networks that everyone understands and nobody has documented. Changing it feels like changing the building. It's actually just a conversation that's overdue.",
  CONSTRUCTION_ESTABLISHED_MID: "A mid-size established construction firm has usually survived long enough that the founding relationships are now the governance structure. That works on a job site where everyone knows the hierarchy. It gets complicated in a leadership team where the hierarchy and the history are two different things.",
  CONSTRUCTION_GROWTH_LARGE: "At this size in a growth-stage construction organization, the job site absorbs what the leadership team doesn't resolve. Every unaddressed dynamic at the top shows up as a coordination failure somewhere in the field. The field people know exactly what's causing it. They've just learned that saying so doesn't help.",
  MEDIA_STARTUP_SMALL: "At this size a media startup is essentially a creative partnership that has added an organizational layer without fully acknowledging that the layer exists. The creative honesty in the room and the organizational honesty in the room are two completely different things, and only one of them is happening.",
  MEDIA_GROWTH_MID: "A mid-size growth-stage media organization is where the founder's taste has to travel through enough people that it either gets codified or gets diluted. The conversations required to codify it are organizational conversations, not creative ones. Most media cultures are much better at the second kind.",
};

// ── PLACEHOLDERS ──────────────────────────────────────────────────

const STAGE_PLACEHOLDER = [
  "The profile is taking shape. The inputs ahead will add the specificity that makes the picture worth acting on.",
  "Every organization at this stage and size is carrying something specific. The questions ahead will surface what that is more precisely than the profile alone can.",
];

// ── BEHAVIORAL INSIGHTS (MODULE 2) ───────────────────────────────
// Resolver checks `${frictionLocation}_${avoidanceMechanism}_${industry}` first,
// then falls back to `${frictionLocation}_${avoidanceMechanism}`.

const BEHAVIORAL_INSIGHTS = {

  // WITHIN_LEADERSHIP + NO_FORUM
  WITHIN_LEADERSHIP_NO_FORUM_TECH:       "A leadership team in a tech organization with no safe place to surface internal friction is a specific kind of problem. The culture that rewards moving fast makes stopping to name the dynamic feel like weakness. It isn't. It's the only thing that actually fixes it.",
  WITHIN_LEADERSHIP_NO_FORUM_CONSULTING:  "A consulting firm whose leadership team has no safe forum for honest disagreement is selling something internally that it doesn't practice. Your senior people have noticed that gap. They're just professional enough not to say so directly.",
  WITHIN_LEADERSHIP_NO_FORUM_NONPROFIT:   "A nonprofit leadership team with no forum for honest disagreement is often carrying its dysfunction in the name of the mission — and in the name of each other. The relationships that built something meaningful become the reason nobody will say the hard thing. The people doing the work feel the cost of that more directly than anyone in the leadership team realizes.",
  WITHIN_LEADERSHIP_NO_FORUM_HEALTH:      "A healthcare leadership team with no safe forum for internal friction is managing the highest-stakes version of this problem. The silence at the top has consequences that travel further than in almost any other sector.",
  WITHIN_LEADERSHIP_NO_FORUM:             "Friction inside the leadership team with no place to safely surface it is the most expensive combination in this diagnostic. It stays invisible to the organization right up until it isn't — and by then the cheap resolution is long gone.",

  // WITHIN_LEADERSHIP + PREDETERMINED
  WITHIN_LEADERSHIP_PREDETERMINED_TECH:        "In a fast-moving tech organization, predetermined outcomes in leadership conversations are particularly damaging because speed is supposed to be the advantage. When the answer is decided before the discussion, you're not moving fast. You're just moving confidently in the wrong direction.",
  WITHIN_LEADERSHIP_PREDETERMINED_CONSULTING:  "A consulting firm where leadership outcomes are predetermined before the conversation starts has a credibility problem that goes beyond the internal dynamic. The methodology you sell requires exactly the kind of honest inquiry your leadership team has stopped practicing.",
  WITHIN_LEADERSHIP_PREDETERMINED:             "When outcomes feel predetermined, people stop bringing their real thinking into the room. What looks like alignment is usually just exhaustion. The organization is making decisions based on a conversation that isn't actually happening.",

  // WITHIN_LEADERSHIP + COST_TOO_HIGH
  WITHIN_LEADERSHIP_COST_TOO_HIGH_FINANCE:     "In an organization whose entire value proposition is analytical rigor, the decision to avoid a leadership conversation because it feels too costly is worth examining on its own terms. The math almost never supports avoidance. Someone has just decided not to run it.",
  WITHIN_LEADERSHIP_COST_TOO_HIGH_CONSULTING:  "In an organization whose entire value proposition is analytical rigor, the decision to avoid a leadership conversation because it feels too costly is worth examining on its own terms. The math almost never supports avoidance. Someone has just decided not to run it.",
  WITHIN_LEADERSHIP_COST_TOO_HIGH_NONPROFIT:   "When the perceived cost of a leadership conversation feels too high in a mission-driven organization, it's usually because the mission is being used as the reason to defer it. That's the friction tax at its most specific.",
  WITHIN_LEADERSHIP_COST_TOO_HIGH:             "The perceived cost of the conversation is being weighed against the actual cost of not having it. That's a calculation your organization is making every day. In my experience, it's almost always getting the answer wrong.",

  // CROSS_FUNCTIONAL + NO_FORUM
  CROSS_FUNCTIONAL_NO_FORUM_TECH:          "Cross-functional friction in a scaling tech organization with no forum to surface it is how good products get built by teams that quietly can't stand each other. It works until a decision needs to happen fast across those boundaries. Then it doesn't.",
  CROSS_FUNCTIONAL_NO_FORUM_MANUFACTURING: "In an organization where the handoff is everything, cross-functional friction with no safe place to name it is where the operational cost compounds most invisibly. The floor feels it. The room where it could be addressed doesn't.",
  CROSS_FUNCTIONAL_NO_FORUM_LOGISTICS:     "In an organization where the handoff is everything, cross-functional friction with no safe place to name it is where the operational cost compounds most invisibly. The floor feels it. The room where it could be addressed doesn't.",
  CROSS_FUNCTIONAL_NO_FORUM:               "Cross-functional friction with no forum to address it tends to get managed through informal workarounds that everyone pretends are processes. The organization gets good at accommodating the problem instead of resolving it.",

  // CROSS_FUNCTIONAL + PREDETERMINED
  CROSS_FUNCTIONAL_PREDETERMINED_CONSULTING: "When cross-functional friction gets managed through predetermined outcomes, each department learns to protect its own narrative rather than contribute to a shared one. That's how organizations end up with excellent departments and a failing enterprise.",
  CROSS_FUNCTIONAL_PREDETERMINED_FINANCE:    "When cross-functional friction gets managed through predetermined outcomes, each department learns to protect its own narrative rather than contribute to a shared one. That's how organizations end up with excellent departments and a failing enterprise.",
  CROSS_FUNCTIONAL_PREDETERMINED:            "Predetermined outcomes in cross-functional conversations mean each team is optimizing for its own version of winning. The place where all those versions conflict — that's where the real cost lives.",

  // TEAM + NO_FORUM
  TEAM_NO_FORUM_MEDIA:     "When friction between leadership and the team has no safe place to surface, the team develops its own culture around the gap. In organizations that run on creative energy or mission commitment, that shadow culture is often more cohesive than the official one. That's a signal worth taking seriously.",
  TEAM_NO_FORUM_NONPROFIT: "When friction between leadership and the team has no safe place to surface, the team develops its own culture around the gap. In organizations that run on creative energy or mission commitment, that shadow culture is often more cohesive than the official one. That's a signal worth taking seriously.",
  TEAM_NO_FORUM:           "When there's no forum for the friction between leadership and the team, the team stops trying to close the gap and starts working around it. By the time leadership notices, the workaround is the culture.",

  // TEAM + COST_TOO_HIGH
  TEAM_COST_TOO_HIGH_TECH: "In a fast-moving organization, when the perceived cost of a difficult conversation with the team feels too high, it usually means the team already knows something leadership isn't ready to hear. They're waiting. The longer that continues, the more expensive the eventual conversation becomes.",
  TEAM_COST_TOO_HIGH:      "When difficult conversations with the team feel too costly, it's usually because the team has already formed a view that leadership suspects but hasn't confirmed. The cost of the conversation feels high because the answer is probably uncomfortable. That's exactly why it needs to happen.",

  // UNKNOWN + ANY
  UNKNOWN_NO_FORUM:       "Not knowing where the friction lives is more common than most leaders admit, and it's actually useful information. In my experience, when the source is unclear it usually means it's sitting somewhere nobody has permission to look. The avoidance pattern tends to point directly at it.",
  UNKNOWN_PREDETERMINED:  "Not knowing where the friction lives is more common than most leaders admit, and it's actually useful information. In my experience, when the source is unclear it usually means it's sitting somewhere nobody has permission to look. The avoidance pattern tends to point directly at it.",
  UNKNOWN_COST_TOO_HIGH:  "Not knowing where the friction lives is more common than most leaders admit, and it's actually useful information. In my experience, when the source is unclear it usually means it's sitting somewhere nobody has permission to look. The avoidance pattern tends to point directly at it.",
};

// ── HOOK ──────────────────────────────────────────────────────────

export function useDiagnosticEngine(step, data) {
  const sequenceRef  = useRef(0);
  const lastInsightRef = useRef('');

  const { insight, insightKey } = useMemo(() => {
  const text = resolveInsight(step, data, sequenceRef.current);
  if (text !== lastInsightRef.current) {
    sequenceRef.current += 1;
    lastInsightRef.current = text;
  }
  return {
    insight:    text,
    insightKey: `${step}-${sequenceRef.current}-${text.slice(0, 12)}`,
  };
}, [
  step,
  data.industry,
  data.orgStage,
  data.headcountRange,
  data.leadershipTenure,
  data.personnel[0]?.count,
  data.personnel[1]?.count,
  data.personnel[2]?.count,
  data.frictionLocation,
  data.avoidanceMechanism,
  data.priorAttempt,
  data.personnelRisk,
  data.resolutionBlockage,
  data.payroll,
  data.stalledProjectCapital,
  data.revenueBest,
  data.revenueWorst,
  data.meetingHours,
]);

  const burnIntensity = useMemo(() => {
    const base    = Number(data.payroll) || 0;
    const gap     = (Number(data.revenueBest) - Number(data.revenueWorst)) || 0;
    const stalled = Number(data.stalledProjectCapital) || 0;
    const weight  = gap + stalled + (base * 0.1);
    return Math.min(weight / 10000000, 1);
  }, [data.payroll, data.revenueBest, data.revenueWorst, data.stalledProjectCapital]);

  return { liveInsight: insight, insightKey, burnIntensity };
}

// ── RESOLVER ──────────────────────────────────────────────────────

function resolveInsight(step, data, sequence) {
  const {
  industry, orgStage, headcountRange, leadershipTenure,
  personnel, frictionLocation, avoidanceMechanism,
  priorAttempt, personnelRisk, resolutionBlockage,
  payroll, revenueBest, revenueWorst, stalledProjectCapital, meetingHours,
} = data;

  // ── STEP 0: CONTEXT ───────────────────────────────────────────
  if (step === 0) {

    // Tenure-specific checks first (most complete context)
    if (industry && orgStage && headcountRange && leadershipTenure) {
      if (leadershipTenure === 'UNDER_ONE' && orgStage === 'LEGACY') {
        return "Here's the thing about inheriting a legacy organization — the friction you're dealing with was built by people who are probably still in the room. That's not your fault. But it is your problem now.";
      }
      if (leadershipTenure === 'SEVEN_PLUS' && orgStage === 'LEGACY') {
        return "Seven-plus years in a legacy organization means the patterns here didn't sneak up on anyone. They got normalized. That's actually the harder problem — not because it can't be fixed, but because everyone stopped seeing it as a problem.";
      }
      if (orgStage === 'STARTUP' && headcountRange === 'MID') {
        return "The thing that got you to 100 people is usually the thing that starts breaking things at 100 people. Founding-era friction doesn't age well. It compounds.";
      }
      return "Good. The picture is starting to take shape. What comes next is where it gets specific.";
    }

    // Tier 3: industry + stage + headcount
    if (industry && orgStage && headcountRange) {
      const key = `${industry}_${orgStage}_${headcountRange}`;
      if (HEADCOUNT_INSIGHTS[key]) return HEADCOUNT_INSIGHTS[key];
    }

    // Tier 2: industry + stage
    if (industry && orgStage) {
      const key = `${industry}_${orgStage}`;
      const pool = STAGE_INSIGHTS[key];
      if (pool) return pool[sequence % pool.length];
      return STAGE_PLACEHOLDER[sequence % STAGE_PLACEHOLDER.length];
    }

    // Tier 1: industry only
    if (industry) {
      const pool = INDUSTRY_INSIGHTS[industry] || INDUSTRY_INSIGHTS.OTHER;
      return pool[sequence % pool.length];
    }

return null;  }

  // ── STEP 1: PERSONNEL ─────────────────────────────────────────
  if (step === 1) {
    const execs    = personnel?.find(p => p.id === 'EXECUTIVE')?.count    || 0;
    const managers = personnel?.find(p => p.id === 'MANAGER')?.count      || 0;
    const staff    = personnel?.find(p => p.id === 'PROFESSIONAL')?.count || 0;
    const total    = execs + managers + staff;

    if (total === 0)
      return "Count the room where decisions actually get made — not the full headcount. That's the group we're looking at.";
    if (execs > 0 && managers === 0 && staff === 0)
      return "An executive-only group is where the most expensive conversations either happen or don't. Every issue that stays in this room unresolved radiates cost downward.";
    if (execs > 5)
      return "Above five executives, decision latency becomes a real problem. More voices at the top usually means more distance between insight and action — and somebody's paying for that distance.";
    if (execs > 0 && execs > managers && total > 3)
      return "When executives outnumber managers, the organization tends to move at the speed of its slowest approval. Oversight starts exceeding execution capacity.";
    if (managers > execs * 2 && managers > 4)
      return "A wide management layer is usually a sign that people are being managed rather than developed. Layers absorb friction — they don't resolve it.";
    if (staff > (execs + managers) * 2 && total > 8)
      return "With this ratio, small misalignments at the top create large disruptions at the execution level. The friction tax gets amplified across a lot of people.";
    if (total > 15)
      return "At this size, silence becomes the path of least resistance. Information decays. Candor has to be deliberate or it stops happening.";
    if (total > 0 && total <= 5)
      return "Small groups have their own version of this problem — familiarity makes the hard conversations easier to avoid. Knowing each other well is not the same as being honest with each other.";
    return "The composition of this group determines the weighted cost of every conversation that doesn't happen in it.";
  }

  // ── STEP 2: BEHAVIORAL ────────────────────────────────────────
  if (step === 2) {

    // All five behavioral fields complete
    if (frictionLocation && avoidanceMechanism && priorAttempt && personnelRisk && resolutionBlockage) {

      // Resolution blockage is the most acute signal
      if (resolutionBlockage === 'ATTEMPTED') {
        return "Something is actively preventing a decision your organization knows needs to happen. That's the most acute signal in this diagnostic. The financial picture ahead will confirm the cost, but the conversation about what's blocking it is the one that actually moves things.";
      }
      if (resolutionBlockage === 'KNOWN' && personnelRisk === 'YES') {
        return "You know what needs to happen and there's someone valuable at risk of leaving because it hasn't. That's two compounding costs running simultaneously. The longer the gap between knowing and acting, the more expensive both become.";
      }
      if (resolutionBlockage === 'KNOWN') {
        return "Knowing what needs to happen and not being able to act on it is its own kind of friction. The organization is carrying the weight of an unmade decision, and that weight has a daily cost.";
      }

      // Personnel risk signals
      if (personnelRisk === 'LOST') {
        return "You've already lost someone because of this. That's not a warning sign — it's a confirmed cost. The question now is whether the dynamic that caused it is still in place.";
      }
      if (personnelRisk === 'YES' && priorAttempt === 'EXTERNAL') {
        return "Someone valuable is at risk of leaving, and a previous external attempt didn't hold. That combination tells me the intervention needs to go deeper than what was tried before.";
      }
      if (personnelRisk === 'YES') {
        return "There's someone in that room this situation is making it harder to keep. In my experience, by the time a leader can name that person, the situation has already been running longer than the financial inputs will show.";
      }

      // Prior attempt signals
      if (priorAttempt === 'EXTERNAL') {
        return "Something was brought in and it didn't hold. That's important context — not because the previous attempt failed, but because it tells us the resolution needs to go somewhere the last one didn't reach.";
      }
      if (priorAttempt === 'CONVERSATION') {
        return "The conversation happened and nothing changed. That's one of the most common and most expensive patterns in this diagnostic. It usually means the conversation addressed the symptom without reaching the source.";
      }
      if (priorAttempt === 'UNCLEAR') {
        return "Not being sure whether what was tried addressed the right thing is itself a finding. It suggests the organization may have been treating a visible symptom while the actual dynamic continued underneath it.";
      }

      // Full behavioral context with industry
      const specific = BEHAVIORAL_INSIGHTS[`${frictionLocation}_${avoidanceMechanism}_${industry}`];
      const fallback = BEHAVIORAL_INSIGHTS[`${frictionLocation}_${avoidanceMechanism}`];
      return specific || fallback || "That's the behavioral picture. The financials coming up will put a number on what this pattern is actually costing.";
    }

    // Progressive reveal as fields are completed
    if (frictionLocation && avoidanceMechanism && priorAttempt && personnelRisk && !resolutionBlockage) {
      return "Last question in this module. Whether there's a decision being avoided tells us whether the organization is in friction or in stasis. Those are different problems.";
    }

    if (frictionLocation && avoidanceMechanism && priorAttempt && !personnelRisk) {
      return "Almost there. Whether someone valuable is at risk of leaving is one of the most direct measures of how much this situation is already costing — beyond what any financial input will show.";
    }

    if (frictionLocation && avoidanceMechanism && !priorAttempt) {
      return "One thing I always want to know before the financial picture: has this been attempted before? The answer changes what resolution actually needs to look like.";
    }

    if (frictionLocation && !avoidanceMechanism) {
      const locationContext = {
        TEAM:             "When the friction lives between leadership and the team, the avoidance pattern tells us whether leadership knows it's happening or not. That distinction matters a lot.",
        CROSS_FUNCTIONAL: "Cross-functional friction is the hardest kind to self-diagnose — every department thinks it's performing. Tell me why the hard conversations aren't happening and we'll know where to look.",
        WITHIN_LEADERSHIP:"When it's inside the leadership team, the avoidance is almost always self-protective. That's human. It's also where the cost compounds fastest.",
        UNKNOWN:          "Not knowing where the friction lives is actually useful information. The avoidance pattern usually reveals more than the location would have anyway.",
      };
      return locationContext[frictionLocation] || "Why the hard conversations aren't happening tells us as much as where the friction lives.";
    }

    if (!frictionLocation)
      return "Where the friction lives shapes the whole conversation. Be as specific as you can — it's okay if the answer is 'I'm not sure.'";
    if (frictionLocation === 'WITHIN_LEADERSHIP')
      return "Leadership friction is the most expensive kind — it radiates downward and the organization learns to work around it before anyone at the top acknowledges it.";
    if (frictionLocation === 'CROSS_FUNCTIONAL')
      return "Cross-functional friction is sneaky. Each team thinks it's doing its job. The failure lives in the handoff — in the space between departments where nobody has clear ownership.";
    if (frictionLocation === 'TEAM')
      return "When the friction is between leadership and the team, the team has usually already adapted around it. That adaptation is often more expensive than the original problem.";

    return "The behavioral picture is the layer the financial numbers can't capture on their own. This is where it gets honest.";
  }

  // ── STEP 3: FINANCIAL ─────────────────────────────────────────
  if (step === 3) {
    const pRoll   = Number(payroll)      || 0;
    const best    = Number(revenueBest)  || 0;
    const worst   = Number(revenueWorst) || 0;
    const gap     = best - worst;
    const stalled = Number(stalledProjectCapital) || 0;
    const hours   = meetingHours || 0;

    if (pRoll > 0 && gap > 0 && stalled > 0) {
      const totalVisible = (pRoll * 0.1) + gap + stalled;
      if (totalVisible > 1000000)
        return "The picture is complete. What you're about to see has been accumulating for longer than the inputs suggest. That's usually how this goes.";
      return "That's everything I need. The number coming up will name what your organization has been quietly managing around.";
    }
    if (stalled > 100000)
      return "Stalled capital is the ghost of decisions that didn't get made. Every month it sits there, it earns a negative return — not just financially, but on the culture that has to work around it.";
    if (stalled > 0)
      return "Even a modest amount of stalled capital carries a disproportionate cultural cost. The projects nobody will kill are the ones that define what the organization is willing to tolerate.";
    if (gap > 500000)
      return "A gap that size is rarely a strategy problem. In my experience, it's almost always a people variable wearing a strategy disguise.";
    if (gap > 0) {
      return sequence % 2 === 0
        ? "The execution gap is where potential and reality part ways. Friction lives in that space — and it compounds every month it goes unaddressed."
        : "That gap between where you expected to be and where you are has a cause. It's rarely the strategy. It's almost always the dynamic inside the room where the strategy gets executed.";
    }
    if (hours > 20)
      return "Twenty-plus hours a week in meetings isn't a scheduling problem — it's a structural one. The organization is substituting coordination for decision-making.";
    if (hours > 10) {
      return sequence % 2 === 0
        ? "Above ten hours a week, meeting load starts cannibalizing execution capacity. The question worth asking isn't whether the meetings are useful — it's whether they're necessary."
        : "Ten-plus hours a week in meetings usually means the organization has found a way to feel productive without making decisions. Those are different things and they cost differently.";
    }
    if (pRoll > 5000000)
      return "At this payroll level, a 5% friction rate is a full executive salary — lost every year to conversations that didn't happen. That's not abstract. That's real.";
    if (pRoll > 0) {
      return sequence % 2 === 0
        ? "The payroll baseline sets the hourly cost of friction. This is the literal price of every conversation your organization is not having."
        : "Every dollar on that payroll is buying someone's time. The question this diagnostic asks is how much of that time is being spent working around something that could be resolved.";
    }

    return "Estimates are fine here. This doesn't require precision — it requires honesty. Those are different things.";
  }

  return "Compiling your institutional record...";
}