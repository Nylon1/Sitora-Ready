'use client';

import { demoPatients, demoPracticeMetrics, getMissingModules } from '../lib/demo-data';

export default function PracticeWorkspace() {
  const actionable = demoPatients.filter((patient) => patient.receptionAction !== '');
  const supportCount = demoPatients.filter((patient) => patient.support.length || patient.accessibility.length || patient.language !== 'English').length;
  const cancellations = demoPatients.filter((patient) => patient.attendance === 'Cancel');

  return (
    <main className="desktopApp">
      <header className="desktopHeader"><div><div className="brand">Sitora Ready™</div><div className="tagline">Reception & practice operations</div></div><div className="headerMeta">Tomorrow · Treatment list</div></header>
      <section className="practiceShell">
        <div className="heroPanel"><div><span className="eyebrow">Pre-care operations</span><h1>Tomorrow at a glance</h1><p>Prepare patients, protect chair time and surface anything requiring action before arrival.</p></div><span className="status green">{demoPracticeMetrics.appointmentsTracked} appointments tracked</span></div>
        <div className="metricGrid practiceMetrics"><div className="metric"><span>Journeys complete</span><strong>{demoPracticeMetrics.journeysComplete} / {demoPracticeMetrics.appointmentsTracked}</strong></div><div className="metric"><span>Attendance confirmed</span><strong>{demoPracticeMetrics.attendanceConfirmed}</strong></div><div className="metric"><span>Needs action</span><strong>{demoPracticeMetrics.needsAction}</strong></div><div className="metric"><span>Chair time released</span><strong>{demoPracticeMetrics.chairTimeReleasedHours.toFixed(1)}h</strong></div></div>
        <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Tomorrow</span><h2>Patient readiness list</h2></div><span className="status neutral">Shared demo data</span></div><div className="practiceTable"><div className="practiceRow practiceHead"><span>Time</span><span>Patient</span><span>Treatment</span><span>Journey</span><span>Attendance</span><span>Support</span><span>Action</span></div>{demoPatients.map((patient) => <div className="practiceRow" key={patient.id}><strong>{patient.time}</strong><span>{patient.name}</span><span>{patient.treatment}</span><span>{patient.journey}</span><span>{patient.attendance}</span><span>{[patient.language !== 'English' ? patient.language : '', ...patient.accessibility, ...patient.support].filter(Boolean).join(' · ') || 'None'}</span><strong className="actionText">{patient.receptionAction}</strong></div>)}</div></section>
        <div className="desktopCards">
          <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Capacity recovery</span><h2>Protect the chair</h2></div></div><div className="section"><p>{cancellations.length ? `${cancellations[0].name} has requested cancellation before the appointment. The slot can now be released and offered to another patient.` : 'No early cancellations currently waiting for action.'}</p></div><div className="metricGrid miniMetrics"><div className="metric"><span>Early cancellations</span><strong>{demoPracticeMetrics.earlyCancellationsThisMonth}</strong></div><div className="metric"><span>Slots refilled</span><strong>{demoPracticeMetrics.slotsRefilledThisMonth}</strong></div></div></section>
          <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Inclusive care</span><h2>Adjustments to prepare</h2></div></div><div className="auditList"><div className="auditRow"><span>Patients with pre-visit needs</span><strong>{supportCount}</strong></div><div className="auditRow"><span>High anxiety</span><strong>{demoPatients.filter((patient) => patient.anxiety !== null && patient.anxiety >= 8).length}</strong></div><div className="auditRow"><span>Language / accessibility support</span><strong>{demoPatients.filter((patient) => patient.language !== 'English' || patient.accessibility.length).length}</strong></div></div></section>
        </div>
        {actionable.filter((patient) => getMissingModules(patient).length).map((patient) => <section className="dashboardCard alertCard" key={patient.id}><div className="cardHeader"><div><span className="eyebrow">Governance alert</span><h2>Treatment / consent mismatch</h2></div><span className="status amber">Action required</span></div><div className="section"><p><strong>{patient.name}:</strong> {getMissingModules(patient).join(', ')} is present in the treatment plan but is not yet covered by the completed patient journey.</p><button className="primary desktopButton">Send additional module</button></div></section>)}
      </section>
    </main>
  );
}
