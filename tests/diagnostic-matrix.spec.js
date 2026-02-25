/**
 * Principal Resolution // Diagnostic Matrix Spec v2
 * Suite: Institutional Logic Regression
 * Coverage: All 12 states, engagement tiers, citation firing
 * Selector map verified against live AuditSystem.jsx and ResultsLedger.jsx:
 *   Sector select:       page.locator('select')
 *   Option buttons:      page.getByRole('button', { name: 'Label Text' })
 *   Personnel steppers:  page.locator('input[inputmode="numeric"]')
 *   Verdict assertion:   page.locator('h2', { hasText: 'verdict string' })
 */

const { test, expect } = require('@playwright/test');
const profiles = require('./data/matrix-profiles.json');

// ---------------------------------------------------------------------------
// CITATION SOURCE MAP
// Partial source string per forceTag. Matched against the Forensic Proof
// block text which renders as: "Forensic Proof // {source}"
// ---------------------------------------------------------------------------
const CITATION_SOURCE_MAP = {
  TALENT_ARSON:      'McKinsey',
  DECISION_LATENCY:  'MIT Sloan',
  CULTURAL_SCARRING: 'Principal Resolution',
  FINANCIAL_GRAVITY: 'Deloitte',
};

// ---------------------------------------------------------------------------
// PAGE OBJECT -- AuditPage
// ---------------------------------------------------------------------------
class AuditPage {
  constructor(page) {
    this.page = page;
  }

  async start() {
    await this.page.goto('/');
    await this.page.getByRole('button', { name: /Show Me What This Is Costing/i }).click();
  }

  async selectOption(labelText) {
    await this.page.getByRole('button', { name: labelText, exact: true }).click();
  }

  // Module 01 -- Context
  async fillContext(inputs) {
    const industryLabels = {
      TECH:          'Technology / SaaS',
      FINANCE:       'Finance / Banking',
      CONSULTING:    'Consulting / Agency',
      HEALTH:        'Healthcare / Pharma',
      MANUFACTURING: 'Manufacturing / Industrial',
      RETAIL:        'Retail / E-Commerce',
      ENERGY:        'Energy / Utilities',
      MEDIA:         'Media / Entertainment',
      CONSTRUCTION:  'Construction / Real Estate',
      NONPROFIT:     'Non Profit / Education',
      LOGISTICS:     'Logistics / Transport',
      OTHER:         'Other / Diversified',
    };

    // Industry: native select -- Gemini confirmed selector
    await this.page.locator('select').selectOption({ label: industryLabels[inputs.industry] });

    const orgStageLabels = {
      STARTUP:     'Startup (Under 3 years)',
      GROWTH:      'Growth (3 to 10 years)',
      ESTABLISHED: 'Established (10 to 25 years)',
      LEGACY:      'Legacy (25+ years)',
    };
    await this.selectOption(orgStageLabels[inputs.orgStage]);

    const tenureLabels = {
      UNDER_ONE:   'Under 1 year',
      ONE_THREE:   '1 to 3 years',
      THREE_SEVEN: '3 to 7 years',
      SEVEN_PLUS:  '7+ years',
    };
    await this.selectOption(tenureLabels[inputs.leadershipTenure]);

    await this.page.getByRole('button', { name: /Map the Room/i }).click();
  }

  // Module 02 -- Personnel
  async fillPersonnel(inputs) {
    // React synthetic event fix -- .fill() bypasses onChange without these
    const headcountInput = this.page.getByPlaceholder('Estimated total headcount');
    await headcountInput.fill(String(inputs.headcount));
    await headcountInput.dispatchEvent('input', { bubbles: true });
    await headcountInput.blur();

    // PersonnelStepper inputs -- inputmode numeric per Gemini selector map
    const steppers = this.page.locator('input[inputmode="numeric"]');
    const firstStepper = steppers.first();
    await firstStepper.fill('3');
    await firstStepper.dispatchEvent('input', { bubbles: true });
    await firstStepper.blur();

    await this.page.getByRole('button', { name: /Locate the Friction/i }).click();
  }

  // Module 03 -- Behavioral
  async fillBehavior(inputs) {
    const frictionLabels = {
      TEAM:              'Between leadership and the team',
      CROSS_FUNCTIONAL:  'Between departments or functions',
      WITHIN_LEADERSHIP: 'Within the leadership team itself',
      UNKNOWN:           "We know something is wrong but can't locate it",
    };
    await this.selectOption(frictionLabels[inputs.frictionLocation]);

    const avoidanceLabels = {
      NO_FORUM:     'No safe forum for them',
      PREDETERMINED:'The outcome feels predetermined',
      COST_TOO_HIGH:'The cost seems too high',
      NOT_AN_ISSUE: 'They do happen here',
    };
    await this.selectOption(avoidanceLabels[inputs.avoidanceMechanism]);

    const priorAttemptLabels = {
      NONE:        "We haven't addressed it yet",
      CONVERSATION:"We've had the conversation -- nothing changed",
      EXTERNAL:    "We brought someone in and it didn't work",
      UNCLEAR:     "We tried something -- not sure it addressed the right thing",
    };
    await this.selectOption(priorAttemptLabels[inputs.priorAttempt]);

    const personnelRiskLabels = {
      NONE:    "Not that I'm aware of",
      POSSIBLY:'There are signs -- nothing confirmed',
      YES:     'Yes, and we know who',
      LOST:    "We've already lost someone because of it",
    };
    await this.selectOption(personnelRiskLabels[inputs.personnelRisk]);

    const blockageLabels = {
      NONE:     'No -- nothing like that is pending',
      SUSPECTED:"Possibly -- we haven't named it yet",
      KNOWN:    "Yes -- we know what needs to happen but haven't acted",
      ATTEMPTED:"We've tried to move on it and haven't been able to",
    };
    await this.selectOption(blockageLabels[inputs.resolutionBlockage]);

    const durationLabels = {
      UNDER_3:  'Under 3 months',
      THREE_6:  '3 to 6 months',
      SIX_12:   '6 to 12 months',
      ONE_2YR:  '1 to 2 years',
      OVER_2YR: 'Over 2 years',
    };
    await this.selectOption(durationLabels[inputs.frictionDuration]);

    const downstreamLabels = {
      NONE:     'Just the friction group',
      SMALL:    'Up to 25 people',
      MEDIUM:   '25 to 100 people',
      LARGE:    '100 to 500 people',
      FULL_ORG: 'The entire organization',
    };
    await this.selectOption(downstreamLabels[inputs.downstreamPopulation]);

    await this.page.getByRole('button', { name: /Count the Cost/i }).click();
  }

  // Module 04 -- Financial
  async fillFinancial(inputs) {
    if (inputs.payroll && inputs.payroll !== '') {
      const payrollInput = this.page.getByPlaceholder('Estimate is sufficient');
      await payrollInput.clear();
      await payrollInput.fill(inputs.payroll);
      await payrollInput.dispatchEvent('input', { bubbles: true });
      await payrollInput.blur();
    }

    if (inputs.stalledProjectCapital && inputs.stalledProjectCapital !== '') {
      const stalledInput = this.page.getByPlaceholder('Optional').first();
      await stalledInput.fill(inputs.stalledProjectCapital);
      await stalledInput.dispatchEvent('input', { bubbles: true });
      await stalledInput.blur();
    }

    if (typeof inputs.meetingHours === 'number' && inputs.meetingHours !== 5) {
      const slider = this.page.locator('input[type="range"]');
      await slider.fill(String(inputs.meetingHours));
      await slider.dispatchEvent('input', { bubbles: true });
      await slider.blur();
    }

    await this.page.getByRole('button', { name: /Generate Institutional Record/i }).click();
  }

  async runAudit(inputs) {
    await this.start();
    await this.fillContext(inputs);
    await this.fillPersonnel(inputs);
    await this.fillBehavior(inputs);
    await this.fillFinancial(inputs);
  }
}

// ---------------------------------------------------------------------------
// PARAMETERIZED SUITE -- one test per profile, fresh context per test
// ---------------------------------------------------------------------------
for (const profile of profiles) {
  test(`[${profile.id}] ${profile.name}`, async ({ page }) => {
    const audit = new AuditPage(page);

    try {
      await audit.runAudit(profile.inputs);

      // Wait for results container to mount
      await page.waitForSelector('[data-report-container]', { timeout: 10000 });

      // Wait for the Institutional State label to appear before asserting the h2.
      // This guards against asserting before React has committed the verdict render.
      await page.waitForSelector(
        'span:text("Institutional State")',
        { timeout: 8000 }
      );

      // Assertion 1: Verdict h2 -- Gemini confirmed selector pattern
      const verdictH2 = page.locator('h2', { hasText: new RegExp(`^${profile.expected.verdict}$`) });
      await expect(verdictH2).toBeVisible({ timeout: 5000 });

      // Assertion 2: Engagement tier name in h3
      const engagementH3 = page.locator('[data-report-container] h3', {
        hasText: profile.expected.tier,
      });
      await expect(engagementH3).toBeVisible({ timeout: 5000 });

      // Assertion 3: Forensic Proof block source matches forceTag
      const expectedSource = CITATION_SOURCE_MAP[profile.expected.forceTag];
      if (expectedSource) {
        const forensicLabel = page.locator('[data-report-container]').getByText(/Forensic Proof/i);
        await expect(forensicLabel).toBeVisible({ timeout: 5000 });
        await expect(forensicLabel).toContainText(expectedSource);
      }
    } catch (err) {
      // Capture the results page state at the moment of failure.
      // Saved to test-results/ alongside trace and video artifacts.
      // Capture the actual verdict rendered so the diff is immediately readable
      const actualVerdict = await page.locator('h2').first().textContent().catch(() => 'NOT_FOUND');
      const actualTier = await page.locator('[data-report-container] h3').first().textContent().catch(() => 'NOT_FOUND');
      await page.screenshot({
        path: `test-results/${profile.id}-GOT_${actualVerdict.trim().replace(/\s+/g, '_').slice(0, 30)}-EXPECTED_${profile.expected.verdict.replace(/\s+/g, '_')}.png`,
        fullPage: true,
      });
      throw err;
    }
  });
}