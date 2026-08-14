'use client';

import { useEffect, useMemo, useState } from 'react';
import { demoPatients, type DemoPatient } from '../lib/demo-data';

type ChecklistPoint = {
  id: string;
  label: string;
  source: 'pre-care' | 'clinician';
  detail: string;
};

type TreatmentOption = {
  label: string;
  modules: string[];
};

type AuditEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

const treatmentOptions: TreatmentOption[] = [
  { label: 'Implant UR6', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'] },
  { label: 'Implant + bone graft', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity', 'Bone graft'] },
  { label: 'Surgical extraction', modules: ['Surgical extraction', 'Aftercare'] },
  { label: 'Root canal', modules: ['Root canal', 'Aftercare'] },
  { label: 'Crown fit', modules: ['Crown fit'] },
];

const treatmentChecklist = (patient: DemoPatient): ChecklistPoint[] => {
  const treatment = patient.treatment.toLowerCase();

  if (treatment.includes('implant')) {
    const points: ChecklistPoint[] = [
      { id: 'purpose', label: 'Purpose of implant treatment', source: 'pre-care', detail: 'What an implant is and the intended purpose of treatment.' },
      { id: 'stages', label: 'Stages and expected timing', source: 'pre-care', detail: 'Assessment, placement, healing and restoration stages reviewed.' },
      { id: 'success', label: 'Success is not guaranteed', source: 'pre-care', detail: 'Patient reviewed the possibility of non-integration or failure.' },
      { id: 'alternatives', label: 'Reasonable alternatives and no treatment', source: 'pre-care', detail: 'Alternative options remain available for discussion.' },
      { id: 'recovery', label: 'Expected recovery and aftercare', source: 'pre-care', detail: 'Normal recovery and when to contact the practice reviewed.' },
      { id: 'maintenance', label: 'Long-term maintenance', source: 'pre-care', detail: 'Cleaning, reviews and maintenance requirements reviewed.' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician', detail: 'Confirm risks relevant to this patient, anatomy and treatment plan.' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question || 'Confirm the patient has had an opportunity to ask questions.' },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician', detail: 'Confirm the treatment being provided matches the discussion.' },
      { id: 'final-opportunity', label: 'Final opportunity to ask or reconsider', source: 'clinician', detail: 'Give the patient time to ask, pause or decide not to proceed.' },
    ];

    if (treatment.includes('graft')) {
      points.splice(
        6,
        0,
        { id: 'graft-purpose', label: 'Why the bone graft is needed', source: 'clinician', detail: 'Explain why grafting is proposed and how it supports the implant plan.' },
        { id: 'graft-risks', label: 'Key graft risks and healing', source: 'clinician', detail: 'Cover the main graft-specific risks and expected healing.' },
        { id: 'graft-timing', label: 'Any change to treatment timing', source: 'clinician', detail: 'Explain whether grafting changes the sequence or timing of treatment.' },
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

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ClinicianWorkspace() {
  const patients = demoPatients.filter((patient) => patient.attendance !== 'Cancel');
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const basePatient = useMemo(() => patients.find((item) => item.id === selectedId) ?? patients[0], [patients, selectedId]);

  const [treatmentEdits, setTreatmentEdits] = useState<Record<string, TreatmentOption>>({});
  const [draftTreatment, setDraftTreatment] = useState('');
  const [treatmentChangeNote, setTreatmentChangeNote] = useState('');
  const [resolvedModules, setResolvedModules] = useState<Record<string, string[]>>({});
  const [auditByPatient, setAuditByPatient] = useState<Record<string, AuditEvent[]>>({});
  const [changePromptOpen, setChangePromptOpen] = useState(false);
  const [newPointIds, setNewPointIds] = useState<string[]>([]);
  const [newPointsDiscussed, setNewPointsDiscussed] = useState(false);

  const selectedTreatment = treatmentEdits[basePatient.id];
  const patient = useMemo<DemoPatient>(() => {
    if (!selectedTreatment) return basePatient;
    return { ...basePatient, treatment: selectedTreatment.label, treatmentModules: selectedTreatment.modules };
  }, [basePatient, selectedTreatment]);

  const supportSummary = [...patient.accessibility, ...patient.support];
  const checklist = useMemo(() => treatmentChecklist(patient), [patient]);
  const unresolvedMissing = useMemo(() => {
    const resolved = resolvedModules[basePatient.id] ?? [];
    return patient.treatmentModules.filter((module) => !patient.completedModules.includes(module) && !resolved.includes(module));
  }, [patient, resolvedModules, basePatient.id]);

  const [covered, setCovered] = useState<Record<string, boolean>>({});
  const [clinicianConfirmed, setClinicianConfirmed] = useState(false);
  const [clarification, setClarification] = useState('');

  const addAudit = (title: string, detail: string) => {
    setAuditByPatient((current) => ({
      ...current,
      [basePatient.id]: [
        ...(current[basePatient.id] ?? []),
        { id: `${Date.now()}-${Math.random()}`, time: now(), title, detail },
      ],
    }));
  };

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    checklist.forEach((point) => {
      initial[point.id] = point.source === 'pre-care' && patient.journey === 'Complete';
    });
    if (patient.understanding.toLowerCase().includes('corrected')) initial.success = false;
    if (unresolvedMissing.length) initial.plan = false;
    setCovered(initial);
    setClinicianConfirmed(false);
    setClarification('');
    setDraftTreatment(patient.treatment);
  }, [patient.id, patient.treatment, checklist, unresolvedMissing.length]);

  const completedCount = checklist.filter((point) => covered[point.id]).length;
  const allCovered = completedCount === checklist.length && unresolvedMissing.length === 0 && !changePromptOpen;
  const remaining = checklist.length - completedCount;
  const treatmentWasEdited = Boolean(treatmentEdits[basePatient.id]);
  const auditEvents = auditByPatient[basePatient.id] ?? [];
  const newPoints = checklist.filter((point) => newPointIds.includes(point.id));

  const togglePoint = (id: string) => {
    setCovered((current) => ({ ...current, [id]: !current[id] }));
    setClinicianConfirmed(false);
  };

  const applyTreatmentChange = () => {
    const option = treatmentOptions.find((item) => item.label === draftTreatment);
    if (!option || option.label === patient.treatment) return;

    const before = treatmentChecklist(patient);
    const nextPatient: DemoPatient = { ...basePatient, treatment: option.label, treatmentModules: option.modules };
    const after = treatmentChecklist(nextPatient);
    const beforeIds = new Set(before.map((item) => item.id));
    const addedIds = after.filter((item) => !beforeIds.has(item.id)).map((item) => item.id);

    setTreatmentEdits((current) => ({ ...current, [basePatient.id]: option }));
    setNewPointIds(addedIds.length ? addedIds : after.filter((item) => item.source === 'clinician').map((item) => item.id));
    setChangePromptOpen(true);
    setNewPointsDiscussed(false);
    setClinicianConfirmed(false);
    addAudit(
      'Treatment changed',
      `${patient.treatment} → ${option.label}${treatmentChangeNote.trim() ? ` · ${treatmentChangeNote.trim()}` : ''}`,
    );
  };

  const markNewPointsDiscussed = () => {
    const ids = newPointIds;
    setCovered((current) => {
      const next = { ...current };
      ids.forEach((id) => { next[id] = true; });
      next.plan = true;
      return next;
    });

    const newlyAddedModules = patient.treatmentModules.filter((module) => !basePatient.completedModules.includes(module));
    setResolvedModules((current) => ({
      ...current,
      [basePatient.id]: Array.from(new Set([...(current[basePatient.id] ?? []), ...newlyAddedModules])),
    }));

    setNewPointsDiscussed(true);
    setChangePromptOpen(false);
    addAudit('Additional consent points discussed', newPoints.map((point) => point.label).join(' · ') || 'Updated treatment discussion completed.');
  };

  const revertTreatment = () => {
    const currentTreatment = patient.treatment;
    setTreatmentEdits((current) => {
      const next = { ...current };
      delete next[basePatient.id];
      return next;
    });
    setResolvedModules((current) => ({ ...current, [basePatient.id]: [] }));
    setNewPointIds([]);
    setChangePromptOpen(false);
    setNewPointsDiscussed(false);
    setClinicianConfirmed(false);
    addAudit('Treatment change reverted', `${currentTreatment} → ${basePatient.treatment}`);
  };

  const confirmClinicianDiscussion = () => {
    setClinicianConfirmed(true);
    addAudit('Clinician confirmation', 'Clinician confirmed all required consent points were covered and relevant questions addressed.');
  };

  const saveClarification = () => {
    if (!clarification.trim()) return;
    addAudit('Clinical clarification recorded', clarification.trim());
    setClarification('');
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
            <button type="button" className={item.id === basePatient.id ? 'patientNav active patientNavButton' : 'patientNav patientNavButton'} key={item.id} onClick={() => setSelectedId(item.id)}>
              <strong>{item.time} · {item.name}</strong><span>{treatmentEdits[item.id]?.label ?? item.treatment}</span><em>{item.clinicianStatus}</em>
            </button>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Consent control</span>
              <h1>{patient.name}</h1>
              <p>{patient.treatment} · {patient.time} · Review what is covered, complete anything outstanding and move smoothly to final patient confirmation.</p>
            </div>
            <span className={`status ${allCovered ? 'green' : 'amber'}`}>{allCovered ? 'Ready for clinician confirmation' : `${remaining + unresolvedMissing.length} to complete`}</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Pre-care journey</span><strong>{patient.journey}</strong></div>
            <div className="metric"><span>Checklist covered</span><strong>{completedCount}/{checklist.length}</strong></div>
            <div className="metric"><span>Language</span><strong>{patient.language}</strong></div>
            <div className="metric"><span>Anxiety</span><strong>{patient.anxiety === null ? 'Not captured' : `${patient.anxiety}/10`}</strong></div>
          </div>

          <section className={`dashboardCard ${treatmentWasEdited || unresolvedMissing.length ? 'alertCard' : ''}`} style={{ marginBottom: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Treatment plan</span><h2>Review or edit treatment</h2></div>
              <span className={`status ${treatmentWasEdited ? 'amber' : 'green'}`}>{treatmentWasEdited ? 'Changed in clinic' : 'Matches pre-care'}</span>
            </div>
            <div className="section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 12, alignItems: 'end' }}>
              <label>
                <span className="sectionTitle">Current treatment</span>
                <select className="adminInput" value={draftTreatment} onChange={(event) => setDraftTreatment(event.target.value)}>
                  {treatmentOptions.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
                </select>
              </label>
              <button className="primary desktopButton" type="button" onClick={applyTreatmentChange} disabled={!draftTreatment || draftTreatment === patient.treatment}>Apply change</button>
            </div>
            <div className="section">
              <span className="sectionTitle">Reason / clinical note</span>
              <textarea className="questionBox" value={treatmentChangeNote} onChange={(event) => setTreatmentChangeNote(event.target.value)} placeholder="Optional reason for the change..." />
            </div>
            {treatmentWasEdited && <div className="section"><button className="secondary desktopButton" type="button" onClick={revertTreatment}>Revert to original treatment</button></div>}
          </section>

          {changePromptOpen && (
            <section className="dashboardCard alertCard" style={{ marginBottom: 18 }}>
              <div className="cardHeader">
                <div><span className="eyebrow">Treatment updated</span><h2>New points to cover</h2></div>
                <span className="status amber">Before final consent</span>
              </div>
              <div className="section"><p>Only cover what changed. Keep the conversation short and clear.</p></div>
              <div className="auditList">
                {newPoints.map((point) => <div className="auditRow" key={point.id}><span>{point.label}</span><strong>Discuss</strong></div>)}
              </div>
              <div className="section">
                <button className="primary desktopButton" type="button" onClick={markNewPointsDiscussed}>✓ Mark all discussed</button>
              </div>
            </section>
          )}

          {newPointsDiscussed && treatmentWasEdited && (
            <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}>
              <div className="section"><p><strong>Updated treatment discussion complete.</strong> The change and additional consent discussion have been added to the audit trail.</p></div>
            </section>
          )}

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Patient briefing</span><h2>What to know before you start</h2></div></div>
              <div className="section"><span className="sectionTitle">Understanding</span><p>{patient.understanding}</p></div>
              <div className="section"><span className="sectionTitle">What matters</span><p>{patient.priority || 'Not captured yet.'}</p></div>
              <div className="section"><span className="sectionTitle">Question to answer</span><p>{patient.question || 'No question submitted.'}</p></div>
              <div className="section"><span className="sectionTitle">Support</span><p>{supportSummary.length ? supportSummary.join(' · ') : 'No additional support requested.'}</p></div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Treatment reconciliation</span><h2>Pathway match</h2></div><span className={`status ${unresolvedMissing.length ? 'amber' : 'green'}`}>{unresolvedMissing.length ? 'Needs discussion' : 'Matched'}</span></div>
              <div className="auditList">
                {patient.treatmentModules.map((module) => {
                  const resolved = basePatient.completedModules.includes(module) || (resolvedModules[basePatient.id] ?? []).includes(module);
                  return <div className="auditRow" key={module}><span>{module}</span><strong>{resolved ? 'Covered' : 'New / missing'}</strong></div>;
                })}
              </div>
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Full treatment consent checklist</span><h2>Everything in one place</h2></div>
              <span className={`status ${allCovered ? 'green' : 'amber'}`}>{completedCount}/{checklist.length} covered</span>
            </div>
            <div className="section"><p>Already-covered points stay visible for peace of mind. Only outstanding points need action.</p></div>
            <div className="auditList">
              {checklist.map((point) => {
                const isCovered = Boolean(covered[point.id]);
                return (
                  <div key={point.id} style={{ padding: '14px 0', borderBottom: '1px solid #edf2f0', display: 'grid', gridTemplateColumns: '40px minmax(0,1fr) auto', gap: 14, alignItems: 'start' }}>
                    <button type="button" aria-label={`${isCovered ? 'Mark incomplete' : 'Mark covered'}: ${point.label}`} onClick={() => togglePoint(point.id)} style={{ width: 30, height: 30, borderRadius: 9, border: isCovered ? '1px solid #245c5a' : '1px solid #cbd8d4', background: isCovered ? '#e8f1ef' : '#fff', color: '#245c5a', fontWeight: 900, cursor: 'pointer' }}>{isCovered ? '✓' : ''}</button>
                    <div><strong style={{ display: 'block', color: '#173f3d', fontSize: 14, marginBottom: 5 }}>{point.label}</strong><span style={{ display: 'block', color: '#667773', fontSize: 12, lineHeight: 1.5 }}>{point.detail}</span></div>
                    <span className={`status ${isCovered ? 'green' : 'amber'}`}>{isCovered ? (point.source === 'pre-care' ? 'Pre-care covered' : 'Discussed') : 'Clinician to cover'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader"><div><span className="eyebrow">Clinical clarification</span><h2>Add anything material</h2></div></div>
            <div className="section">
              <textarea className="questionBox" value={clarification} onChange={(event) => setClarification(event.target.value)} placeholder="Optional clarification or patient-specific discussion point..." />
              <button className="secondary desktopButton" type="button" onClick={saveClarification} disabled={!clarification.trim()} style={{ marginTop: 12 }}>Save to audit</button>
            </div>
          </section>

          <section className={`dashboardCard ${!allCovered ? 'alertCard' : ''}`} style={{ marginTop: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Clinician confirmation</span><h2>{clinicianConfirmed ? 'Clinical discussion confirmed' : 'Confirm all required points are covered'}</h2></div>
              <span className={`status ${clinicianConfirmed ? 'green' : 'amber'}`}>{clinicianConfirmed ? 'Confirmed' : allCovered ? 'Ready' : 'Not ready'}</span>
            </div>
            <div className="section"><p>I confirm that I have reviewed the pre-care record, covered all outstanding and patient-specific points, and addressed relevant questions.</p></div>
            <div className="section">
              <button className="primary desktopButton" disabled={!allCovered || clinicianConfirmed} onClick={confirmClinicianDiscussion}>{clinicianConfirmed ? 'Clinical discussion confirmed ✓' : 'Confirm clinical discussion complete'}</button>
            </div>
            {clinicianConfirmed && <div className="section" style={{ background: '#eef7f2' }}><p><strong>Ready for patient final confirmation.</strong> The clinician confirmation has been added to the audit trail.</p></div>}
          </section>

          <section className="dashboardCard" style={{ marginTop: 18, marginBottom: 32 }}>
            <div className="cardHeader"><div><span className="eyebrow">Audit trail</span><h2>Consent journey evidence</h2></div><span className="status green">Retained</span></div>
            <div className="auditList">
              <div className="auditRow"><span>Pre-care journey</span><strong>{patient.journey} · original record retained</strong></div>
              {auditEvents.length === 0 && <div className="auditRow"><span>During appointment</span><strong>No new audit events yet</strong></div>}
              {auditEvents.map((event) => <div className="auditRow" key={event.id}><span>{event.time} · {event.title}</span><strong>{event.detail}</strong></div>)}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
