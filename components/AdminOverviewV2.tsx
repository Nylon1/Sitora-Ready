'use client';

import Link from 'next/link';
import { demoPatients, demoPracticeMetrics, getMissingModules } from '../lib/demo-data';

export default function AdminOverviewV2(){
  const actionPatients = demoPatients.filter(p => p.clinicianStatus !== 'Ready' || p.attendance !== 'Confirmed' || getMissingModules(p).length > 0);

  return (
    <main className="adminV2">
      <aside className="adminV2Sidebar">
        <div className="adminV2Brand">Sitora Ready™</div>
        <div className="adminV2Sub">Control Centre</div>
        <nav className="adminV2Nav">
          <Link className="adminV2NavItem active" href="/admin">Overview</Link>
          <Link className="adminV2NavItem" href="/admin/new">+ New journey</Link>
          <Link className="adminV2NavItem" href="/practice">Reception</Link>
          <Link className="adminV2NavItem" href="/clinician">Clinician</Link>
          <span className="adminV2NavDivider">Manage</span>
          <span className="adminV2NavItem mutedItem">Treatments</span>
          <span className="adminV2NavItem mutedItem">Content library</span>
          <span className="adminV2NavItem mutedItem">Accessibility</span>
          <span className="adminV2NavItem mutedItem">Audit</span>
          <span className="adminV2NavItem mutedItem">Analytics</span>
          <span className="adminV2NavItem mutedItem">Integrations</span>
        </nav>
      </aside>

      <section className="adminV2Main">
        <header className="adminV2Topbar">
          <div>
            <span className="eyebrow">Thursday · Pre-care operations</span>
            <h1>Good evening.</h1>
            <p>Here is what needs attention before tomorrow's patients arrive.</p>
          </div>
          <Link href="/admin/new" className="adminV2Primary">+ Create journey</Link>
        </header>

        <div className="adminV2Metrics">
          <Metric label="Appointments tracked" value={String(demoPracticeMetrics.appointmentsTracked)} />
          <Metric label="Journeys complete" value={String(demoPracticeMetrics.journeysComplete)} />
          <Metric label="Needs action" value={String(demoPracticeMetrics.needsAction)} tone="warn" />
          <Metric label="Chair time released" value={`${demoPracticeMetrics.chairTimeReleasedHours}h`} />
        </div>

        <div className="adminV2Grid">
          <section className="adminV2Panel adminV2Attention">
            <div className="adminV2PanelHead">
              <div><span className="eyebrow">Priority queue</span><h2>Requires attention</h2></div>
              <span className="adminV2Count">{actionPatients.length}</span>
            </div>
            <div className="adminV2List">
              {actionPatients.map(p => {
                const missing = getMissingModules(p);
                const detail = missing.length ? `Missing: ${missing.join(', ')}` : p.receptionAction;
                return <div className="adminV2ListRow" key={p.id}>
                  <div className="adminV2Avatar">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
                  <div className="adminV2Person"><strong>{p.name}</strong><span>{p.time} · {p.treatment}</span><em>{detail}</em></div>
                  <span className={p.clinicianStatus === 'Action required' ? 'adminV2Chip danger' : 'adminV2Chip warn'}>{p.clinicianStatus}</span>
                </div>;
              })}
            </div>
          </section>

          <section className="adminV2Panel">
            <div className="adminV2PanelHead"><div><span className="eyebrow">Tomorrow</span><h2>Readiness</h2></div></div>
            <div className="adminV2Readiness">
              {demoPatients.map(p => <Link href={`/patient/${p.id}`} className="adminV2ReadyRow" key={p.id}>
                <div><strong>{p.time}</strong><span>{p.name}</span></div>
                <div><span>{p.journey}</span><b className={p.attendance === 'Confirmed' ? 'okDot' : 'warnDot'} /></div>
              </Link>)}
            </div>
          </section>
        </div>

        <section className="adminV2Panel adminV2Recent">
          <div className="adminV2PanelHead">
            <div><span className="eyebrow">Live operations</span><h2>Recent journeys</h2></div>
            <Link href="/practice" className="adminV2TextLink">View reception →</Link>
          </div>
          <div className="adminV2TableWrap">
            <div className="adminV2Table head"><span>Patient</span><span>Treatment</span><span>Journey</span><span>Attendance</span><span>Action</span></div>
            {demoPatients.map(p => <div className="adminV2Table" key={p.id}><span><strong>{p.name}</strong><small>{p.time}</small></span><span>{p.treatment}</span><span>{p.journey}</span><span>{p.attendance}</span><span><Link href={`/patient/${p.id}`}>Open</Link></span></div>)}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({label,value,tone}:{label:string;value:string;tone?:'warn'}){
  return <div className={tone === 'warn' ? 'adminV2Metric warnMetric' : 'adminV2Metric'}><span>{label}</span><strong>{value}</strong></div>;
}
