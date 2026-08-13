'use client';

import { useState } from 'react';
import Link from 'next/link';
import { askSitora, askSitoraPrompts } from '../lib/ask-sitora';

export default function AskSitoraWorkspace() {
  const [query, setQuery] = useState('What needs attention tomorrow?');
  const [result, setResult] = useState(() =>
    askSitora('What needs attention tomorrow?'),
  );

  const run = (value = query) => {
    setQuery(value);
    setResult(askSitora(value));
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Executive Intelligence</div>
        </div>

        <div className="headerMeta">
          Grounded in current prototype data
        </div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Intelligence</span>

          <div className="patientNav active">
            <strong>Ask Sitora</strong>
          </div>

          <Link href="/admin" className="patientNav">
            <strong>Overview</strong>
          </Link>

          <Link href="/admin/analytics" className="patientNav">
            <strong>Analytics</strong>
          </Link>

          <Link href="/admin/audit" className="patientNav">
            <strong>Audit</strong>
          </Link>

          <Link href="/admin/governance" className="patientNav">
            <strong>Governance</strong>
          </Link>
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Ask Sitora</span>
              <h1>Ask the operation, not the dashboard.</h1>
              <p>
                Turn readiness, patient understanding, capacity and
                governance data into an executive answer.
              </p>
            </div>

            <span className="status green">Dataset grounded</span>
          </div>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader">
                <div>
                  <span className="eyebrow">Executive question</span>
                  <h2>What do you want to know?</h2>
                </div>
              </div>

              <div className="section">
                <textarea
                  className="questionBox"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ minHeight: 110 }}
                />

                <button
                  className="primary desktopButton"
                  onClick={() => run()}
                  style={{ marginTop: 14 }}
                >
                  Ask Sitora
                </button>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Suggested questions
                </span>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {askSitoraPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      className="secondary desktopButton"
                      onClick={() => run(prompt)}
                      style={{
                        minWidth: 0,
                        minHeight: 40,
                        padding: '0 12px',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader">
                <div>
                  <span className="eyebrow">Sitora response</span>
                  <h2>{result.headline}</h2>
                </div>

                <span className="status neutral">
                  Grounded answer
                </span>
              </div>

              <div className="section">
                <span className="sectionTitle">Answer</span>
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.65,
                    color: '#173f3d',
                  }}
                >
                  {result.answer}
                </p>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Executive interpretation
                </span>
                <p>{result.insight}</p>
              </div>
            </section>
          </div>

          <section
            className="dashboardCard"
            style={{ marginTop: 18 }}
          >
            <div className="cardHeader">
              <div>
                <span className="eyebrow">
                  Intelligence boundary
                </span>
                <h2>Grounded, not generative guesswork.</h2>
              </div>
            </div>

            <div className="section">
              <p>
                This prototype only answers from the Sitora demo
                dataset. A production version would use permissioned
                operational data, governed clinical content and a
                traceable retrieval layer before producing an answer.
              </p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}