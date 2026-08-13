import { demoPatients, getMissingModules } from './demo-data';
import { analyticsSummary } from './analytics-summary';
import { branchMetrics, clinicianMetrics, supportNeeds } from './analytics-comparison';

export type SitoraEvidence = { label: string; value: string; href?: string };
export type SitoraAction = { label: string; href: string };
export type SitoraAnswer = {
  headline: string;
  answer: string;
  insight: string;
  evidence: SitoraEvidence[];
  actions: SitoraAction[];
  followUps: string[];
};

export const askSitoraPrompts = [
  'What needs attention tomorrow?',
  'How much capacity have we recovered?',
  'Where are patients misunderstanding treatment?',
  'Are there any treatment-plan mismatches?',
  'Who needs additional support?',
  'Which branch is performing best?',
  'Which clinician has the highest review rate?',
];

export function askSitora(query: string): SitoraAnswer {
  const q = query.toLowerCase();
  const action = demoPatients.filter((p) => p.clinicianStatus === 'Action required');
  const review = demoPatients.filter((p) => p.clinicianStatus === 'Review');
  const mismatch = demoPatients.filter((p) => getMissingModules(p).length > 0);

  if (q.includes('why') && q.includes('sarah')) return {
    headline: 'Sarah needs a focused clinician review',
    answer: 'Sarah initially misunderstood that implant success was guaranteed. The correction was displayed and acknowledged, and she submitted a question about what happens if the implant fails.',
    insight: 'The alert prepares the clinician for a focused conversation. It does not make a legal or clinical determination.',
    evidence: [
      { label: 'First response', value: 'Misunderstanding recorded', href: '/admin/audit/sarah-khan' },
      { label: 'Correction', value: 'Displayed and acknowledged', href: '/admin/audit/sarah-khan' },
      { label: 'Patient question', value: 'What happens if the implant fails?', href: '/admin/audit/sarah-khan' },
    ],
    actions: [{ label: 'Open Sarah evidence', href: '/admin/audit/sarah-khan' }],
    followUps: ['Show the evidence timeline', 'What should the clinician discuss?', 'Are there similar cases?'],
  };

  if (q.includes('tomorrow') || q.includes('attention') || q.includes('action')) return {
    headline: `${action.length + review.length} cases need attention`,
    answer: `${action.length} patients require action and ${review.length} require review. ${action.map((p) => `${p.name}: ${p.receptionAction}`).join('. ')}.`,
    insight: 'Prioritise pathway gaps and support adjustments before routine reviews.',
    evidence: [
      ...action.map((p) => ({ label: p.name, value: p.receptionAction, href: `/admin/audit/${p.id}` })),
      ...review.map((p) => ({ label: p.name, value: p.understanding, href: `/admin/audit/${p.id}` })),
    ],
    actions: [
      { label: 'Open Audit Centre', href: '/admin/audit' },
      { label: 'View governance', href: '/admin/governance' },
    ],
    followUps: ['Which case is highest priority?', 'Show me the pathway mismatch', 'Who needs support before arrival?'],
  };

  if (q.includes('capacity') || q.includes('chair') || q.includes('cancel')) return {
    headline: `${analyticsSummary.chairHoursRecovered} hours recovered`,
    answer: `${analyticsSummary.earlyCancellations} early cancellations were identified, ${analyticsSummary.slotsRefilled} were refilled, protecting ${analyticsSummary.chairHoursRecovered} clinical hours.`,
    insight: 'Recovered capacity turns pre-care readiness into a measurable operational outcome.',
    evidence: [
      { label: 'Early cancellations', value: String(analyticsSummary.earlyCancellations) },
      { label: 'Slots refilled', value: String(analyticsSummary.slotsRefilled) },
      { label: 'Chair hours recovered', value: String(analyticsSummary.chairHoursRecovered), href: '/admin/analytics' },
    ],
    actions: [{ label: 'Open Analytics', href: '/admin/analytics' }],
    followUps: ['Which branch recovered the most capacity?', 'What is our refill rate?', 'Show the monthly trend'],
  };

  if (q.includes('understand') || q.includes('misunderstand') || q.includes('comprehension')) return {
    headline: `${analyticsSummary.firstPassRate}% first-pass understanding`,
    answer: `${analyticsSummary.checksCompleted} comprehension checks were completed. ${analyticsSummary.firstPassRate}% were correct first time and ${analyticsSummary.followUpReviews} cases required follow-up review.`,
    insight: 'Sarah Khan demonstrates the full evidence pattern: first response, correction, acknowledgement and clinician review.',
    evidence: [
      { label: 'Checks completed', value: String(analyticsSummary.checksCompleted) },
      { label: 'First-pass rate', value: `${analyticsSummary.firstPassRate}%` },
      { label: 'Follow-up reviews', value: String(analyticsSummary.followUpReviews) },
      { label: 'Example case', value: 'Sarah Khan', href: '/admin/audit/sarah-khan' },
    ],
    actions: [
      { label: 'Open Sarah evidence', href: '/admin/audit/sarah-khan' },
      { label: 'View Analytics', href: '/admin/analytics' },
    ],
    followUps: ['Why did Sarah need review?', 'How many reviews are we seeing?', 'Which clinicians have the highest review rate?'],
  };

  if (q.includes('mismatch') || q.includes('coverage') || q.includes('pathway')) {
    const primary = mismatch[0];
    return {
      headline: `${mismatch.length} active pathway mismatch`,
      answer: mismatch.length ? mismatch.map((p) => `${p.name}: missing ${getMissingModules(p).join(', ')}`).join('. ') : 'No active pathway mismatches are present.',
      insight: 'Sitora reconciles the treatment plan against completed patient content before final readiness.',
      evidence: mismatch.map((p) => ({ label: p.name, value: `Missing: ${getMissingModules(p).join(', ')}`, href: `/admin/audit/${p.id}` })),
      actions: primary ? [
        { label: 'Open affected case', href: `/admin/audit/${primary.id}` },
        { label: 'Review treatment library', href: '/admin/treatments' },
      ] : [{ label: 'Open Audit Centre', href: '/admin/audit' }],
      followUps: ['Why was the mismatch detected?', 'Which module is missing?', 'Show me all action-required cases'],
    };
  }

  if (q.includes('support') || q.includes('access') || q.includes('language')) {
    const total = supportNeeds.reduce((sum, item) => sum + item.count, 0);
    return {
      headline: `${total} support signals recorded`,
      answer: supportNeeds.map((item) => `${item.label}: ${item.count}`).join('. '),
      insight: 'Support information is captured before arrival so the clinic can prepare the environment, communication and appointment flow.',
      evidence: supportNeeds.map((item) => ({ label: item.label, value: String(item.count) })),
      actions: [{ label: 'Open readiness dashboard', href: '/practice' }],
      followUps: ['Who has the highest anxiety?', 'Which support needs are most common?', 'Show tomorrow’s support adjustments'],
    };
  }

  if (q.includes('branch')) {
    const ranked = [...branchMetrics].sort((a, b) => b.completion - a.completion);
    const best = ranked[0];
    return {
      headline: `${best.branch} leads completion`,
      answer: `${best.branch} currently has the highest completion rate at ${best.completion}%, with ${best.recovered} hours of recovered capacity.`,
      insight: 'Use branch variation to identify workflow opportunities and spread good practice.',
      evidence: ranked.map((b) => ({ label: b.branch, value: `${b.completion}% completion · ${b.recovered}h recovered`, href: '/admin/analytics' })),
      actions: [{ label: 'Compare all branches', href: '/admin/analytics' }],
      followUps: ['Why is Khobar lower?', 'Which branch recovered the most capacity?', 'Compare review rates by branch'],
    };
  }

  if (q.includes('clinician')) {
    const ranked = [...clinicianMetrics].sort((a, b) => b.review - a.review);
    const highest = ranked[0];
    return {
      headline: `${highest.clinician}: ${highest.review}% review rate`,
      answer: `${highest.clinician} currently has the highest review rate in the demo dataset. This may reflect case mix, patient complexity or communication workflow.`,
      insight: 'Sitora surfaces patterns for investigation rather than judging clinical quality from one metric.',
      evidence: ranked.map((c) => ({ label: c.clinician, value: `${c.review}% review · ${c.questions} patient questions`, href: '/admin/analytics' })),
      actions: [{ label: 'Open clinician comparison', href: '/admin/analytics' }],
      followUps: ['Who has the highest ready rate?', 'Compare patient questions by clinician', 'What might explain the variation?'],
    };
  }

  return {
    headline: 'Ask Sitora',
    answer: 'I can analyse readiness, understanding, treatment coverage, cancellations, recovered chair time, support needs, branches and clinicians using the current Sitora dataset.',
    insight: 'Ask an operational question or use one of the suggested prompts.',
    evidence: [
      { label: 'Journeys completed', value: String(analyticsSummary.journeysCompleted), href: '/admin/analytics' },
      { label: 'First-pass understanding', value: `${analyticsSummary.firstPassRate}%`, href: '/admin/analytics' },
      { label: 'Chair hours recovered', value: String(analyticsSummary.chairHoursRecovered), href: '/admin/analytics' },
    ],
    actions: [{ label: 'Open Analytics', href: '/admin/analytics' }],
    followUps: askSitoraPrompts.slice(0, 3),
  };
}
