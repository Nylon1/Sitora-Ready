import PatientJourneyShell from '../../../components/PatientJourneyShell';
import { demoPatients, getDemoPatient } from '../../../lib/demo-data';

export default async function PatientPage({
  params,
}: {
  params: Promise<{ journeyId: string }>;
}) {
  const { journeyId } = await params;

  const patient =
    getDemoPatient(journeyId) ??
    (journeyId === 'demo'
      ? demoPatients[0]
      : undefined);

  if (!patient) {
    return (
      <main className="patientApp">
        <div className="patientMobile">
          <div className="phoneBody">
            <div className="screen">
              <span className="eyebrow">Sitora Ready</span>
              <h1>Journey not found.</h1>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <PatientJourneyShell patient={patient} />;
}