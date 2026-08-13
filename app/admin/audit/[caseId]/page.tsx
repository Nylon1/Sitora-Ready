import CaseDetailWorkspace from '../../../../components/CaseDetailWorkspace';
import { getAuditCase } from '../../../../lib/audit-demo-data';

export default async function AuditCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const item = getAuditCase(caseId);

  if (!item) {
    return (
      <main className="desktopApp">
        <section className="dashboardCard">
          <div className="section">
            <h1>Case not found</h1>
          </div>
        </section>
      </main>
    );
  }

  return <CaseDetailWorkspace item={item} />;
}