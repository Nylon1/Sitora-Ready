export type ContentKind = 'Education' | 'Risk' | 'Alternative' | 'Recovery' | 'Maintenance' | 'Comprehension';
export type GovernanceStatus = 'Approved' | 'Draft' | 'In review';
export type ConsentPointSource = 'pre-care' | 'clinician';

export type TreatmentContentItem = {
  id: string;
  title: string;
  kind: ContentKind;
  summary: string;
  required: boolean;
  version: string;
  status: GovernanceStatus;
};

export type RegistryConsentPoint = {
  id: string;
  label: string;
  source: ConsentPointSource;
  detail?: string;
};

export type TreatmentRegistryItem = {
  id: string;
  label: string;
  aliases: string[];
  category: string;
  estimatedMinutes: number;
  status: GovernanceStatus;
  version: string;
  modules: string[];
  content: TreatmentContentItem[];
  consentPoints: RegistryConsentPoint[];
};

const implantConsentBase: RegistryConsentPoint[] = [
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

const graftConsentPoints: RegistryConsentPoint[] = [
  { id: 'graft-purpose', label: 'Why the bone graft is needed', source: 'clinician' },
  { id: 'graft-risks', label: 'Key graft risks and healing', source: 'clinician' },
  { id: 'graft-timing', label: 'Any change to treatment timing', source: 'clinician' },
];

export const treatmentRegistry: TreatmentRegistryItem[] = [
  {
    id: 'implant', label: 'Implant UR6', aliases: ['implant ur6', 'implant'], category: 'Implant dentistry', estimatedMinutes: 7, status: 'Approved', version: '1.3', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'],
    content: [
      { id: 'implant-overview', title: 'What a dental implant is', kind: 'Education', summary: 'Explains the implant, healing phase and final restoration in plain language.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-stages', title: 'Treatment stages and timing', kind: 'Education', summary: 'Assessment, implant placement, healing and final tooth stages.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-failure', title: 'Implant failure', kind: 'Risk', summary: 'Explains that successful integration and long-term survival cannot be guaranteed.', required: true, version: '1.1', status: 'Approved' },
      { id: 'implant-recovery', title: 'Normal recovery', kind: 'Recovery', summary: 'Typical swelling, soreness, bruising and expected recovery guidance.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-alternatives', title: 'Alternatives and no treatment', kind: 'Alternative', summary: 'Introduces reasonable alternatives and the option not to proceed.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-maintenance', title: 'Maintenance and longevity', kind: 'Maintenance', summary: 'Ongoing hygiene, review and maintenance expectations.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-check', title: 'Implant success check', kind: 'Comprehension', summary: 'Checks that the patient understands implant success is not guaranteed.', required: true, version: '1.1', status: 'Approved' },
    ], consentPoints: implantConsentBase,
  },
  {
    id: 'implant-graft', label: 'Implant + bone graft', aliases: ['implant + bone graft', 'implant bone graft', 'bone graft'], category: 'Implant dentistry', estimatedMinutes: 10, status: 'Draft', version: '0.9', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity', 'Bone graft'],
    content: [
      { id: 'graft-implant-core', title: 'Implant pathway', kind: 'Education', summary: 'Uses the approved core implant pathway.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-purpose', title: 'Why bone grafting may be needed', kind: 'Education', summary: 'Explains the purpose of grafting and its relationship to implant placement.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-risks', title: 'Bone graft risks', kind: 'Risk', summary: 'Treatment-specific graft healing and failure risks.', required: true, version: '0.9', status: 'Draft' },
      { id: 'graft-recovery', title: 'Bone graft recovery', kind: 'Recovery', summary: 'Expected recovery and when to contact the practice.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-check', title: 'Bone graft understanding check', kind: 'Comprehension', summary: 'Checks that grafting is understood as a separate treatment element.', required: true, version: '0.9', status: 'Draft' },
    ], consentPoints: [...implantConsentBase.slice(0, 6), ...graftConsentPoints, ...implantConsentBase.slice(6)],
  },
  {
    id: 'surgical-extraction', label: 'Surgical extraction', aliases: ['surgical extraction', 'extraction'], category: 'Oral surgery', estimatedMinutes: 6, status: 'Approved', version: '1.0', modules: ['Surgical extraction', 'Aftercare'],
    content: [
      { id: 'extraction-overview', title: 'What surgical extraction involves', kind: 'Education', summary: 'Plain-language explanation of surgical tooth removal.', required: true, version: '1.0', status: 'Approved' },
      { id: 'extraction-risks', title: 'Important surgical risks', kind: 'Risk', summary: 'Relevant surgical risks and expected limitations.', required: true, version: '1.0', status: 'Approved' },
      { id: 'extraction-aftercare', title: 'Aftercare', kind: 'Recovery', summary: 'Bleeding, discomfort, swelling, eating and escalation guidance.', required: true, version: '1.0', status: 'Approved' },
    ],
    consentPoints: [
      { id: 'purpose', label: 'Reason for extraction', source: 'pre-care' }, { id: 'risks', label: 'Important extraction risks', source: 'pre-care' }, { id: 'aftercare', label: 'Aftercare and healing', source: 'pre-care' }, { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' }, { id: 'alternatives', label: 'Alternatives discussed', source: 'clinician' }, { id: 'questions', label: 'Patient questions answered', source: 'clinician' }, { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
  {
    id: 'root-canal', label: 'Root canal', aliases: ['root canal'], category: 'Restorative dentistry', estimatedMinutes: 6, status: 'Approved', version: '1.0', modules: ['Root canal', 'Aftercare'],
    content: [
      { id: 'rct-overview', title: 'What root canal treatment does', kind: 'Education', summary: 'Explains the aim and main stages of treatment.', required: true, version: '1.0', status: 'Approved' },
      { id: 'rct-risks', title: 'Limitations and risks', kind: 'Risk', summary: 'Explains that treatment may not resolve disease in every case.', required: true, version: '1.0', status: 'Approved' },
      { id: 'rct-alternatives', title: 'Alternatives', kind: 'Alternative', summary: 'Other reasonable options, including extraction where appropriate.', required: true, version: '1.0', status: 'Approved' },
    ],
    consentPoints: [
      { id: 'purpose', label: 'Purpose of root canal treatment', source: 'pre-care' }, { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' }, { id: 'alternatives', label: 'Alternatives including extraction', source: 'pre-care' }, { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' }, { id: 'questions', label: 'Patient questions answered', source: 'clinician' }, { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
  {
    id: 'crown-fit', label: 'Crown fit', aliases: ['crown fit', 'crown'], category: 'Restorative dentistry', estimatedMinutes: 5, status: 'Draft', version: '0.5', modules: ['Crown fit'], content: [],
    consentPoints: [
      { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care' }, { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' }, { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician' }, { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician' }, { id: 'questions', label: 'Patient questions answered', source: 'clinician' }, { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
    ],
  },
];

export const getRegistryTreatmentById = (id: string) => treatmentRegistry.find((item) => item.id === id);
export const findRegistryTreatment = (treatment: string, registry: TreatmentRegistryItem[] = treatmentRegistry) => {
  const value = treatment.trim().toLowerCase();
  return registry.find((item) => item.label.toLowerCase() === value || item.aliases.some((alias) => value.includes(alias)));
};
