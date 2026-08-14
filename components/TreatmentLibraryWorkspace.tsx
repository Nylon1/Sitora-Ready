'use client';

import { useEffect, useMemo, useState } from 'react';
import { treatmentRegistry, type TreatmentRegistryItem } from '../lib/treatment-registry';

const emptyTreatment = (): TreatmentRegistryItem => ({
  id: `treatment-${Date.now()}`,
  label: 'New treatment',
  aliases: [],
  category: 'Dentistry',
  estimatedMinutes: 5,
  status: 'Draft',
  version: '0.1',
  modules: [],
  content: [],
  consentPoints: [],
});

export default function TreatmentLibraryWorkspace() {
  const [items, setItems] = useState<TreatmentRegistryItem[]>(treatmentRegistry);
  const [selectedId, setSelectedId] = useState(treatmentRegistry[0].id);
  const [draft, setDraft] = useState<TreatmentRegistryItem>(treatmentRegistry[0]);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [source, setSource] = useState('static-fallback');
  const [message, setMessage] = useState('');

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? items[0], [items, selectedId]);

  useEffect(() => {
    fetch('/api/treatments').then((r) => r.json()).then((data) => {
      if (data.treatments?.length) {
        setItems(data.treatments);
        setSelectedId(data.treatments[0].id);
        setDraft(data.treatments[0]);
      }
      setSource(data.persistence ?? 'static-fallback');
    }).catch(() => setSource('static-fallback'));
  }, []);

  useEffect(() => {
    if (selected) setDraft(selected);
  }, [selected]);

  if (!selected) return null;

  const save = async (status = draft.status) => {
    setMessage('Saving…');
    const body = { ...draft, status } as TreatmentRegistryItem;
    const exists = items.some((item) => item.id === body.id);
    const response = await fetch(exists ? `/api/treatments/${body.id}` : '/api/treatments', {
      method: exists ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Save failed');
    setItems((current) => [...current.filter((item) => item.id !== data.treatment.id), data.treatment]);
    setSelectedId(data.treatment.id);
    setMode('view');
    setMessage(status === 'In review' ? 'Submitted for clinical review.' : 'Draft saved.');
  };

  const publish = async () => {
    setMessage('Publishing…');
    const response = await fetch(`/api/treatments/${selected.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish' }),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Publish failed');
    setItems((current) => current.map((item) => item.id === data.treatment.id ? data.treatment : item));
    setMessage('Published. Runtime engines can now use this version.');
  };

  const parseJson = <T,>(value: string, fallback: T): T => {
    try { return JSON.parse(value); } catch { return fallback; }
  };

  const drafts = selected.content.filter((item) => item.status !== 'Approved').length;

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Treatment Registry</div></div>
        <div className="headerMeta">{source === 'supabase' ? 'Supabase connected' : 'Static fallback'} · governed runtime</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Treatments</span>
          {items.map((item) => <button key={item.id} className={item.id === selected.id ? 'patientNav active' : 'patientNav'} onClick={() => { setSelectedId(item.id); setMode('view'); }} style={{ border: 0, textAlign: 'left', width: '100%' }}><strong>{item.label}</strong><span>{item.category}</span><em>{item.status}</em></button>)}
          <button className="secondary desktopButton" style={{ marginTop: 16 }} onClick={() => { const item = emptyTreatment(); setItems((v) => [...v, item]); setSelectedId(item.id); setDraft(item); setMode('edit'); }}>+ New treatment</button>
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div><span className="eyebrow">Governed treatment</span><h1>{selected.label}</h1><p>{selected.category} · v{selected.version} · {selected.estimatedMinutes} min journey</p></div>
            <span className={`status ${selected.status === 'Approved' ? 'green' : 'amber'}`}>{selected.status}</span>
          </div>

          {message && <section className="dashboardCard" style={{ marginBottom: 18 }}><div className="section"><strong>{message}</strong></div></section>}

          {mode === 'edit' ? (
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Editor</span><h2>Draft treatment definition</h2></div></div>
              <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label><span className="sectionTitle">Label</span><input className="adminInput" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></label>
                <label><span className="sectionTitle">Category</span><input className="adminInput" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></label>
                <label><span className="sectionTitle">Version</span><input className="adminInput" value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} /></label>
                <label><span className="sectionTitle">Journey minutes</span><input className="adminInput" type="number" value={draft.estimatedMinutes} onChange={(e) => setDraft({ ...draft, estimatedMinutes: Number(e.target.value) })} /></label>
              </div>
              <div className="section"><span className="sectionTitle">Aliases · comma separated</span><input className="adminInput" value={draft.aliases.join(', ')} onChange={(e) => setDraft({ ...draft, aliases: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} /></div>
              <div className="section"><span className="sectionTitle">Pathway modules · comma separated</span><input className="adminInput" value={draft.modules.join(', ')} onChange={(e) => setDraft({ ...draft, modules: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} /></div>
              <div className="section"><span className="sectionTitle">Patient content JSON</span><textarea className="questionBox" style={{ minHeight: 180 }} defaultValue={JSON.stringify(draft.content, null, 2)} onBlur={(e) => setDraft((d) => ({ ...d, content: parseJson(e.target.value, d.content) }))} /></div>
              <div className="section"><span className="sectionTitle">Consent rules JSON</span><textarea className="questionBox" style={{ minHeight: 180 }} defaultValue={JSON.stringify(draft.consentPoints, null, 2)} onBlur={(e) => setDraft((d) => ({ ...d, consentPoints: parseJson(e.target.value, d.consentPoints) }))} /></div>
              <div className="section" style={{ display: 'flex', gap: 10 }}><button className="secondary desktopButton" onClick={() => save('Draft')}>Save draft</button><button className="primary desktopButton" onClick={() => save('In review')}>Submit for clinical review</button><button className="secondary desktopButton" onClick={() => setMode('view')}>Cancel</button></div>
            </section>
          ) : (
            <>
              <div className="metricGrid"><div className="metric"><span>Patient modules</span><strong>{selected.content.length}</strong></div><div className="metric"><span>Consent points</span><strong>{selected.consentPoints.length}</strong></div><div className="metric"><span>Draft content</span><strong>{drafts}</strong></div><div className="metric"><span>Status</span><strong>{selected.status}</strong></div></div>
              <section className="dashboardCard" style={{ marginBottom: 18 }}><div className="cardHeader"><div><span className="eyebrow">Governance</span><h2>Draft → review → publish</h2></div><div style={{ display: 'flex', gap: 8 }}><button className="secondary desktopButton" onClick={() => setMode('edit')}>Edit</button><button className="primary desktopButton" disabled={selected.status !== 'In review'} onClick={publish}>Publish approved version</button></div></div><div className="auditList"><div className="auditRow"><span>Treatment ID</span><strong>{selected.id}</strong></div><div className="auditRow"><span>Aliases</span><strong>{selected.aliases.join(' · ') || 'None'}</strong></div><div className="auditRow"><span>Modules</span><strong>{selected.modules.join(' · ') || 'None'}</strong></div><div className="auditRow"><span>Version</span><strong>v{selected.version}</strong></div></div></section>
              <div className="desktopCards"><section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Before</span><h2>Patient content</h2></div></div><div className="auditList">{selected.content.map((item) => <div className="auditRow" key={item.id}><span>{item.title}</span><strong>{item.status}</strong></div>)}</div></section><section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">During</span><h2>Consent rules</h2></div></div><div className="auditList">{selected.consentPoints.map((point) => <div className="auditRow" key={point.id}><span>{point.label}</span><strong>{point.source}</strong></div>)}</div></section></div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
