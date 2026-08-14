import type { DemoPatient } from './demo-data';

export type ConsentPointSource = 'pre-care' | 'clinician';

export type ConsentPoint = {
  id: string;
  label: string;
  source: ConsentPointSource;
  detail?: string;
};

export type TreatmentConsentDefinition = {
  id: string;
  label: string;
  aliases: string[];
  modules: string[];
  points: ConsentPoint[];
};

const implantBase: ConsentPoint[] = [
  { id: 'purpose', label: 'Purpose of implant treatment', source: 'pre-care' },
  { id: 'stages', label: 'Stages and expected timing', source: 'pre-care' },
  { id: 'success', label: 'Success is not guaranteed', source: 'pre-care' },
  { id: 'alternatives', label: 'Alternatives and no treatment', source: 'pre-care' },
  { id: 'recovery', label: 'Recovery and aftercare', source: 'pre-care' },
  { id: 'maintenance', label: 'Long-term maintenance', source: 'pre-care' },
  { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
  { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
  { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  { id: 'final-opportunity', label: 'Final opportunity to ask or reconsider', source: 'clinician' },
];

const graftPoints: ConsentPoint[] = [
  { id: 'graft-purpose', label: 'Why the bone graft is needed', source: 'clinician' },
  { id: 'graft-risks', label: 'Key graft risks and healing', source: 'clinician' },
  { id: 'graft-timing', label: 'Any change to treatment timing', source: 'clinician' },
];

export const treatmentConsentDefinitions: TreatmentConsentDefinition[] = [
  {
    id: 'implant-ur6',
    label: 'Implant UR6',
    aliases: ['implant ur6', 'implant'],
    modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'],
    points: implantBase,
  },
  {
    id: 'implant-bone-graft',
    label: 'Implant + bone graft',
    aliases: ['implant + bone graft', 'implant bone graft', 'bone graft'],
    modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity', 'Bone graft'],
    points: [
      ...implantBase.slice(0, 6),
      ...graftPoints,
      ...implantBase.slice(6),
    ],
  },
  {
    id: 'surgical-extraction',
    label: 'Surgical extraction',
    aliases: ['surgical extraction', 'extraction'],
    modules: ['Surgical extraction', 'Aftercare'],
    points: [
      { id: 'purpose', label: 'Reason for extraction', source: 'pre-care' },
      { id: 'risks', label: 'Important extraction risks', source: 'pre-care' },
      { id: 'aftercare', label: 'Aftercare and healing', source: 'pre-care' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
      { id: 'alternatives', label: 'Alternatives discussed', source: 'clinician' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
  {
    id: 'root-canal',
    label: 'Root canal',
    aliases: ['root canal'],
    modules: ['Root canal', 'Aftercare'],
    points: [
      { id: 'purpose', label: 'Purpose of root canal treatment', source: 'pre-care' },
      { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
      { id: 'alternatives', label: 'Alternatives including extraction', source: 'pre-care' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
  {
    id: 'crown-fit',
    label: 'Crown fit',
    aliases: ['crown fit', 'crown'],
    modules: ['Crown fit'],
    points: [
      { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care' },
      { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
      { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician' },
      { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
];

const fallbackDefinition: TreatmentConsentDefinition = {
  id: 'generic-treatment',
  label: 'Other treatment',
  aliases: [],
  modules: [],
  points: [
    { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care' },
    { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
    { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician' },
    { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  ],
};

export const treatmentOptions = treatmentConsentDefinitions.map(({ id, label, modules }) => ({ id, label, modules }));

export function getTreatmentDefinition(treatment: string): TreatmentConsentDefinition {
  const value = treatment.trim().toLowerCase();
  return treatmentConsentDefinitions.find((definition) =>
    definition.label.toLowerCase() === value || definition.aliases.some((alias) => value.includes(alias)),
  ) ?? fallbackDefinition;
}

export function getConsentChecklist(patient: DemoPatient): ConsentPoint[] {
  const definition = getTreatmentDefinition(patient.treatment);
  return definition.points.map((point) => ({
    ...point,
    detail: point.id === 'questions' ? patient.question || point.detail : point.detail,
  }));
}

export function getTreatmentChangePrompt(beforePatient: DemoPatient, afterPatient: DemoPatient): string[] {
  const before = getConsentChecklist(beforePatient);
  const after = getConsentChecklist(afterPatient);
  const beforeIds = new Set(before.map((point) => point.id));
  const added = after.filter((point) => !beforeIds.has(point.id)).map((point) => point.id);

  return added.length
    ? added
    : after.filter((point) => point.source === 'clinician').map((point) => point.id);
}

export function createInitialCoverage(patient: DemoPatient, checklist = getConsentChecklist(patient)): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  checklist.forEach((point) => {
    initial[point.id] = point.source === 'pre-care' && patient.journey === 'Complete';
  });

  if (patient.understanding.toLowerCase().includes('corrected')) initial.success = false;
  return initial;
}
