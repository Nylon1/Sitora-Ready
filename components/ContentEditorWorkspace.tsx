'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { EditableContentModule } from '../lib/content-editor-data';

export default function ContentEditorWorkspace({ module }: { module: EditableContentModule }) {
  const [body, setBody] = useState(module.body);
  const [question, setQuestion] = useState(module.question ?? '');
  const [answer, setAnswer] = useState(module.answer ?? '');
  const [rationale, setRationale] = useState(module.rationale ?? '');
  const [status, setStatus] = useState(module.status);
  const [notice, setNotice] = useState('');

  const dirty = useMemo(() => body !== module.body || question !== (module.question ?? '') || answer !== (module.answer ?? '') || rationale !== (module.rationale ?? ''), [body, question, answer, rationale, module]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const saveDraft = () => {
    setStatus('Draft');
    notify('Draft saved in prototype');
  };

  const approve = () => {
    setStatus('Approved');
    notify('Approved version created in prototype');
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Clinical Content Editor</div>
        </div>
        <Link href="/admin/content" className="secondary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Back to Library</Link>
      </header>

      <section className="practiceShell">
        <div className="heroPanel">
          <div>
            <span className="eyebrow">{module.treatmentName} · {module.type}</span>
            <h1>{module.title}</h1>
            <p>Edit patient-facing content without changing the currently approved version until governance approval is recorded.</p>
          </div>
          <span className={`status ${status === 'Approved' ? 'green' : 'amber'}`}>{status}</span>
        </div>

        <div className="metricGrid">
          <div className="metric"><span>Current version</span><strong>{module.version}</strong></div>
          <div className="metric"><span>Required</span><strong>{module.required ? 'Yes' : 'No'}</strong></div>
          <div className="metric"><span>Versions</span><strong>{module.versions.length}</strong></div>
          <div className="metric"><span>Unsaved changes</span><strong>{dirty ? 'Yes' : 'No'}</strong></div>
        </div>

        <div className="desktopCards">
          <section className="dashboardCard">
            <div className="cardHeader"><div><span className="eyebrow">Editor</span><h2>Patient-facing wording</h2></div><span className="status neutral">Working copy</span></div>
            <div className="section">
              <span className="sectionTitle">Content</span>
              <textarea className="questionBox" style={{minHeight:220}} value={body} onChange={e => setBody(e.target.value)} />
            </div>

            {module.type === 'Comprehension' && (
              <>
                <div className="section"><span className="sectionTitle">Question</span><textarea className="questionBox" style={{minHeight:90}} value={question} onChange={e => setQuestion(e.target.value)} /></div>
                <div className="section"><span className="sectionTitle">Correct answer</span><input className="adminInput" value={answer} onChange={e => setAnswer(e.target.value)} /></div>
                <div className="section"><span className="sectionTitle">Correction / rationale</span><textarea className="questionBox" style={{minHeight:120}} value={rationale} onChange={e => setRationale(e.target.value)} /></div>
              </>
            )}

            <div className="section" style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="secondary desktopButton" onClick={saveDraft}>Save draft</button>
              <button className="primary desktopButton" onClick={approve}>Approve new version</button>
            </div>
          </section>

          <section className="dashboardCard">
            <div className="cardHeader"><div><span className="eyebrow">Governance</span><h2>Publishing controls</h2></div></div>
            <div className="section"><span className="sectionTitle">Current published state</span><p>{module.status} · {module.version}</p></div>
            <div className="section"><span className="sectionTitle">Rule</span><p>Saving a draft must not change content already assigned to completed patient journeys. A newly approved version should apply only according to the configured publication rule.</p></div>
            <div className="section"><span className="sectionTitle">Clinical responsibility</span><p>Clinical content should be reviewed and approved by an authorised clinical governance user before publication.</p></div>
            <div className="section"><span className="sectionTitle">Audit expectation</span><p>Each patient journey should retain the exact content version seen by that patient, even after newer versions are published.</p></div>
          </section>
        </div>

        <section className="dashboardCard">
          <div className="cardHeader"><div><span className="eyebrow">Version history</span><h2>Trace every change</h2></div><span className="status neutral">Immutable history concept</span></div>
          <div className="auditList">
            {module.versions.map(version => (
              <div className="auditRow" key={version.version} style={{gridTemplateColumns:'100px 110px 1fr 140px'}}>
                <strong style={{textAlign:'left'}}>{version.version}</strong>
                <span><span className={`status ${version.status === 'Approved' ? 'green' : version.status === 'Draft' ? 'amber' : 'neutral'}`}>{version.status}</span></span>
                <span>{version.summary}</span>
                <strong>{version.date}</strong>
              </div>
            ))}
          </div>
        </section>

        {notice && <div style={{position:'fixed',right:24,bottom:24,padding:'14px 18px',borderRadius:14,background:'#173f3d',color:'#fff',boxShadow:'0 16px 40px rgba(0,0,0,.18)',fontWeight:800,fontSize:13}}>{notice}</div>}
      </section>
    </main>
  );
}
