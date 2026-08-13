'use client';

import { useMemo, useState } from 'react';
import { demoPatients, getMissingModules } from '../lib/demo-data';

export default function ClinicianWorkspace() {
  const patients = demoPatients.filter((patient) => patient.attendance !== 'Cancel');
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const patient = useMemo(() => patients.find((item) => item.id === selectedId) ?? patients[0], [patients, selectedId]);
  const missing = getMissingModules(patient);
  const supportSummary = [...patient.accessibility, ...patient.support];

  return (
    <main className="desktopApp">
      <header className="desktopHeader"><div><div className="brand">Sitora Ready™</div><div className="tagline">Clinician workspace</div></div><div className="headerMeta">Today · {patients.length} treatment patients</div></header>
      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Today</span>
          {patients.map((item) => <button type="button" className={item.id === patient.id ? 'patientNav active patientNavButton' : 'patientNav patientNavButton'} key={item.id} onClick={() => setSelectedId(item.id)}><strong>{item.time} · {item.name}</strong><span>{item.treatment}</span><em>{item.clinicianStatus}</em></button>)}
        </aside>
        <section className="desktopContent">
          <div className="heroPanel"><div><span className="eyebrow">Clinician briefing</span><h1>{patient.name}</h1><p>{patient.treatment} · {patient.time}</p></div><span className={`status ${patient.clinicianStatus === 'Ready' ? 'green' : 'amber'}`}>{patient.clinicianStatus}</span></div>
          <div className="metricGrid"><div className="metric"><span>Journey</span><strong>{patient.journey}</strong></div><div className="metric"><span>Attendance</span><strong>{patient.attendance}</strong></div><div className="metric"><span>Language</span><strong>{patient.language}</strong></div><div className="metric"><span>Anxiety</span><strong>{patient.anxiety === null ? 'Not captured' : `${patient.anxiety}/10`}</strong></div></div>
          <div className="desktopCards">
            <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Consent intelligence</span><h2>Understanding & discussion</h2></div></div><div className="section"><span className="sectionTitle">Understanding</span><p>{patient.understanding}</p></div><div className="section"><span className="sectionTitle">Patient priority</span><p>{patient.priority || 'Not captured yet.'}</p></div><div className="section"><span className="sectionTitle">Patient question</span><p>{patient.question || 'No question submitted.'}</p></div>{patient.clinicianStatus !== 'Ready' && <div className="section"><button className="primary desktopButton">Record clarification</button></div>}</section>
            <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Support passport</span><h2>Prepare the appointment</h2></div></div><div className="section"><span className="sectionTitle">Communication</span><p>{patient.language} · {patient.accessibility.length ? patient.accessibility.join(' · ') : 'Standard display'}</p></div><div className="section"><span className="sectionTitle">Support request</span><p>{supportSummary.length ? supportSummary.join(' · ') : 'No additional support requested.'}</p></div><div className="section"><span className="sectionTitle">Readiness</span><p>{patient.attendance === 'Confirmed' ? 'Attendance confirmed.' : `Attendance: ${patient.attendance}.`} {patient.anxiety !== null && patient.anxiety >= 8 ? 'High anxiety flagged.' : 'No high-anxiety alert.'}</p></div></section>
          </div>
          <section className={`dashboardCard ${missing.length ? 'alertCard' : ''}`}><div className="cardHeader"><div><span className="eyebrow">Treatment coverage</span><h2>Consent pathway reconciliation</h2></div><span className={`status ${missing.length ? 'amber' : 'green'}`}>{missing.length ? 'Action required' : 'Covered'}</span></div><div className="auditList">{patient.treatmentModules.map((module) => <div className="auditRow" key={module}><span>{module}</span><strong>{patient.completedModules.includes(module) ? 'Complete' : 'Missing module'}</strong></div>)}</div>{missing.length > 0 && <div className="section"><p><strong>Missing:</strong> {missing.join(', ')}</p><button className="primary desktopButton">Send additional module</button></div>}</section>
        </section>
      </section>
    </main>
  );
}
