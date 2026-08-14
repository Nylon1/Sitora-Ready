import PatientJourneyShell from '../../../components/PatientJourneyShell';
import { demoPatients, getDemoPatient } from '../../../lib/demo-data';
import { findRegistryTreatment } from '../../../lib/treatment-registry';
import { listTreatments } from '../../../lib/treatment-store';

export default async function PatientPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;
  const patient = getDemoPatient(journeyId) ?? (journeyId === 'demo' ? demoPatients[0] : undefined);

  if (!patient) {
    return <main className="patientApp"><div className="patientMobile"><div className="phoneBody"><div className="screen"><span className="eyebrow">Sitora Ready</span><h1>Journey not found.</h1></div></div></div></main>;
  }

  let runtimePatient = patient;
  try {
    const publishedRegistry = await listTreatments({ publishedOnly: true });
    const definition = findRegistryTreatment(patient.treatment, publishedRegistry);
    if (definition) {
      runtimePatient = {
        ...patient,
        treatment: definition.label,
        treatmentModules: definition.modules,
      };
    }
  } catch {
    // Static demo data remains a safe prototype fallback if persistence is unavailable.
  }

  return <PatientJourneyShell patient={runtimePatient} />;
}
