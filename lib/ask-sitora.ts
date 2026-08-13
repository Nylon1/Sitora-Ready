import { demoPatients, demoPracticeMetrics, getMissingModules } from './demo-data';
import { analyticsSummary } from './analytics-summary';
import { branchMetrics, clinicianMetrics, supportNeeds } from './analytics-comparison';

export const askSitoraPrompts = [
  'What needs attention tomorrow?',
  'How much capacity have we recovered?',
  'Where are patients misunderstanding treatment?',
  'Are there any treatment-plan mismatches?',
  'Who needs additional support?',
  'Which branch is performing best?',
  'Which clinician has the highest review rate?',
];

export function askSitora(query: string) {
  const q = query.toLowerCase();

  const action = demoPatients.filter(
    (p) => p.clinicianStatus === 'Action required',
  );

  const review = demoPatients.filter(
    (p) => p.clinicianStatus === 'Review',
  );

  const mismatch = demoPatients.filter(
    (p) => getMissingModules(p).length > 0,
  );

  if (
    q.includes('tomorrow') ||
    q.includes('attention') ||
    q.includes('action')
  ) {
    return {
      headline: `${action.length + review.length} cases need attention`,
      answer:
        `${action.length} patients require action and ${review.length} require review. ` +
        action
          .map((p) => `${p.name}: ${p.receptionAction}`)
          .join('. ') +
        '.',
      insight: 'Prioritise pathway gaps and support adjustments before routine reviews.',
    };
  }

  if (
    q.includes('capacity') ||
    q.includes('chair') ||
    q.includes('cancel')
  ) {
    return {
      headline: `${analyticsSummary.chairHoursRecovered} hours recovered`,
      answer:
        `${analyticsSummary.earlyCancellations} early cancellations were identified, ` +
        `${analyticsSummary.slotsRefilled} were refilled, protecting ` +
        `${analyticsSummary.chairHoursRecovered} clinical hours.`,
      insight: 'Recovered capacity is an operational outcome Sitora can track over time.',
    };
  }

  if (
    q.includes('understand') ||
    q.includes('misunderstand') ||
    q.includes('comprehension')
  ) {
    return {
      headline: `${analyticsSummary.firstPassRate}% first-pass understanding`,
      answer:
        `${analyticsSummary.checksCompleted} comprehension checks were completed. ` +
        `${analyticsSummary.firstPassRate}% were correct first time and ` +
        `${analyticsSummary.followUpReviews} cases required follow-up review.`,
      insight:
        'Sarah Khan is the current demo example of a misunderstanding being corrected and acknowledged.',
    };
  }

  if (
    q.includes('mismatch') ||
    q.includes('coverage') ||
    q.includes('pathway')
  ) {
    return {
      headline: `${mismatch.length} active pathway mismatch`,
      answer: mismatch.length
        ? mismatch
            .map(
              (p) =>
                `${p.name}: missing ${getMissingModules(p).join(', ')}`,
            )
            .join('. ')
        : 'No active pathway mismatches are present.',
      insight:
        'Sitora should prevent final readiness when required treatment content has not been completed.',
    };
  }

  if (
    q.includes('support') ||
    q.includes('access') ||
    q.includes('language')
  ) {
    const total = supportNeeds.reduce((sum, item) => sum + item.count, 0);

    return {
      headline: `${total} support signals recorded`,
      answer: supportNeeds
        .map((item) => `${item.label}: ${item.count}`)
        .join('. '),
      insight:
        'Support information should be visible before arrival so the practice can prepare.',
    };
  }

  if (q.includes('branch')) {
    const best = [...branchMetrics].sort(
      (a, b) => b.completion - a.completion,
    )[0];

    return {
      headline: `${best.branch} leads completion`,
      answer:
        `${best.branch} currently has the highest completion rate at ` +
        `${best.completion}%, with ${best.recovered} hours of recovered capacity.`,
      insight:
        'Branch comparisons should be used to identify workflow opportunities, not create simplistic league tables.',
    };
  }

  if (q.includes('clinician')) {
    const highestReview = [...clinicianMetrics].sort(
      (a, b) => b.review - a.review,
    )[0];

    return {
      headline: `${highestReview.clinician}: ${highestReview.review}% review rate`,
      answer:
        `${highestReview.clinician} currently has the highest review rate in the demo dataset. ` +
        `This may reflect case mix, patient complexity or communication workflow.`,
      insight:
        'Sitora should surface the pattern for investigation rather than judge clinical performance.',
    };
  }

  return {
    headline: 'Ask Sitora',
    answer:
      'I can analyse readiness, understanding, treatment coverage, cancellations, recovered chair time, support needs, branches and clinicians using the current Sitora dataset.',
    insight: 'Choose one of the suggested questions or ask a similar operational question.',
  };
}