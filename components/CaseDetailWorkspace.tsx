import Link from 'next/link';
import type { AuditCase } from '../lib/audit-demo-data';

export default function CaseDetailWorkspace({ item }: { item: AuditCase }) {
  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Case detail</div></div>
        <div className="headerMeta">Prototype</div>
      </header>
      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <Link className="patientNav" href="/admin/audit"><strong>Back to cases</strong></Link>
          <div className="patientNav active"><strong>{item.patient}</strong></div>
        </aside>
        <section className="desktopContent">
          <div className="heroPanel">
            <div><span className="eyebrow">Case</span><h1>{item.patient}</h1><p>{item.treatment} · {item.appointment}</p></div>
            <span className="status amber">{item.status}</span>
          </div>
          <section className="dashboardCard">
            <div className="cardHeader"><div><span className="eyebrow">Summary</span><h2>Journey record</h2></div></div>
            <div className="section"><p>{item.understanding}</p></div>
            <div className="section"><p>{item.clarification}</p></div>
            <div className="section"><p>{item.contentVersion}</p></div>
          </section>
          <section className="dashboardCard" style={{marginTop:18}}>
            <div className="cardHeader"><div><span className="eyebrow">Activity</span><h2>Timeline</h2></div></div>
            <div className="auditList">
              {item.events.map((event) => <div className="auditRow" key={event.id}><span>{event.time} · {event.actor}</span><strong>{event.type}</strong></div>)}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
