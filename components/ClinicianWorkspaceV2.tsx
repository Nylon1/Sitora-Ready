'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { demoPatients, type DemoPatient } from '../lib/demo-data';

type Point = { id: string; label: string; source: 'pre-care' | 'clinician'; detail?: string };
type TreatmentOption = { label: string; modules: string[] };
type AuditEvent = { id: string; time: string; title: string; detail: string };

const treatments: TreatmentOption[] = [
  { label: 'Implant UR6', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity'] },
  { label: 'Implant + bone graft', modules: ['Implant placement', 'Implant failure', 'Maintenance & longevity', 'Bone graft'] },
  { label: 'Surgical extraction', modules: ['Surgical extraction', 'Aftercare'] },
  { label: 'Root canal', modules: ['Root canal', 'Aftercare'] },
  { label: 'Crown fit', modules: ['Crown fit'] },
];

function checklistFor(patient: DemoPatient): Point[] {
  const t = patient.treatment.toLowerCase();

  if (t.includes('implant')) {
    const points: Point[] = [
      { id: 'purpose', label: 'Purpose of implant treatment', source: 'pre-care' },
      { id: 'stages', label: 'Stages and expected timing', source: 'pre-care' },
      { id: 'success', label: 'Success is not guaranteed', source: 'pre-care' },
      { id: 'alternatives', label: 'Alternatives and no treatment', source: 'pre-care' },
      { id: 'recovery', label: 'Recovery and aftercare', source: 'pre-care' },
      { id: 'maintenance', label: 'Long-term maintenance', source: 'pre-care' },
      { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
      { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question },
      { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
      { id: 'final-opportunity', label: 'Final opportunity to ask or reconsider', source: 'clinician' },
    ];
    if (t.includes('graft')) {
      points.splice(6, 0,
        { id: 'graft-purpose', label: 'Why the bone graft is needed', source: 'clinician' },
        { id: 'graft-risks', label: 'Key graft risks and healing', source: 'clinician' },
        { id: 'graft-timing', label: 'Any change to treatment timing', source: 'clinician' },
      );
    }
    return points;
  }

  if (t.includes('extraction')) return [
    { id: 'purpose', label: 'Reason for extraction', source: 'pre-care' },
    { id: 'risks', label: 'Important extraction risks', source: 'pre-care' },
    { id: 'aftercare', label: 'Aftercare and healing', source: 'pre-care' },
    { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
    { id: 'alternatives', label: 'Alternatives discussed', source: 'clinician' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  ];

  if (t.includes('root canal')) return [
    { id: 'purpose', label: 'Purpose of root canal treatment', source: 'pre-care' },
    { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
    { id: 'alternatives', label: 'Alternatives including extraction', source: 'pre-care' },
    { id: 'specific-risks', label: 'Patient-specific clinical risks', source: 'clinician' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  ];

  return [
    { id: 'purpose', label: 'Purpose of proposed treatment', source: 'pre-care' },
    { id: 'risks', label: 'Important risks and limitations', source: 'pre-care' },
    { id: 'alternatives', label: 'Reasonable alternatives', source: 'clinician' },
    { id: 'specific-risks', label: 'Patient-specific clinical points', source: 'clinician' },
    { id: 'questions', label: 'Patient questions answered', source: 'clinician', detail: patient.question },
    { id: 'plan', label: 'Treatment plan matches discussion', source: 'clinician' },
  ];
}

const stamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ClinicianWorkspaceV2() {
  const patients = demoPatients.filter((p) => p.attendance !== 'Cancel');
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const base = useMemo(() => patients.find((p) => p.id === selectedId) ?? patients[0], [patients, selectedId]);

  const [edits, setEdits] = useState<Record<string, TreatmentOption>>({});
  const [draft, setDraft] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [coveredByPatient, setCoveredByPatient] = useState<Record<string, Record<string, boolean>>>({});
  const [newPointIds, setNewPointIds] = useState<Record<string, string[]>>({});
  const [changePending, setChangePending] = useState<Record<string, boolean>>({});
  const [clinicianConfirmed, setClinicianConfirmed] = useState<Record<string, boolean>>({});
  const [treatmentCompleted, setTreatmentCompleted] = useState<Record<string, boolean>>({});
  const [audit, setAudit] = useState<Record<string, AuditEvent[]>>({});
  const [clarification, setClarification] = useState('');

  const chosen = edits[base.id];
  const patient = useMemo<DemoPatient>(() => chosen ? { ...base, treatment: chosen.label, treatmentModules: chosen.modules } : base, [base, chosen]);
  const checklist = useMemo(() => checklistFor(patient), [patient]);
  const covered = coveredByPatient[base.id] ?? {};
  const addedIds = newPointIds[base.id] ?? [];
  const pendingChange = Boolean(changePending[base.id]);
  const confirmed = Boolean(clinicianConfirmed[base.id]);
  const completed = Boolean(treatmentCompleted[base.id]);

  useEffect(() => {
    setDraft(patient.treatment);
    setChangeNote('');
    setClarification('');
    setCoveredByPatient((current) => {
      if (current[base.id]) return current;
      const initial: Record<string, boolean> = {};
      checklist.forEach((point) => { initial[point.id] = point.source === 'pre-care' && patient.journey === 'Complete'; });
      if (patient.understanding.toLowerCase().includes('corrected')) initial.success = false;
      return { ...current, [base.id]: initial };
    });
  }, [base.id, patient.treatment, checklist, patient.journey, patient.understanding]);

  const addAudit = (title: string, detail: string) => {
    setAudit((current) => ({
      ...current,
      [base.id]: [...(current[base.id] ?? []), { id: `${Date.now()}-${Math.random()}`, time: stamp(), title, detail }],
    }));
  };

  const setPoint = (id: string, value: boolean) => {
    setCoveredByPatient((current) => ({ ...current, [base.id]: { ...(current[base.id] ?? {}), [id]: value } }));
    setClinicianConfirmed((current) => ({ ...current, [base.id]: false }));
    setTreatmentCompleted((current) => ({ ...current, [base.id]: false }));
  };

  const outstanding = checklist.filter((point) => !covered[point.id]);
  const completeCount = checklist.length - outstanding.length;
  const ready = outstanding.length === 0 && !pendingChange;

  const applyTreatmentChange = () => {
    const option = treatments.find((t) => t.label === draft);
    if (!option || option.label === patient.treatment) return;

    const before = checklistFor(patient);
    const nextPatient: DemoPatient = { ...base, treatment: option.label, treatmentModules: option.modules };
    const after = checklistFor(nextPatient);
    const beforeIds = new Set(before.map((p) => p.id));
    const added = after.filter((p) => !beforeIds.has(p.id)).map((p) => p.id);
    const promptIds = added.length ? added : after.filter((p) => p.source === 'clinician').map((p) => p.id);

    const nextCovered: Record<string, boolean> = {};
    after.forEach((point) => {
      nextCovered[point.id] = covered[point.id] ?? (point.source === 'pre-care' && base.journey === 'Complete');
    });
    promptIds.forEach((id) => { nextCovered[id] = false; });
    nextCovered.plan = false;

    setEdits((current) => ({ ...current, [base.id]: option }));
    setCoveredByPatient((current) => ({ ...current, [base.id]: nextCovered }));
    setNewPointIds((current) => ({ ...current, [base.id]: promptIds }));
    setChangePending((current) => ({ ...current, [base.id]: true }));
    setClinicianConfirmed((current) => ({ ...current, [base.id]: false }));
    setTreatmentCompleted((current) => ({ ...current, [base.id]: false }));
    addAudit('Treatment changed', `${patient.treatment} → ${option.label}${changeNote.trim() ? ` · ${changeNote.trim()}` : ''}`);
  };

  const discussNewPoints = () => {
    const next = { ...covered };
    addedIds.forEach((id) => { next[id] = true; });
    next.plan = true;
    setCoveredByPatient((current) => ({ ...current, [base.id]: next }));
    setChangePending((current) => ({ ...current, [base.id]: false }));
    const labels = checklist.filter((point) => addedIds.includes(point.id)).map((point) => point.label);
    addAudit('Additional consent points discussed', labels.join(' · ') || 'Updated treatment discussion completed.');
  };

  const confirmDiscussion = () => {
    if (!ready) return;
    setClinicianConfirmed((current) => ({ ...current, [base.id]: true }));
    addAudit('Clinician confirmation', 'All required consent points confirmed as covered and relevant questions addressed.');
  };

  const saveClarification = () => {
    if (!clarification.trim()) return;
    addAudit('Clinical clarification', clarification.trim());
    setClarification('');
  };

  const completeTreatment = () => {
    if (!confirmed) return;
    setTreatmentCompleted((current) => ({ ...current, [base.id]: true }));
    addAudit('Treatment completed', `${patient.treatment} recorded as treatment performed.`);
    addAudit('Aftercare generated', `Sitora After generated for ${patient.treatment}.`);
  };

  const support = [...patient.accessibility, ...patient.support];
  const priorityItems = [
    patient.understanding.toLowerCase().includes('corrected') ? `Understanding: ${patient.understanding}` : '',
    patient.question ? `Question: ${patient.question}` : '',
    patient.priority ? `What matters: ${patient.priority}` : '',
    patient.anxiety !== null && patient.anxiety >= 8 ? `High anxiety: ${patient.anxiety}/10` : '',
    support.length ? `Support: ${support.join(' · ')}` : '',
  ].filter(Boolean);

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">During · clinician workspace</div></div>
        <div className="headerMeta">Today · {patients.length} patients</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Today</span>
          {patients.map((p) => (
            <button key={p.id} type="button" onClick={() => setSelectedId(p.id)} className={p.id === base.id ? 'patientNav active patientNavButton' : 'patientNav patientNavButton'}>
              <strong>{p.time} · {p.name}</strong>
              <span>{edits[p.id]?.label ?? p.treatment}</span>
              <em>{treatmentCompleted[p.id] ? 'Complete' : clinicianConfirmed[p.id] ? 'Consent complete' : p.clinicianStatus}</em>
            </button>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Current patient</span>
              <h1>{patient.name}</h1>
              <p>{patient.treatment} · {patient.time}</p>
            </div>
            <span className={`status ${completed || confirmed || ready ? 'green' : 'amber'}`}>
              {completed ? 'Treatment complete' : confirmed ? 'Consent discussion complete' : ready ? 'Ready to confirm' : `${outstanding.length} to cover`}
            </span>
          </div>

          <div className="metricGrid" style={{ marginBottom: 18 }}>
            <div className="metric"><span>Pre-care</span><strong>{patient.journey}</strong></div>
            <div className="metric"><span>Consent points</span><strong>{completeCount}/{checklist.length}</strong></div>
            <div className="metric"><span>Language</span><strong>{patient.language}</strong></div>
            <div className="metric"><span>Attendance</span><strong>{patient.attendance}</strong></div>
          </div>

          {priorityItems.length > 0 && (
            <section className="dashboardCard" style={{ marginBottom: 18 }}>
              <div className="cardHeader"><div><span className="eyebrow">60-second briefing</span><h2>Know this before you start</h2></div></div>
              <div className="auditList">
                {priorityItems.map((item) => <div className="auditRow" key={item}><span>{item}</span><strong>Review</strong></div>)}
              </div>
            </section>
          )}

          <section className="dashboardCard" style={{ marginBottom: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Treatment</span><h2>{patient.treatment}</h2></div>
              <span className={`status ${edits[base.id] ? 'amber' : 'green'}`}>{edits[base.id] ? 'Changed in clinic' : 'Matches pre-care'}</span>
            </div>
            <div className="section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 12, alignItems: 'end' }}>
              <label>
                <span className="sectionTitle">Edit treatment if needed</span>
                <select className="adminInput" value={draft} onChange={(e) => setDraft(e.target.value)}>
                  {treatments.map((t) => <option key={t.label} value={t.label}>{t.label}</option>)}
                </select>
              </label>
              <button className="secondary desktopButton" type="button" onClick={applyTreatmentChange} disabled={!draft || draft === patient.treatment}>Update</button>
            </div>
            {draft !== patient.treatment && (
              <div className="section"><textarea className="questionBox" value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="Optional reason for change..." /></div>
            )}
          </section>

          {pendingChange && (
            <section className="dashboardCard alertCard" style={{ marginBottom: 18 }}>
              <div className="cardHeader"><div><span className="eyebrow">Treatment changed</span><h2>Only cover these new points</h2></div><span className="status amber">Required</span></div>
              <div className="auditList">
                {checklist.filter((p) => addedIds.includes(p.id)).map((p) => <div className="auditRow" key={p.id}><span>{p.label}</span><strong>Discuss</strong></div>)}
              </div>
              <div className="section"><button className="primary desktopButton" type="button" onClick={discussNewPoints}>✓ All discussed</button></div>
            </section>
          )}

          {!pendingChange && outstanding.length > 0 && (
            <section className="dashboardCard alertCard" style={{ marginBottom: 18 }}>
              <div className="cardHeader"><div><span className="eyebrow">Your discussion</span><h2>{outstanding.length} point{outstanding.length === 1 ? '' : 's'} to cover</h2></div><span className="status amber">Action</span></div>
              <div className="auditList">
                {outstanding.map((point) => (
                  <button key={point.id} type="button" onClick={() => setPoint(point.id, true)} className="auditRow" style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer', borderLeft: 0, borderRight: 0, borderTop: 0 }}>
                    <span><strong>{point.label}</strong>{point.detail ? ` · ${point.detail}` : ''}</span><strong>Mark discussed</strong>
                  </button>
                ))}
              </div>
            </section>
          )}

          {ready && !confirmed && (
            <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}>
              <div className="cardHeader"><div><span className="eyebrow">Clinician confirmation</span><h2>All consent points covered</h2></div><span className="status green">Ready</span></div>
              <div className="section"><p>I confirm that I have reviewed the pre-care record, covered all outstanding and patient-specific points, and addressed relevant questions.</p></div>
              <div className="section"><button className="primary desktopButton" type="button" onClick={confirmDiscussion}>Confirm clinical discussion complete</button></div>
            </section>
          )}

          {confirmed && !completed && (
            <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}>
              <div className="cardHeader"><div><span className="eyebrow">Consent complete</span><h2>Patient confirmation can now follow</h2></div><span className="status green">Clinician confirmed</span></div>
              <div className="section"><p>The clinical discussion is complete and retained in the audit record. Once treatment has been carried out, record the treatment actually performed.</p></div>
              <div className="section"><button className="primary desktopButton" type="button" onClick={completeTreatment}>Mark treatment completed & generate aftercare</button></div>
            </section>
          )}

          {completed && (
            <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}>
              <div className="cardHeader"><div><span className="eyebrow">Sitora After</span><h2>Aftercare generated</h2></div><span className="status green">Ready</span></div>
              <div className="section"><p><strong>{patient.treatment}</strong> has been recorded as the treatment performed. The matching aftercare journey has been created.</p></div>
              <div className="section"><Link className="primary desktopButton" href={`/after/${base.id}`}>Open patient aftercare</Link></div>
            </section>
          )}

          <details className="dashboardCard" style={{ marginBottom: 18 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 800, color: '#173f3d', padding: 4 }}>Full consent checklist · {completeCount}/{checklist.length}</summary>
            <div className="auditList" style={{ marginTop: 16 }}>
              {checklist.map((point) => (
                <div className="auditRow" key={point.id}>
                  <span>{point.label}</span>
                  <strong>{covered[point.id] ? (point.source === 'pre-care' ? 'Pre-care covered' : 'Discussed') : 'Outstanding'}</strong>
                </div>
              ))}
            </div>
          </details>

          <details className="dashboardCard" style={{ marginBottom: 32 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 800, color: '#173f3d', padding: 4 }}>Audit & clarification · {(audit[base.id] ?? []).length} events</summary>
            <div className="section" style={{ marginTop: 16 }}>
              <textarea className="questionBox" value={clarification} onChange={(e) => setClarification(e.target.value)} placeholder="Add a material clarification..." />
              <button className="secondary desktopButton" type="button" onClick={saveClarification} disabled={!clarification.trim()} style={{ marginTop: 10 }}>Save to audit</button>
            </div>
            <div className="auditList">
              <div className="auditRow"><span>Pre-care journey</span><strong>{patient.journey} · retained</strong></div>
              {(audit[base.id] ?? []).map((event) => <div className="auditRow" key={event.id}><span>{event.time} · {event.title}</span><strong>{event.detail}</strong></div>)}
            </div>
          </details>
        </section>
      </section>
    </main>
  );
}
