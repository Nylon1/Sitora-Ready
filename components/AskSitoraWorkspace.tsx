'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { askSitora, askSitoraPrompts, SitoraAnswer } from '../lib/ask-sitora';

type Exchange = { id: number; question: string; answer: SitoraAnswer };

export default function AskSitoraWorkspace() {
  const starter = 'What needs attention tomorrow?';
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<Exchange[]>([
    { id: 1, question: starter, answer: askSitora(starter) },
  ]);

  const latest = history[history.length - 1]?.answer;

  const run = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setHistory((items) => [...items, { id: Date.now(), question: clean, answer: askSitora(clean) }]);
    setQuery('');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(query);
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Executive Intelligence</div>
        </div>
        <div className="headerMeta">Grounded in current prototype data</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Intelligence</span>
          <div className="patientNav active"><strong>Ask Sitora</strong><span>Executive AI</span></div>
          <Link href="/admin" className="patientNav"><strong>Overview</strong></Link>
          <Link href="/admin/analytics" className="patientNav"><strong>Analytics</strong></Link>
          <Link href="/admin/audit" className="patientNav"><strong>Audit</strong></Link>
          <Link href="/admin/governance" className="patientNav"><strong>Governance</strong></Link>
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Ask Sitora</span>
              <h1>Your operation, explained.</h1>
              <p>Ask a question. Sitora traces the answer back to readiness, patient, capacity and governance data.</p>
            </div>
            <span className="status green">Dataset grounded</span>
          </div>

          <div className="metricGrid">
            <div className="metric"><span>Mode</span><strong>Executive AI</strong></div>
            <div className="metric"><span>Answers</span><strong>{history.length}</strong></div>
            <div className="metric"><span>Evidence</span><strong>{latest?.evidence.length ?? 0}</strong></div>
            <div className="metric"><span>Boundary</span><strong>Prototype data</strong></div>
          </div>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader">
                <div><span className="eyebrow">Conversation</span><h2>Ask the operation</h2></div>
                <button className="secondary desktopButton" onClick={() => setHistory([])}>New conversation</button>
              </div>

              <div style={{ display: 'grid', gap: 14, padding: '0 18px 18px' }}>
                {history.length === 0 && <div className="section"><p className="muted">Start with a suggested executive question below.</p></div>}
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'grid', gap: 10 }}>
                    <div style={{ justifySelf: 'end', maxWidth: '82%', background: '#173f3d', color: 'white', borderRadius: 18, padding: '12px 16px' }}>
                      {item.question}
                    </div>
                    <div style={{ maxWidth: '94%', background: '#f8faf9', border: '1px solid #dce6e3', borderRadius: 18, padding: '16px' }}>
                      <span className="eyebrow">Sitora</span>
                      <h3 style={{ margin: '5px 0 8px' }}>{item.answer.headline}</h3>
                      <p style={{ margin: 0, lineHeight: 1.65 }}>{item.answer.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={submit} className="section">
                <textarea
                  className="questionBox"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Sitora about tomorrow, capacity, understanding, branches, support..."
                  style={{ minHeight: 88 }}
                />
                <button className="primary desktopButton" type="submit" style={{ marginTop: 12 }}>Ask Sitora</button>
              </form>

              <div className="section">
                <span className="sectionTitle">Try asking</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(latest?.followUps?.length ? latest.followUps : askSitoraPrompts.slice(0, 4)).map((prompt) => (
                    <button key={prompt} className="secondary desktopButton" onClick={() => run(prompt)} style={{ minWidth: 0, minHeight: 38, padding: '0 12px' }}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader">
                <div><span className="eyebrow">Why this answer</span><h2>Traceable evidence</h2></div>
                <span className="status neutral">Grounded</span>
              </div>

              {latest ? (
                <>
                  <div className="section">
                    <span className="sectionTitle">Executive interpretation</span>
                    <p>{latest.insight}</p>
                  </div>

                  <div className="auditList">
                    {latest.evidence.map((item, index) =>
                      item.href ? (
                        <Link href={item.href} className="auditRow" key={`${item.label}-${index}`} style={{ textDecoration: 'none' }}>
                          <span>{item.label}</span><strong>{item.value} →</strong>
                        </Link>
                      ) : (
                        <div className="auditRow" key={`${item.label}-${index}`}>
                          <span>{item.label}</span><strong>{item.value}</strong>
                        </div>
                      )
                    )}
                  </div>

                  <div className="section">
                    <span className="sectionTitle">Suggested action</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {latest.actions.map((action) => (
                        <Link key={action.href + action.label} href={action.href} className="primary desktopButton" style={{ textDecoration: 'none' }}>
                          {action.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="section"><p className="muted">Ask a question to see its evidence trail.</p></div>
              )}
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Intelligence boundary</span><h2>Grounded before generated.</h2></div>
            </div>
            <div className="section">
              <p>This prototype answers only from the synthetic Sitora dataset. A production version would retrieve permissioned operational records and governed clinical content, preserve source provenance, and keep clinical decisions with the treating team.</p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
