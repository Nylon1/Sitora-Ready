'use client';

import Link from 'next/link';
import { editableContentModules } from '../lib/content-editor-data';

export default function ContentLibraryWorkspace() {
  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Clinical Content Library</div>
        </div>
        <Link href="/admin" className="secondary desktopButton" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>Back to Admin</Link>
      </header>

      <section className="practiceShell">
        <div className="heroPanel">
          <div>
            <span className="eyebrow">Governed clinical content</span>
            <h1>Content Library</h1>
            <p>Review, edit and approve the information patients receive. Every published change creates a traceable version.</p>
          </div>
          <span className="status green">Version controlled</span>
        </div>

        <div className="metricGrid">
          <div className="metric"><span>Total modules</span><strong>{editableContentModules.length}</strong></div>
          <div className="metric"><span>Approved</span><strong>{editableContentModules.filter(m => m.status === 'Approved').length}</strong></div>
          <div className="metric"><span>Draft</span><strong>{editableContentModules.filter(m => m.status === 'Draft').length}</strong></div>
          <div className="metric"><span>Comprehension checks</span><strong>{editableContentModules.filter(m => m.type === 'Comprehension').length}</strong></div>
        </div>

        <section className="dashboardCard">
          <div className="cardHeader">
            <div>
              <span className="eyebrow">Modules</span>
              <h2>Patient-facing clinical content</h2>
            </div>
            <span className="status neutral">Prototype data</span>
          </div>

          <div className="practiceTable">
            <div className="practiceRow practiceHead" style={{gridTemplateColumns:'1.4fr 1fr .8fr .7fr .7fr 110px'}}>
              <span>Module</span><span>Treatment</span><span>Type</span><span>Status</span><span>Version</span><span>Action</span>
            </div>
            {editableContentModules.map(module => (
              <div className="practiceRow" key={module.id} style={{gridTemplateColumns:'1.4fr 1fr .8fr .7fr .7fr 110px'}}>
                <strong>{module.title}</strong>
                <span>{module.treatmentName}</span>
                <span>{module.type}</span>
                <span><span className={`status ${module.status === 'Approved' ? 'green' : 'amber'}`}>{module.status}</span></span>
                <span>{module.version}</span>
                <Link href={`/admin/content/${module.id}`} className="actionText" style={{textDecoration:'none',fontWeight:800}}>Open editor</Link>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
