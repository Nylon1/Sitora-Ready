'use client';

import { useEffect, useMemo, useState } from 'react';
import { demoPatients, getMissingModules, type DemoPatient } from '../lib/demo-data';

type ChecklistPoint = {
  id: string;
  label: string;
  source: 'pre-care' | 'clinician';
  detail: string;
};

const treatmentChecklist = (patient: DemoPatient): ChecklistPoint[] => {
  const treatment = patient.treatment.toLowerCase();

  if (treatment.includes('implant')) {
    const points: ChecklistPoint[] = [
      { id: 'purpose', label: 'Purpose of implant treatment', source: 'pre-care', detail: 'What an implant is and the intended purpose of treatment.' },
      { id: 'stages', label: 'Stages and expected timing', source: 'pre-care', detail: 'Assessment, placement, healing and restoration stages reviewed.' },
      { id: 'success', label: 'Success is not guaranteed', source: 'pre-care', detail: 'Patient reviewed the possibility of non-integration or failure.' },
      { id: 'alternatives', label: 'Reasonable alternatives and no treatment', source: 'pre-care', detail: 'Alternative options should remain available for discussion.' },
      { id: 'recovery', label: 'Expected recovery and aftercare', source: 'pre-care', detail: 'Normal recovery and when to contact the practice reviewed.' },
      { id: 'maintenance', label: 'Long-term maintenance', source: 'pre-care', detail: 'Ongoing cleaning, reviews and maintenance requirements reviewed.' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician', detail: 'Clinician confirms risks relevant to this patient, anatomy and treatment plan.' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question || 'Confirm the patient has had an opportunity to ask questions.' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician', detail: 'Confirm the proposed treatment has not materially changed.' },
      { id: 'final-opportunity', label: 'Final opportunity to ask or reconsider', source: 'clinician', detail: 'Patient is given time to ask, pause or decide not to proceed.' },
    ];
    if (treatment.includes('graft')) {
      points.splice(6, 0,
        { id: 'graft-purpose', label: 'Bone graft purpose and need', source: 'clinician', detail: 'Explain why grafting is proposed and how it relates to implant treatment.' },
        { id: 'graft-risks', label: 'Bone graft risks and recovery', source: 'clinician', detail: 'Discuss graft-specific risks, healing and any effect on timing.' },
      );
    }
    return points;
  }

  if (treatment.includes('extraction')) {
    return [
      { id: 'purpose', label: 'Reason for extraction', source: 'pre-care', detail: 'Purpose and planned procedure reviewed.' },
      { id: 'risks', label: 'Important extraction risks', source: 'pre-care', detail: 'General risks and expected recovery reviewed.' },
      { id: 'aftercare', label: 'Aftercare and healing', source: 'pre-care', detail: 'Post-operative care and escalation advice reviewed.' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician', detail: 'Confirm anatomy, medical factors and procedure-specific risks.' },
      { id: 'alternatives', label: 'Alternatives discussed', source: 'clinician', detail: 'Confirm reasonable alternatives where applicable.' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question || 'Confirm the patient has had an opportunity to ask questions.' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician', detail: 'Confirm the planned extraction is unchanged.' },
    ];
  }

  if (treatment.includes('root canal')) {
    return [
      { id: 'purpose', label: 'Purpose of root canal treatment', source: 'pre-care', detail: 'Why treatment is proposed and what it aims to achieve.' },
      { id: 'risks', label: 'Important risks and limitations', source: 'pre-care', detail: 'General treatment risks and limitations reviewed.' },
      { id: 'alternatives', label: 'Alternatives including extraction', source: 'pre-care', detail: 'Alternative options reviewed.' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician', detail: 'Discuss tooth-specific prognosis, complexity and restorative plan.' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question || 'Confirm the patient has had an opportunity to ask questions.' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician', detail: 'Confirm treatment and restorative plan are unchanged.' },
    ];
  }

  return [
    { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care', detail: 'Core treatment information reviewed before the appointment.' },
    { id: 'risks', label: 'Important risks and limitations', source: 'pre-care', detail: 'General risks and limitations reviewed.' },
    { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician', detail: 'Confirm alternatives have been discussed where applicable.' },
    { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician', detail: 'Cover any individual clinical factors relevant to this patient.' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question || 'Confirm the patient has had an opportunity to ask questions.' },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician', detail: 'Confirm the treatment proposed is the treatment discussed.' },
  ];
};

export default function ClinicianWorkspace() {
  const patients = demoPatients.filter((patient) => patient.attendance !== 'Cancel');
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const patient = useMemo(() => patients.find((item) => item.id === selectedId) ?? patients[0], [patients, selectedId]);
  const missing = getMissingModules(patient);
  const supportSummary = [...patient.accessibility, ...patient.support];
  const checklist = useMemo(() => treatmentChecklist(patient), [patient]);

  const [covered, setCovered] = useState<Record<string, boolean>>({});
  const [clinicianConfirmed, setClinicianConfirmed] = useState(false);
  const [clarification, setClarification] = useState('');

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    checklist.forEach((point) => {
      initial[point.id] = point.source === 'pre-care' && patient.journey === 'Complete';
    });
    if (patient.understanding.toLowerCase().includes('corrected')) initial.success = false;
    if (missing.length) initial.plan = false;
    setCovered(initial);
    setClinicianConfirmed(false);
    setClarification('');
  }, [patient, checklist, missing.length]);

  const completedCount = checklist.filter((point) => covered[point.id]).length;
  const allCovered = completedCount === checklist.length && missing.length === 0;
  const remaining = checklist.length - completedCount;

  const togglePoint = (id: string) => {
    setCovered((current) => ({ ...current, [id]: !current[id] }));
    setClinicianConfirmed(false);
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">During · clinician consent workspace</div></div>
        <div className="headerMeta">Today · {patients.length} treatment patients</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Today</span>
          {patients.map((item) => (
            <button type="button" className={item.id === patient.id ? 'patientNav active patientNavButton' : 'patientNav patientNavButton'} key={item.id} onClick={() => setSelectedId(item.id)}>
              <strong>{item.time} · {item.name}</strong><span>{item.treatment}</span><em>{item.clinicianStatus}</em>
            </button>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Consent control</span>
              <h1>{patient.name}</h1>
              <p>{patient.treatment} · {patient.time} · Review what is already covered, complete the remaining clinical discussion and confirm the consent conversation.</p>
            </div>
            <span className={`status ${allCovered ? 'green' : 'amber'}`}>{allCovered ? 'Ready for clinician confirmation' : `${remaining + missing.length} point${remaining + missing.length === 1 ? '' : 's'} to complete`}</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Pre-care journey</span><strong>{patient.journey}</strong></div>
            <div className="metric"><span>Checklist covered</span><strong>{completedCount}/{checklist.length}</strong></div>
            <div className="metric"><span>Language</span><strong>{patient.language}</strong></div>
            <div className="metric"><span>Anxiety</span><strong>{patient.anxiety === null ? 'Not captured' : `${patient.anxiety}/10`}</strong></div>
          </div>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Patient briefing</span><h2>What to know before you start</h2></div></div>
              <div className="section"><span className="sectionTitle">Understanding</span><p>{patient.understanding}</p></div>
              <div className="section"><span className="sectionTitle">What matters to the patient</span><p>{patient.priority || 'Not captured yet.'}</p></div>
              <div className="section"><span className="sectionTitle">Question to answer</span><p>{patient.question || 'No question submitted.'}</p></div>
              <div className="section"><span className="sectionTitle">Support</span><p>{supportSummary.length ? supportSummary.join(' · ') : 'No additional support requested.'}</p></div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Treatment reconciliation</span><h2>Make sure the pathway still matches</h2></div><span className={`status ${missing.length ? 'amber' : 'green'}`}>{missing.length ? 'Mismatch' : 'Matched'}</span></div>
              <div className="section"><span className="sectionTitle">Current treatment</span><p>{patient.treatment}</p></div>
              <div className="auditList">
                {patient.treatmentModules.map((module) => <div className="auditRow" key={module}><span>{module}</span><strong>{patient.completedModules.includes(module) ? 'Pre-care covered' : 'Missing pre-care module'}</strong></div>)}
              </div>
              {missing.length > 0 && <div className="section"><p><strong>Do not proceed to final confirmation.</strong> Add or discuss: {missing.join(', ')}.</p><button className="primary desktopButton">Send additional module</button></div>}
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Full treatment consent checklist</span><h2>Everything in one place</h2></div>
              <span className={`status ${allCovered ? 'green' : 'amber'}`}>{completedCount}/{checklist.length} covered</span>
            </div>
            <div className="section"><p>Green points were covered during the patient’s pre-care journey or have now been confirmed by you. Every required point remains visible for peace of mind.</p></div>

            <div className="auditList">
              {checklist.map((point) => {
                const isCovered = Boolean(covered[point.id]);
                return (
                  <div key={point.id} style={{ padding: '14px 0', borderBottom: '1px solid #edf2f0', display: 'grid', gridTemplateColumns: '40px minmax(0,1fr) auto', gap: 14, alignItems: 'start' }}>
                    <button
                      type="button"
                      aria-label={`${isCovered ? 'Mark incomplete' : 'Mark covered'}: ${point.label}`}
                      onClick={() => togglePoint(point.id)}
                      style={{ width: 30, height: 30, borderRadius: 9, border: isCovered ? '1px solid #245c5a' : '1px solid #cbd8d4', background: isCovered ? '#e8f1ef' : '#fff', color: '#245c5a', fontWeight: 900, cursor: 'pointer' }}
                    >{isCovered ? '✓' : ''}</button>
                    <div>
                      <strong style={{ display: 'block', color: '#173f3d', fontSize: 14, marginBottom: 5 }}>{point.label}</strong>
                      <span style={{ display: 'block', color: '#667773', fontSize: 12, lineHeight: 1.5 }}>{point.detail}</span>
                    </div>
                    <span className={`status ${isCovered ? 'green' : 'amber'}`}>{isCovered ? (point.source === 'pre-care' ? 'Pre-care covered' : 'Discussed') : 'Clinician to cover'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader"><div><span className="eyebrow">Clinical clarification</span><h2>Add anything material to the record</h2></div></div>
            <div className="section">
              <textarea className="questionBox" value={clarification} onChange={(event) => setClarification(event.target.value)} placeholder="Optional: record a clarification, patient-specific discussion point or additional information discussed..." />
              <p className="muted">Prototype note: this will become a timestamped audit event in the production record.</p>
            </div>
          </section>

          <section className={`dashboardCard ${!allCovered ? 'alertCard' : ''}`} style={{ marginTop: 18, marginBottom: 32 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Clinician confirmation</span><h2>{clinicianConfirmed ? 'Clinical discussion confirmed' : 'Confirm every required point is covered'}</h2></div>
              <span className={`status ${clinicianConfirmed ? 'green' : 'amber'}`}>{clinicianConfirmed ? 'Confirmed' : allCovered ? 'Ready to confirm' : 'Not ready'}</span>
            </div>
            <div className="section">
              <p>I confirm that I have reviewed the patient’s pre-care record, discussed all outstanding and patient-specific points, answered relevant questions, and covered the required consent points for the proposed treatment.</p>
            </div>
            <div className="section">
              <button className="primary desktopButton" disabled={!allCovered || clinicianConfirmed} onClick={() => setClinicianConfirmed(true)}>{clinicianConfirmed ? 'Clinical discussion confirmed ✓' : 'Confirm clinical discussion complete'}</button>
              {!allCovered && <p className="muted">Complete every checklist point and resolve any treatment-pathway mismatch before confirming.</p>}
            </div>
            {clinicianConfirmed && (
              <div className="section" style={{ background: '#eef7f2' }}>
                <span className="sectionTitle">Next step</span>
                <p><strong>Ready for patient final confirmation.</strong> Sitora will now present the secondary patient confirmation. The clinician confirmation, checklist state, treatment version, clarifications and timestamps are retained in the audit trail.</p>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
