'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { demoPatients, demoPracticeMetrics, getMissingModules } from '../../lib/demo-data';

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState('sarah-khan');
  const [notice, setNotice] = useState('');
  const selected = useMemo(() => demoPatients.find(p => p.id === selectedId) ?? demoPatients[0], [selectedId]);
  const missing = getMissingModules(selected);
  const link = `/patient/${selected.id}`;

  const act = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Admin Control Centre</div></div>
        <div className="headerMeta">Pre-care operations · Prototype</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Control centre</span>
          {['Overview','Journeys','Patients','Clinician','Reception','Treatments','Content','Accessibility','Audit','Analytics','Integrations','Settings'].map(item => (
            <div className={item === 'Overview' ? 'patientNav active' : 'patientNav'} key={item}>
              <strong>{item}</strong>
            </div>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div><span className="eyebrow">Admin overview</span><h1>Run pre-care from one place.</h1><p>Create journeys, send appointment confirmations and reminders, generate patient links, and surface anything requiring action before arrival.</p></div>
            <span className="status green">System ready</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Appointments tracked</span><strong>{demoPracticeMetrics.appointmentsTracked}</strong></div>
            <div className="metric"><span>Journeys complete</span><strong>{demoPracticeMetrics.journeysComplete}</strong></div>
            <div className="metric"><span>Needs action</span><strong>{demoPracticeMetrics.needsAction}</strong></div>
            <div className="metric"><span>Chair time released</span><strong>{demoPracticeMetrics.chairTimeReleasedHours}h</strong></div>
          </div>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Appointment & messaging</span><h2>Create and contact</h2></div></div>
              <div className="section">
                <span className="sectionTitle">Patient</span>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{width:'100%',minHeight:48,border:'1px solid #d8e3e0',borderRadius:14,padding:'0 14px',background:'#fff'}}>
                  {demoPatients.map(p => <option key={p.id} value={p.id}>{p.time} · {p.name} · {p.treatment}</option>)}
                </select>
              </div>
              <div className="section"><span className="sectionTitle">Appointment</span><p><strong>{selected.name}</strong> · Tomorrow · {selected.time}<br />{selected.treatment}</p></div>
              <div className="section">
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <button className="primary desktopButton" onClick={() => act(`Appointment confirmation sent to ${selected.name}`)}>Send confirmation</button>
                  <button className="secondary desktopButton" onClick={() => act(`Reminder sent to ${selected.name}`)}>Send reminder</button>
                  <button className="secondary desktopButton" onClick={() => act(`Reminder scheduled for ${selected.name}`)}>Schedule reminder</button>
                </div>
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Patient journey</span><h2>Generate & send link</h2></div><span className="status neutral">{selected.journey}</span></div>
              <div className="section"><span className="sectionTitle">Secure journey prototype</span><p>{link}</p></div>
              <div className="section">
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <Link className="primary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}} href={link}>Open journey</Link>
                  <button className="secondary desktopButton" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}${link}`); act('Journey link copied'); }}>Copy link</button>
                  <button className="secondary desktopButton" onClick={() => act(`Journey link sent to ${selected.name}`)}>Send link</button>
                </div>
              </div>
              <div className="section"><span className="sectionTitle">Coverage</span><p>{missing.length ? `Missing module: ${missing.join(', ')}` : 'Treatment pathway fully covered.'}</p></div>
            </section>
          </div>

          <section className="dashboardCard">
            <div className="cardHeader"><div><span className="eyebrow">Requires attention</span><h2>Tomorrow's exceptions</h2></div><span className="status amber">Action queue</span></div>
            <div className="practiceTable">
              <div className="practiceRow practiceHead"><span>Time</span><span>Patient</span><span>Treatment</span><span>Journey</span><span>Attendance</span><span>Support</span><span>Action</span></div>
              {demoPatients.map(p => <div className="practiceRow" key={p.id}><strong>{p.time}</strong><span>{p.name}</span><span>{p.treatment}</span><span>{p.journey}</span><span>{p.attendance}</span><span>{[p.language !== 'English' ? p.language : '', ...p.accessibility, ...p.support].filter(Boolean).join(' · ') || 'None'}</span><strong className="actionText">{p.receptionAction}</strong></div>)}
            </div>
          </section>

          <div style={{display:'flex',gap:12,marginTop:18,flexWrap:'wrap'}}>
            <Link href="/clinician" className="secondary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Open clinician</Link>
            <Link href="/practice" className="secondary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Open reception</Link>
          </div>

          {notice && <div style={{position:'fixed',right:24,bottom:24,padding:'14px 18px',borderRadius:14,background:'#173f3d',color:'#fff',boxShadow:'0 16px 40px rgba(0,0,0,.18)',fontWeight:800,fontSize:13}}>{notice}</div>}
        </section>
      </section>
    </main>
  );
}
