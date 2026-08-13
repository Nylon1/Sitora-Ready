export type AuditEvent = {
  id: string;
  time: string;
  type: string;
  actor: 'Patient' | 'Clinician' | 'System' | 'Reception';
  detail: string;
  evidence: string;
};

export type AuditCase = {
  id: string;
  patient: string;
  treatment: string;
  appointment: string;
  status: 'Complete' | 'Review' | 'Action required';
  contentVersion: string;
  understanding: string;
  clarification: string;
  events: AuditEvent[];
};

export const auditCases: AuditCase[] = [
  {
    id: 'sarah-khan',
    patient: 'Sarah Khan',
    treatment: 'Implant UR6',
    appointment: 'Tomorrow · 09:30',
    status: 'Review',
    contentVersion: 'Implant pathway v1.3',
    understanding: 'One misunderstanding corrected and acknowledged',
    clarification: 'Clinician discussion pending',
    events: [
      { id: 'a1', time: '18:42', type: 'JOURNEY_STARTED', actor: 'Patient', detail: 'Patient opened secure Sitora Ready journey.', evidence: 'Journey token opened' },
      { id: 'a2', time: '18:43', type: 'LANGUAGE_SELECTED', actor: 'Patient', detail: 'Urdu selected as preferred journey language.', evidence: 'Preference recorded' },
      { id: 'a3', time: '18:46', type: 'MODULE_VIEWED', actor: 'Patient', detail: 'Implant success and failure information displayed.', evidence: 'Content v1.3' },
      { id: 'a4', time: '18:47', type: 'ANSWER_INCORRECT', actor: 'Patient', detail: 'Patient initially selected that implant success was guaranteed.', evidence: 'First response preserved' },
      { id: 'a5', time: '18:47', type: 'CORRECTION_DISPLAYED', actor: 'System', detail: 'Approved correction explaining implant success is not guaranteed was displayed.', evidence: 'Correction v1.2' },
      { id: 'a6', time: '18:48', type: 'PATIENT_ACKNOWLEDGED', actor: 'Patient', detail: 'Patient acknowledged the correction before continuing.', evidence: 'Acknowledgement recorded' },
      { id: 'a7', time: '18:51', type: 'QUESTION_SUBMITTED', actor: 'Patient', detail: 'What happens if the implant fails?', evidence: 'Patient question retained verbatim' },
      { id: 'a8', time: '18:53', type: 'APPOINTMENT_CONFIRMED', actor: 'Patient', detail: 'Attendance confirmed for tomorrow at 09:30.', evidence: 'Confirmation timestamp' },
    ],
  },
  {
    id: 'maria-lopez',
    patient: 'Maria Lopez',
    treatment: 'Implant + bone graft',
    appointment: 'Tomorrow · 14:15',
    status: 'Action required',
    contentVersion: 'Implant pathway v1.3',
    understanding: 'Implant pathway complete',
    clarification: 'Bone graft module missing after treatment-plan change',
    events: [
      { id: 'm1', time: '16:05', type: 'JOURNEY_COMPLETED', actor: 'Patient', detail: 'Implant journey completed.', evidence: 'Completion record' },
      { id: 'm2', time: '17:22', type: 'TREATMENT_PLAN_CHANGED', actor: 'Clinician', detail: 'Bone grafting added to treatment plan.', evidence: 'Treatment-plan change recorded' },
      { id: 'm3', time: '17:22', type: 'COVERAGE_RECONCILIATION', actor: 'System', detail: 'Bone graft content not found in completed patient journey.', evidence: 'Mismatch detected' },
      { id: 'm4', time: '17:23', type: 'ACTION_REQUIRED', actor: 'System', detail: 'Additional bone graft module required before final review.', evidence: 'Governance alert created' },
    ],
  },
];

export const getAuditCase = (id: string) => auditCases.find((item) => item.id === id);
