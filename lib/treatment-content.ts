export type ContentKind = 'Education' | 'Risk' | 'Alternative' | 'Recovery' | 'Maintenance' | 'Comprehension';

export type TreatmentContentItem = {
  id: string;
  title: string;
  kind: ContentKind;
  summary: string;
  required: boolean;
  version: string;
  status: 'Approved' | 'Draft';
};

export type TreatmentDefinition = {
  id: string;
  name: string;
  category: string;
  estimatedMinutes: number;
  content: TreatmentContentItem[];
};

export const treatmentDefinitions: TreatmentDefinition[] = [
  {
    id: 'implant',
    name: 'Dental implant',
    category: 'Implant dentistry',
    estimatedMinutes: 7,
    content: [
      { id: 'implant-overview', title: 'What a dental implant is', kind: 'Education', summary: 'Explains the implant, healing phase and final restoration in plain language.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-stages', title: 'Treatment stages and timing', kind: 'Education', summary: 'Assessment, implant placement, healing and final tooth stages.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-failure', title: 'Implant failure', kind: 'Risk', summary: 'Explains that successful integration and long-term survival cannot be guaranteed.', required: true, version: '1.1', status: 'Approved' },
      { id: 'implant-recovery', title: 'Normal recovery', kind: 'Recovery', summary: 'Typical swelling, soreness, bruising and expected recovery guidance.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-alternatives', title: 'Alternatives and no treatment', kind: 'Alternative', summary: 'Introduces reasonable alternatives and the option not to proceed.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-maintenance', title: 'Maintenance and longevity', kind: 'Maintenance', summary: 'Ongoing hygiene, review and maintenance expectations.', required: true, version: '1.0', status: 'Approved' },
      { id: 'implant-check', title: 'Implant success check', kind: 'Comprehension', summary: 'Checks that the patient understands implant success is not guaranteed.', required: true, version: '1.1', status: 'Approved' },
    ],
  },
  {
    id: 'implant-graft',
    name: 'Implant + bone graft',
    category: 'Implant dentistry',
    estimatedMinutes: 10,
    content: [
      { id: 'graft-implant-core', title: 'Implant pathway', kind: 'Education', summary: 'Uses the approved core implant pathway.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-purpose', title: 'Why bone grafting may be needed', kind: 'Education', summary: 'Explains the purpose of grafting and its relationship to implant placement.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-risks', title: 'Bone graft risks', kind: 'Risk', summary: 'Treatment-specific graft healing and failure risks.', required: true, version: '0.9', status: 'Draft' },
      { id: 'graft-recovery', title: 'Bone graft recovery', kind: 'Recovery', summary: 'Expected recovery and when to contact the practice.', required: true, version: '1.0', status: 'Approved' },
      { id: 'graft-check', title: 'Bone graft understanding check', kind: 'Comprehension', summary: 'Checks that grafting is understood as a separate treatment element.', required: true, version: '0.9', status: 'Draft' },
    ],
  },
  {
    id: 'surgical-extraction',
    name: 'Surgical extraction',
    category: 'Oral surgery',
    estimatedMinutes: 6,
    content: [
      { id: 'extraction-overview', title: 'What surgical extraction involves', kind: 'Education', summary: 'Plain-language explanation of surgical tooth removal.', required: true, version: '1.0', status: 'Approved' },
      { id: 'extraction-risks', title: 'Important surgical risks', kind: 'Risk', summary: 'Relevant surgical risks and expected limitations.', required: true, version: '1.0', status: 'Approved' },
      { id: 'extraction-aftercare', title: 'Aftercare', kind: 'Recovery', summary: 'Bleeding, discomfort, swelling, eating and escalation guidance.', required: true, version: '1.0', status: 'Approved' },
    ],
  },
  {
    id: 'root-canal',
    name: 'Root canal',
    category: 'Restorative dentistry',
    estimatedMinutes: 6,
    content: [
      { id: 'rct-overview', title: 'What root canal treatment does', kind: 'Education', summary: 'Explains the aim and main stages of treatment.', required: true, version: '1.0', status: 'Approved' },
      { id: 'rct-risks', title: 'Limitations and risks', kind: 'Risk', summary: 'Explains that treatment may not resolve disease in every case.', required: true, version: '1.0', status: 'Approved' },
      { id: 'rct-alternatives', title: 'Alternatives', kind: 'Alternative', summary: 'Other reasonable options, including extraction where appropriate.', required: true, version: '1.0', status: 'Approved' },
    ],
  },
];

export const getTreatmentDefinition = (id: string) => treatmentDefinitions.find((item) => item.id === id);
