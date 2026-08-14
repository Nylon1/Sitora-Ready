import type { DemoPatient } from './demo-data';
import {
  findRegistryTreatment,
  treatmentRegistry,
  type ConsentPointSource,
  type RegistryConsentPoint,
  type TreatmentRegistryItem,
} from './treatment-registry';

export type ConsentPoint = RegistryConsentPoint;
export type { ConsentPointSource };
export type TreatmentConsentDefinition = TreatmentRegistryItem;

const fallbackDefinition: TreatmentRegistryItem = {
  id: 'generic-treatment',
  label: 'Other treatment',
  aliases: [],
  category: 'Other',
  estimatedMinutes: 5,
  status: 'Draft',
  version: '0.1',
  modules: [],
  content: [],
  consentPoints: [
    { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care' },
    { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
    { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician' },
    { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician' },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  ],
};

export const treatmentConsentDefinitions = treatmentRegistry;

export const treatmentOptions = treatmentRegistry.map(({ id, label, modules, status, version }) => ({
  id,
  label,
  modules,
  status,
  version,
}));

export function getTreatmentDefinition(treatment: string): TreatmentRegistryItem {
  return findRegistryTreatment(treatment) ?? fallbackDefinition;
}

export function getConsentChecklist(patient: DemoPatient): ConsentPoint[] {
  const definition = getTreatmentDefinition(patient.treatment);
  return definition.consentPoints.map((point) => ({
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
