export type ReadinessStatus = 'Ready' | 'Review' | 'Action required';

export type DemoPatient = {
  id: string;
  time: string;
  name: string;
  treatment: string;
  treatmentModules: string[];
  completedModules: string[];
  journey: 'Complete' | 'Review' | 'Not opened';
  attendance: 'Confirmed' | 'Cancel' | 'Rearrange' | 'Pending';
  language: string;
  accessibility: string[];
  support: string[];
  anxiety: number | null;
  priority: string;
  question: string;
  understanding: string;
  clinicianStatus: ReadinessStatus;
  receptionAction: string;
};

export const demoPatients: DemoPatient[] = [
  {
    id: 'sarah-khan',
    time: '09:30',
    name: 'Sarah Khan',
    treatment: 'Implant UR6',
    treatmentModules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'],
    completedModules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'],
    journey: 'Complete',
    attendance: 'Confirmed',
    language: 'Urdu',
    accessibility: ['Large text'],
    support: [],
    anxiety: 6,
    priority: 'Appearance',
    question: 'What happens if the implant fails?',
    understanding: '1 corrected misunderstanding',
    clinicianStatus: 'Review',
    receptionAction: 'Clinician review',
  },
  {
    id: 'john-patel',
    time: '10:15',
    name: 'John Patel',
    treatment: 'Crown fit',
    treatmentModules: ['Crown fit'],
    completedModules: ['Crown fit'],
    journey: 'Complete',
    attendance: 'Cancel',
    language: 'English',
    accessibility: [],
    support: [],
    anxiety: 2,
    priority: 'Long-term success',
    question: '',
    understanding: 'Complete',
    clinicianStatus: 'Ready',
    receptionAction: 'Release slot',
  },
  {
    id: 'adam-reed',
    time: '11:00',
    name: 'Adam Reed',
    treatment: 'Surgical extraction',
    treatmentModules: ['Surgical extraction', 'Aftercare'],
    completedModules: ['Surgical extraction', 'Aftercare'],
    journey: 'Complete',
    attendance: 'Confirmed',
    language: 'English',
    accessibility: [],
    support: ['Quiet waiting area', 'Explain before touching'],
    anxiety: 9,
    priority: 'Pain & recovery',
    question: '',
    understanding: 'Complete',
    clinicianStatus: 'Action required',
    receptionAction: 'Prepare adjustment',
  },
  {
    id: 'maria-lopez',
    time: '14:15',
    name: 'Maria Lopez',
    treatment: 'Implant + bone graft',
    treatmentModules: ['Implant placement', 'Implant failure', 'Maintenance & longevity', 'Bone graft'],
    completedModules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'],
    journey: 'Review',
    attendance: 'Confirmed',
    language: 'English',
    accessibility: [],
    support: [],
    anxiety: 4,
    priority: 'Long-term success',
    question: '',
    understanding: 'Implant journey complete',
    clinicianStatus: 'Action required',
    receptionAction: 'Add graft module',
  },
  {
    id: 'helen-price',
    time: '15:30',
    name: 'Helen Price',
    treatment: 'Root canal',
    treatmentModules: ['Root canal', 'Aftercare'],
    completedModules: [],
    journey: 'Not opened',
    attendance: 'Pending',
    language: 'English',
    accessibility: [],
    support: [],
    anxiety: null,
    priority: '',
    question: '',
    understanding: 'Not started',
    clinicianStatus: 'Action required',
    receptionAction: 'Send reminder',
  },
];

export const getDemoPatient = (id: string) => demoPatients.find((patient) => patient.id === id);

export const getMissingModules = (patient: DemoPatient) =>
  patient.treatmentModules.filter((module) => !patient.completedModules.includes(module));

export const demoPracticeMetrics = {
  appointmentsTracked: 18,
  journeysComplete: 14,
  attendanceConfirmed: 13,
  needsAction: 4,
  chairTimeReleasedHours: 2,
  earlyCancellationsThisMonth: 11,
  slotsRefilledThisMonth: 8,
};
