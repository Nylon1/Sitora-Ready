'use client';

import { useMemo, useState } from 'react';
import { treatmentRegistry } from '../lib/treatment-registry';

export default function TreatmentLibraryWorkspace() {
  const [selectedId, setSelectedId] = useState(treatmentRegistry[0].id);
  const selected = useMemo(() => treatmentRegistry.find((item) => item.id === selectedId) ?? treatmentRegistry[0], [selectedId]);
  const approved = selected.content.filter((item) => item.status === 'Approved').length;
  const drafts = selected.content.filter((item) => item.status === 'Draft').length;
  const preCarePoints = selected.consentPoints.filter((point) => point.source === 'pre-care');
  const clinicianPoints = selected.consentPoints.filter((point) => point.source === 'clinician');

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Treatment & Consent Registry</div></div>
        <div className="headerMeta">One governed source of truth · Prototype</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Treatments</span>
          {treatmentRegistry.map((treatment) => (
            <button key={treatment.id} className={treatment.id === selected.id ? 'patientNav active' : 'patientNav'} onClick={() => setSelectedId(treatment.id)} style={{ border: 0, textAlign: 'left', width: '100%' }}>
              <strong>{treatment.label}</strong>
              <span>{treatment.category}</span>
              <em>{treatment.status}</em>
            </button>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Governed treatment</span>
              <h1>{selected.label}</h1>
              <p>{selected.category} · v{selected.version} · Estimated patient journey {selected.estimatedMinutes} minutes</p>
            </div>
            <span className={selected.status === 'Approved' && drafts === 0 ? 'status green' : 'status amber'}>{selected.status === 'Approved' && drafts === 0 ? 'Ready to use' : 'Governance review'}</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Patient modules</span><strong>{selected.content.length}</strong></div>
            <div className="metric"><span>Consent points</span><strong>{selected.consentPoints.length}</strong></div>
            <div className="metric"><span>Pre-care points</span><strong>{preCarePoints.length}</strong></div>
            <div className="metric"><span>Clinician points</span><strong>{clinicianPoints.length}</strong></div>
          </div>

          <section className="dashboardCard" style={{ marginBottom: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Registry</span><h2>One treatment definition drives the journey</h2></div>
              <span className="status green">Engine connected</span>
            </div>
            <div className="section"><p>This treatment record now supplies the clinician consent engine with its treatment label, aliases, modules and required consent points. The same registry also supplies the Admin Treatment Library.</p></div>
            <div className="auditList">
              <div className="auditRow"><span>Treatment ID</span><strong>{selected.id}</strong></div>
              <div className="auditRow"><span>Aliases</span><strong>{selected.aliases.join(' · ') || 'None'}</strong></div>
              <div className="auditRow"><span>Pathway modules</span><strong>{selected.modules.join(' · ') || 'None'}</strong></div>
              <div className="auditRow"><span>Registry version</span><strong>v{selected.version}</strong></div>
            </div>
          </section>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Before</span><h2>Patient content sequence</h2></div></div>
              <div className="auditList">
                {selected.content.length === 0 && <div className="auditRow"><span>No patient content configured yet</span><strong>Draft pathway</strong></div>}
                {selected.content.map((item, index) => (
                  <div className="auditRow" key={item.id}>
                    <span><strong>{String(index + 1).padStart(2, '0')} · {item.title}</strong><br />{item.kind} · v{item.version}</span>
                    <strong>{item.status}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">During</span><h2>Consent checklist rules</h2></div></div>
              <div className="auditList">
                {selected.consentPoints.map((point) => (
                  <div className="auditRow" key={point.id}>
                    <span>{point.label}</span>
                    <strong>{point.source === 'pre-care' ? 'Pre-care' : 'Clinician'}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader"><div><span className="eyebrow">Clinical governance</span><h2>Publishing readiness</h2></div></div>
            <div className="auditList">
              <div className="auditRow"><span>Registry status</span><strong>{selected.status}</strong></div>
              <div className="auditRow"><span>Approved content modules</span><strong>{approved}/{selected.content.length}</strong></div>
              <div className="auditRow"><span>Draft content modules</span><strong>{drafts}</strong></div>
              <div className="auditRow"><span>Required consent rules configured</span><strong>{selected.consentPoints.length}</strong></div>
            </div>
            <div className="section"><p>Production should only publish a treatment after the treatment definition, patient content and clinician consent rules have completed clinical governance. The next backend step is to persist this registry in Supabase with author, reviewer, approval and version history.</p></div>
          </section>
        </section>
      </section>
    </main>
  );
}
