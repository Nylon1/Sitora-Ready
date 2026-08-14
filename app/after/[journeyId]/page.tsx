import AftercareJourneyShell from '../../../components/AftercareJourneyShell';
import { demoPatients, getDemoPatient } from '../../../lib/demo-data';

export default async function AfterPage({
  params,
}: {
  params: Promise<{ journeyId: string }>;
}) {
  const { journeyId } = await params;

  const patient =
    getDemoPatient(journeyId) ??
    (journeyId === 'demo' ? demoPatients[0] : undefined);

  if (!patient) {
    return (
      <main className="patientApp">
        <div className="patientMobile">
          <div className="phoneBody">
            <div className="screen">
              <span className="eyebrow">Sitora After</span>
              <h1>Aftercare journey not found.</h1>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <AftercareJourneyShell patient={patient} />;
}
