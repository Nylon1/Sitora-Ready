import Link from 'next/link';
import { auditCases } from '../../../lib/audit-demo-data';

export default function AuditPage() {
  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Audit & Evidence Centre</div></div>
        <div className="headerMeta">Case evidence · Prototype</div>
      </header>
      <section className="practiceShell">
        <div className="heroPanel">
          <div><span className="eyebrow">Governance</span><h1>Evidence every step.</h1><p>Review patient understanding, content versions, corrections, acknowledgements and treatment-plan changes in one place.</p></div>
          <Link href="/admin/governance" className="secondary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Organisation governance</Link>
        </div>
        <div className="metricGrid">
          <div className="metric"><span>Cases</span><strong>{auditCases.length}</strong></div>
          <div className="metric"><span>Review required</span><strong>{auditCases.filter((item) => item.status === 'Review').length}</strong></div>
          <div className="metric"><span>Coverage mismatch</span><strong>{auditCases.filter((item) => item.status === 'Action required').length}</strong></div>
          <div className="metric"><span>Events captured</span><strong>{auditCases.reduce((sum, item) => sum + item.events.length, 0)}</strong></div>
        </div>
        {auditCases.map((item) => (
          <section className="dashboardCard" key={item.id} style={{ marginBottom: 18 }}>
            <div className="cardHeader"><div><span className="eyebrow">{item.patient}</span><h2>{item.treatment}</h2><p style={{margin:'6px 0 0',color:'#667773'}}>{item.appointment}</p></div><span className={item.status === 'Complete' ? 'status green' : 'status amber'}>{item.status}</span></div>
            <div className="section"><span className="sectionTitle">Understanding</span><p>{item.understanding}</p></div>
            <div className="section"><span className="sectionTitle">Clarification</span><p>{item.clarification}</p></div>
            <div className="section" style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <Link href={`/admin/audit/${item.id}`} className="primary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Open evidence record</Link>
              <span className="status neutral">{item.events.length} events</span>
              <span className="status neutral">{item.contentVersion}</span>
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
