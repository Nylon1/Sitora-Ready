export type ContentStatus = 'Approved' | 'Draft' | 'Archived';

export type ContentVersion = {
  version: string;
  status: ContentStatus;
  author: string;
  date: string;
  summary: string;
};

export type EditableContentModule = {
  id: string;
  treatmentId: string;
  treatmentName: string;
  title: string;
  type: 'Education' | 'Risk' | 'Alternative' | 'Recovery' | 'Maintenance' | 'Comprehension';
  status: ContentStatus;
  version: string;
  required: boolean;
  body: string;
  question?: string;
  answer?: string;
  rationale?: string;
  versions: ContentVersion[];
};

export const editableContentModules: EditableContentModule[] = [
  {
    id: 'implant-success',
    treatmentId: 'implant',
    treatmentName: 'Dental implant',
    title: 'Implant success is not guaranteed',
    type: 'Risk',
    status: 'Approved',
    version: 'v1.3',
    required: true,
    body: 'Dental implants have high success rates, but no implant treatment can be guaranteed. Occasionally an implant may fail to integrate or can develop complications later.',
    versions: [
      { version: 'v1.3', status: 'Approved', author: 'Clinical Governance', date: '08 Aug 2026', summary: 'Clarified late complications and patient-friendly wording.' },
      { version: 'v1.2', status: 'Archived', author: 'Dr Ahmed', date: '22 Jul 2026', summary: 'Added integration failure explanation.' },
      { version: 'v1.0', status: 'Archived', author: 'Clinical Governance', date: '01 Jul 2026', summary: 'Initial approved content.' },
    ],
  },
  {
    id: 'implant-check',
    treatmentId: 'implant',
    treatmentName: 'Dental implant',
    title: 'Implant success comprehension check',
    type: 'Comprehension',
    status: 'Approved',
    version: 'v1.2',
    required: true,
    body: 'Check that the patient has understood that implant treatment is not guaranteed to succeed.',
    question: 'Is a dental implant guaranteed to succeed?',
    answer: 'Not guaranteed',
    rationale: 'If the patient selects Guaranteed, show a correction and require acknowledgement before continuing.',
    versions: [
      { version: 'v1.2', status: 'Approved', author: 'Clinical Governance', date: '08 Aug 2026', summary: 'Updated correction wording.' },
      { version: 'v1.0', status: 'Archived', author: 'Dr Ahmed', date: '03 Jul 2026', summary: 'Initial comprehension check.' },
    ],
  },
  {
    id: 'bone-graft-purpose',
    treatmentId: 'implant-bone-graft',
    treatmentName: 'Implant + bone graft',
    title: 'Why bone grafting may be needed',
    type: 'Education',
    status: 'Draft',
    version: 'v0.4',
    required: true,
    body: 'A bone graft may be recommended when there is not enough bone to support an implant securely. Healing time may be needed before or during implant treatment.',
    versions: [
      { version: 'v0.4', status: 'Draft', author: 'Dr Patel', date: '12 Aug 2026', summary: 'Simplified healing explanation.' },
      { version: 'v0.3', status: 'Draft', author: 'Clinical Governance', date: '10 Aug 2026', summary: 'Added reason for grafting.' },
    ],
  },
  {
    id: 'extraction-recovery',
    treatmentId: 'surgical-extraction',
    treatmentName: 'Surgical extraction',
    title: 'What to expect after extraction',
    type: 'Recovery',
    status: 'Approved',
    version: 'v1.1',
    required: true,
    body: 'Some soreness, swelling and minor bleeding can occur after a surgical extraction. Your dental team will explain what is expected and when to seek help.',
    versions: [
      { version: 'v1.1', status: 'Approved', author: 'Clinical Governance', date: '31 Jul 2026', summary: 'Added escalation wording.' },
      { version: 'v1.0', status: 'Archived', author: 'Dr Khan', date: '20 Jul 2026', summary: 'Initial recovery content.' },
    ],
  },
];

export const getEditableContentModule = (id: string) => editableContentModules.find((module) => module.id === id);
