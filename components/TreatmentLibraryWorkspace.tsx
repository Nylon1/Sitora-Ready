'use client';

import { useMemo, useState } from 'react';
import { treatmentDefinitions } from '../lib/treatment-content';

export default function TreatmentLibraryWorkspace() {
  const [selectedId, setSelectedId] = useState('implant');
  const selected = useMemo(() => treatmentDefinitions.find((item) => item.id === selectedId) ?? treatmentDefinitions[0], [selectedId]);
  const approved = selected.content.filter((item) => item.status === 'Approved').length;
  const drafts = selected.content.filter((item) => item.status === 'Draft').length;

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Treatment & Content Library</div></div>
        <div className="headerMeta">Governed clinical content · Prototype</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Treatments</span>
          {treatmentDefinitions.map((treatment) => (
            <button key={treatment.id} className={treatment.id === selected.id ? 'patientNav active' : 'patientNav'} onClick={() => setSelectedId(treatment.id)} style={{border:0,textAlign:'left',width:'100%'}}>
              <strong>{treatment.name}</strong>
              <span>{treatment.category}</span>
            </button>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div><span className="eyebrow">Treatment pathway</span><h1>{selected.name}</h1><p>{selected.category} · Estimated patient journey {selected.estimatedMinutes} minutes</p></div>
            <span className={drafts ? 'status amber' : 'status green'}>{drafts ? `${drafts} draft item${drafts > 1 ? 's' : ''}` : 'Ready to use'}</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Content modules</span><strong>{selected.content.length}</strong></div>
            <div className="metric"><span>Approved</span><strong>{approved}</strong></div>
            <div className="metric"><span>Draft</span><strong>{drafts}</strong></div>
            <div className="metric"><span>Journey length</span><strong>{selected.estimatedMinutes} min</strong></div>
          </div>

          <section className="dashboardCard">
            <div className="cardHeader"><div><span className="eyebrow">Governed pathway</span><h2>Patient content sequence</h2></div><button className="primary desktopButton">+ Add module</button></div>
            <div className="practiceTable">
              <div className="practiceRow practiceHead" style={{gridTemplateColumns:'70px 1.4fr 120px 1.8fr 90px 90px'}}><span>Order</span><span>Module</span><span>Type</span><span>Purpose</span><span>Version</span><span>Status</span></div>
              {selected.content.map((item, index) => (
                <div className="practiceRow" key={item.id} style={{gridTemplateColumns:'70px 1.4fr 120px 1.8fr 90px 90px'}}>
                  <strong>{String(index + 1).padStart(2,'0')}</strong>
                  <span><strong style={{display:'block',color:'#173f3d'}}>{item.title}</strong>{item.required ? 'Required' : 'Optional'}</span>
                  <span>{item.kind}</span>
                  <span>{item.summary}</span>
                  <span>v{item.version}</span>
                  <span className={item.status === 'Approved' ? 'status green' : 'status amber'}>{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="desktopCards" style={{marginTop:18}}>
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Clinical governance</span><h2>Publishing controls</h2></div></div>
              <div className="section"><span className="sectionTitle">Rule</span><p>Only approved, versioned content should be available to live patient journeys. Draft modules remain visible to administrators but are not sent.</p></div>
              <div className="section"><span className="sectionTitle">Change control</span><p>A later production build should capture author, clinical reviewer, approval date, source references and superseded versions.</p></div>
            </section>
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Comprehension</span><h2>Understanding checks</h2></div></div>
              <div className="auditList">
                {selected.content.filter((item) => item.kind === 'Comprehension').length === 0 && <p className="muted">No comprehension check has been added yet.</p>}
                {selected.content.filter((item) => item.kind === 'Comprehension').map((item) => <div className="auditRow" key={item.id}><span>{item.title}</span><strong>{item.status}</strong></div>)}
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
