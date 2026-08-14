'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { demoPatients, type DemoPatient } from '../lib/demo-data';
import { createInitialCoverage, getConsentChecklist, getTreatmentChangePrompt, getTreatmentOptions } from '../lib/consent-engine';
import { treatmentRegistry, type TreatmentRegistryItem } from '../lib/treatment-registry';

type AuditEvent = { id: string; time: string; title: string; detail: string };
type TreatmentOption = ReturnType<typeof getTreatmentOptions>[number];
const stamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ClinicianWorkspaceV4() {
  const patients = demoPatients.filter((p) => p.attendance !== 'Cancel');
  const [runtimeRegistry, setRuntimeRegistry] = useState<TreatmentRegistryItem[]>(treatmentRegistry.filter((t) => t.status === 'Approved'));
  const [registrySource, setRegistrySource] = useState('static fallback');
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const [edits, setEdits] = useState<Record<string, TreatmentOption>>({});
  const [draftTreatment, setDraftTreatment] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [coveredByPatient, setCoveredByPatient] = useState<Record<string, Record<string, boolean>>>({});
  const [newPointIds, setNewPointIds] = useState<Record<string, string[]>>({});
  const [changePending, setChangePending] = useState<Record<string, boolean>>({});
  const [confirmedByPatient, setConfirmedByPatient] = useState<Record<string, boolean>>({});
  const [completedByPatient, setCompletedByPatient] = useState<Record<string, boolean>>({});
  const [audit, setAudit] = useState<Record<string, AuditEvent[]>>({});

  useEffect(() => {
    fetch('/api/treatments?published=1').then((r) => r.json()).then((data) => {
      if (data.treatments?.length) setRuntimeRegistry(data.treatments);
      setRegistrySource(data.persistence === 'supabase' ? 'Supabase published registry' : 'static published registry');
    }).catch(() => setRegistrySource('static published registry'));
  }, []);

  const base = useMemo(() => patients.find((p) => p.id === selectedId) ?? patients[0], [patients, selectedId]);
  const options = useMemo(() => getTreatmentOptions(runtimeRegistry), [runtimeRegistry]);
  const chosen = edits[base.id];
  const patient = useMemo<DemoPatient>(() => chosen ? { ...base, treatment: chosen.label, treatmentModules: chosen.modules } : base, [base, chosen]);
  const checklist = useMemo(() => getConsentChecklist(patient, runtimeRegistry), [patient, runtimeRegistry]);
  const covered = coveredByPatient[base.id] ?? {};
  const pending = Boolean(changePending[base.id]);
  const confirmed = Boolean(confirmedByPatient[base.id]);
  const completed = Boolean(completedByPatient[base.id]);

  useEffect(() => {
    setDraftTreatment(patient.treatment);
    setCoveredByPatient((current) => current[base.id] ? current : { ...current, [base.id]: createInitialCoverage(patient, checklist) });
  }, [base.id, patient, checklist]);

  const addAudit = (title: string, detail: string) => setAudit((current) => ({ ...current, [base.id]: [...(current[base.id] ?? []), { id: `${Date.now()}-${Math.random()}`, time: stamp(), title, detail }] }));
  const setPoint = (id: string) => {
    setCoveredByPatient((current) => ({ ...current, [base.id]: { ...(current[base.id] ?? {}), [id]: true } }));
    setConfirmedByPatient((current) => ({ ...current, [base.id]: false }));
  };

  const outstanding = checklist.filter((point) => !covered[point.id]);
  const ready = outstanding.length === 0 && !pending;

  const updateTreatment = () => {
    const option = options.find((item) => item.label === draftTreatment);
    if (!option || option.label === patient.treatment) return;
    const nextPatient: DemoPatient = { ...base, treatment: option.label, treatmentModules: option.modules };
    const nextChecklist = getConsentChecklist(nextPatient, runtimeRegistry);
    const promptIds = getTreatmentChangePrompt(patient, nextPatient, runtimeRegistry);
    const nextCovered: Record<string, boolean> = {};
    nextChecklist.forEach((point) => { nextCovered[point.id] = covered[point.id] ?? (point.source === 'pre-care' && base.journey === 'Complete'); });
    promptIds.forEach((id) => { nextCovered[id] = false; });
    nextCovered.plan = false;
    setEdits((current) => ({ ...current, [base.id]: option }));
    setCoveredByPatient((current) => ({ ...current, [base.id]: nextCovered }));
    setNewPointIds((current) => ({ ...current, [base.id]: promptIds }));
    setChangePending((current) => ({ ...current, [base.id]: true }));
    setConfirmedByPatient((current) => ({ ...current, [base.id]: false }));
    addAudit('Treatment changed', `${patient.treatment} → ${option.label}${changeNote.trim() ? ` · ${changeNote.trim()}` : ''}`);
  };

  const finishChangedDiscussion = () => {
    const ids = newPointIds[base.id] ?? [];
    const next = { ...covered };
    ids.forEach((id) => { next[id] = true; });
    next.plan = true;
    setCoveredByPatient((current) => ({ ...current, [base.id]: next }));
    setChangePending((current) => ({ ...current, [base.id]: false }));
    addAudit('Additional consent points discussed', checklist.filter((p) => ids.includes(p.id)).map((p) => p.label).join(' · '));
  };

  const confirm = () => {
    if (!ready) return;
    setConfirmedByPatient((current) => ({ ...current, [base.id]: true }));
    addAudit('Clinician confirmation', 'All required consent points confirmed as covered and relevant questions addressed.');
  };

  const complete = () => {
    if (!confirmed) return;
    setCompletedByPatient((current) => ({ ...current, [base.id]: true }));
    addAudit('Treatment completed', `${patient.treatment} recorded as performed.`);
    addAudit('Aftercare generated', `Sitora After generated for ${patient.treatment}.`);
  };

  const support = [...patient.accessibility, ...patient.support];
  const briefing = [patient.understanding.toLowerCase().includes('corrected') ? `Understanding: ${patient.understanding}` : '', patient.question ? `Question: ${patient.question}` : '', patient.priority ? `What matters: ${patient.priority}` : '', patient.anxiety !== null && patient.anxiety >= 8 ? `High anxiety: ${patient.anxiety}/10` : '', support.length ? `Support: ${support.join(' · ')}` : ''].filter(Boolean);

  return (
    <main className="desktopApp">
      <header className="desktopHeader"><div><div className="brand">Sitora Ready™</div><div className="tagline">During · clinician workspace</div></div><div className="headerMeta">{registrySource}</div></header>
      <section className="desktopGrid">
        <aside className="desktopSidebar"><span className="eyebrow">Today</span>{patients.map((p) => <button key={p.id} type="button" onClick={() => setSelectedId(p.id)} className={p.id === base.id ? 'patientNav active patientNavButton' : 'patientNav patientNavButton'}><strong>{p.time} · {p.name}</strong><span>{edits[p.id]?.label ?? p.treatment}</span><em>{completedByPatient[p.id] ? 'Complete' : confirmedByPatient[p.id] ? 'Consent complete' : p.clinicianStatus}</em></button>)}</aside>
        <section className="desktopContent">
          <div className="heroPanel"><div><span className="eyebrow">Current patient</span><h1>{patient.name}</h1><p>{patient.treatment} · {patient.time}</p></div><span className={`status ${completed || confirmed || ready ? 'green' : 'amber'}`}>{completed ? 'Treatment complete' : confirmed ? 'Consent discussion complete' : ready ? 'Ready to confirm' : `${outstanding.length} to cover`}</span></div>

          {briefing.length > 0 && <section className="dashboardCard" style={{ marginBottom: 18 }}><div className="cardHeader"><div><span className="eyebrow">60-second briefing</span><h2>Know this before you start</h2></div></div><div className="auditList">{briefing.map((item) => <div className="auditRow" key={item}><span>{item}</span><strong>Review</strong></div>)}</div></section>}

          <section className="dashboardCard" style={{ marginBottom: 18 }}><div className="cardHeader"><div><span className="eyebrow">Treatment</span><h2>{patient.treatment}</h2></div><span className="status green">Published pathway</span></div><div className="section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 12, alignItems: 'end' }}><label><span className="sectionTitle">Edit treatment if needed</span><select className="adminInput" value={draftTreatment} onChange={(e) => setDraftTreatment(e.target.value)}>{options.map((item) => <option key={item.id} value={item.label}>{item.label}</option>)}</select></label><button className="secondary desktopButton" onClick={updateTreatment} disabled={!draftTreatment || draftTreatment === patient.treatment}>Update</button></div>{draftTreatment !== patient.treatment && <div className="section"><textarea className="questionBox" value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="Optional reason for change..." /></div>}</section>

          {pending && <section className="dashboardCard alertCard" style={{ marginBottom: 18 }}><div className="cardHeader"><div><span className="eyebrow">Treatment changed</span><h2>Only cover these new points</h2></div><span className="status amber">Required</span></div><div className="auditList">{checklist.filter((p) => (newPointIds[base.id] ?? []).includes(p.id)).map((p) => <div className="auditRow" key={p.id}><span>{p.label}</span><strong>Discuss</strong></div>)}</div><div className="section"><button className="primary desktopButton" onClick={finishChangedDiscussion}>✓ All discussed</button></div></section>}

          {!pending && outstanding.length > 0 && <section className="dashboardCard alertCard" style={{ marginBottom: 18 }}><div className="cardHeader"><div><span className="eyebrow">Your discussion</span><h2>{outstanding.length} point{outstanding.length === 1 ? '' : 's'} to cover</h2></div></div><div className="auditList">{outstanding.map((point) => <button key={point.id} type="button" onClick={() => setPoint(point.id)} className="auditRow" style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer', borderLeft: 0, borderRight: 0, borderTop: 0 }}><span><strong>{point.label}</strong>{point.detail ? ` · ${point.detail}` : ''}</span><strong>Mark discussed</strong></button>)}</div></section>}

          {ready && !confirmed && <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}><div className="cardHeader"><div><span className="eyebrow">Clinician confirmation</span><h2>All consent points covered</h2></div></div><div className="section"><button className="primary desktopButton" onClick={confirm}>Confirm clinical discussion complete</button></div></section>}
          {confirmed && !completed && <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}><div className="cardHeader"><div><span className="eyebrow">Consent complete</span><h2>Ready for patient confirmation</h2></div></div><div className="section"><button className="primary desktopButton" onClick={complete}>Mark treatment completed & generate aftercare</button></div></section>}
          {completed && <section className="dashboardCard" style={{ marginBottom: 18, background: '#eef7f2' }}><div className="cardHeader"><div><span className="eyebrow">Sitora After</span><h2>Aftercare generated</h2></div></div><div className="section"><Link className="primary desktopButton" href={`/after/${base.id}`}>Open patient aftercare</Link></div></section>}

          <details className="dashboardCard" style={{ marginBottom: 32 }}><summary style={{ cursor: 'pointer', fontWeight: 800 }}>Full checklist & audit</summary><div className="auditList" style={{ marginTop: 16 }}>{checklist.map((point) => <div className="auditRow" key={point.id}><span>{point.label}</span><strong>{covered[point.id] ? 'Covered' : 'Outstanding'}</strong></div>)}{(audit[base.id] ?? []).map((event) => <div className="auditRow" key={event.id}><span>{event.time} · {event.title}</span><strong>{event.detail}</strong></div>)}</div></details>
        </section>
      </section>
    </main>
  );
}
