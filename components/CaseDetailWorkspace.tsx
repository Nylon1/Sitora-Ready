'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AuditCase } from '../lib/audit-demo-data';

export default function CaseDetailWorkspace({ item }: { item: AuditCase }) {
  const [note, setNote] = useState('');
  const [recorded, setRecorded] = useState(false);
  const [notice, setNotice] = useState('');

  const evidenceText = useMemo(() => {
    const lines = [
      'Sitora Ready - Evidence Summary',
      `Patient: ${item.patient}`,
      `Treatment: ${item.treatment}`,
      `Appointment: ${item.appointment}`,
      `Status: ${item.status}`,
      `Content: ${item.contentVersion}`,
      `Understanding: ${item.understanding}`,
      `Clarification: ${recorded && note ? note : item.clarification}`,
      '',
      'Timeline',
      ...item.events.map((event) => `${event.time} | ${event.actor} | ${event.type} | ${event.detail} | ${event.evidence}`),
    ];
    return lines.join('\n');
  }, [item, note, recorded]);

  const exportEvidence = () => {
    const blob = new Blob([evidenceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sitora-evidence-${item.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Evidence summary exported');
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Case evidence</div></div>
        <div className="headerMeta">Governed journey record · Prototype</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <Link className="patientNav" href="/admin/audit"><strong>← Back to cases</strong></Link>
          <div className="patientNav active"><strong>{item.patient}</strong></div>
          <Link className="patientNav" href="/admin/governance"><strong>Governance</strong></Link>
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div><span className="eyebrow">Individual evidence record</span><h1>{item.patient}</h1><p>{item.treatment} · {item.appointment}</p></div>
            <span className={item.status === 'Complete' ? 'status green' : 'status amber'}>{item.status}</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Events captured</span><strong>{item.events.length}</strong></div>
            <div className="metric"><span>Content version</span><strong>{item.contentVersion.split(' ').pop()}</strong></div>
            <div className="metric"><span>Understanding</span><strong>{item.understanding.includes('corrected') ? 'Corrected' : 'Recorded'}</strong></div>
            <div className="metric"><span>Clarification</span><strong>{recorded ? 'Recorded' : 'Pending'}</strong></div>
          </div>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Evidence summary</span><h2>Journey record</h2></div><button className="secondary desktopButton" onClick={exportEvidence}>Export summary</button></div>
              <div className="section"><span className="sectionTitle">Understanding</span><p>{item.understanding}</p></div>
              <div className="section"><span className="sectionTitle">Content shown</span><p>{item.contentVersion}</p></div>
              <div className="section"><span className="sectionTitle">Current clarification</span><p>{recorded && note ? note : item.clarification}</p></div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Clinician review</span><h2>Record clarification</h2></div><span className={recorded ? 'status green' : 'status amber'}>{recorded ? 'Recorded' : 'Required'}</span></div>
              <div className="section"><span className="sectionTitle">Clarification note</span><textarea className="questionBox" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Record what was clarified with the patient and any questions answered..." /></div>
              <div className="section"><button className="primary desktopButton" onClick={() => { if (!note.trim()) { setNotice('Add a clarification note first'); return; } setRecorded(true); setNotice('Clinician clarification recorded'); window.setTimeout(() => setNotice(''), 2200); }}>Record clarification</button></div>
              <div className="section"><span className="sectionTitle">Prototype governance rule</span><p>Production should capture clinician identity, timestamp, immutable audit event and any final consent confirmation after the discussion.</p></div>
            </section>
          </div>

          <section className="dashboardCard" style={{marginTop:18}}>
            <div className="cardHeader"><div><span className="eyebrow">Recorded activity</span><h2>Evidence timeline</h2></div><span className="status neutral">{item.events.length} events</span></div>
            <div className="auditList">
              {item.events.map((event) => (
                <div className="auditRow" key={event.id}>
                  <span>{event.time} · {event.actor}<br /><small>{event.detail}</small></span>
                  <strong>{event.type}<br /><small>{event.evidence}</small></strong>
                </div>
              ))}
              {recorded && <div className="auditRow"><span>Now · Clinician<br /><small>{note}</small></span><strong>CLARIFICATION_RECORDED<br /><small>Clinician review captured</small></strong></div>}
            </div>
          </section>

          {notice && <div style={{position:'fixed',right:24,bottom:24,padding:'14px 18px',borderRadius:14,background:'#173f3d',color:'#fff',boxShadow:'0 16px 40px rgba(0,0,0,.18)',fontWeight:800,fontSize:13}}>{notice}</div>}
        </section>
      </section>
    </main>
  );
}
