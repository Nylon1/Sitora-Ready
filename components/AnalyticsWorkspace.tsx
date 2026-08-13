'use client';

import Link from 'next/link';
import { analyticsSummary, monthlyTrend } from '../lib/analytics-summary';
import { branchMetrics, clinicianMetrics, supportNeeds } from '../lib/analytics-comparison';

export default function AnalyticsWorkspace() {
  const maxSupport = Math.max(...supportNeeds.map((item) => item.count));

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Analytics & Operational Intelligence</div>
        </div>
        <div className="headerMeta">Group view · Prototype</div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Intelligence</span>
          <Link className="patientNav" href="/admin"><strong>Overview</strong></Link>
          <div className="patientNav active"><strong>Analytics</strong></div>
          <Link className="patientNav" href="/admin/audit"><strong>Audit</strong></Link>
          <Link className="patientNav" href="/admin/governance"><strong>Governance</strong></Link>
          <Link className="patientNav" href="/admin/treatments"><strong>Treatments</strong></Link>
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Operating intelligence</span>
              <h1>See where pre-care is protecting capacity and where teams need attention.</h1>
              <p>Track journey completion, patient questions, follow-up reviews, pathway changes, accessibility demand and recovered chair time across the organisation.</p>
            </div>
            <span className="status green">Live demo data</span>
          </div>

          <div className="metricGrid">
            <Metric label="Journey completion" value={`${analyticsSummary.completionRate}%`} note={`${analyticsSummary.journeysCompleted} of ${analyticsSummary.journeysSent}`} />
            <Metric label="First-pass understanding" value={`${analyticsSummary.firstPassRate}%`} note={`${analyticsSummary.checksCompleted} checks`} />
            <Metric label="Chair time recovered" value={`${analyticsSummary.chairHoursRecovered}h`} note={`${analyticsSummary.slotsRefilled} slots refilled`} />
            <Metric label="Early cancellations" value={String(analyticsSummary.earlyCancellations)} note="Caught before arrival" />
          </div>

          <div className="desktopCards" style={{ marginTop: 18 }}>
            <section className="dashboardCard">
              <div className="cardHeader">
                <div><span className="eyebrow">Trend</span><h2>Completion improving</h2></div>
                <span className="status green">+8 pts</span>
              </div>
              <div className="section">
                <div style={{ display: 'grid', gap: 14 }}>
                  {monthlyTrend.map((item) => (
                    <div key={item.month} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 58px', gap: 12, alignItems: 'center' }}>
                      <strong style={{ fontSize: 12 }}>{item.month}</strong>
                      <div style={{ height: 12, background: '#edf2f0', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${item.completion}%`, height: '100%', background: '#245c5a', borderRadius: 999 }} />
                      </div>
                      <strong style={{ textAlign: 'right', fontSize: 12 }}>{item.completion}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader">
                <div><span className="eyebrow">Capacity</span><h2>Recovered clinical time</h2></div>
              </div>
              <div className="section">
                <strong style={{ display: 'block', fontSize: 42, color: '#173f3d', letterSpacing: '-0.04em' }}>{analyticsSummary.chairHoursRecovered}h</strong>
                <p>Clinical capacity recovered this month from early cancellations and refilled appointments.</p>
              </div>
              <div className="auditList">
                <div className="auditRow"><span>Early cancellations</span><strong>{analyticsSummary.earlyCancellations}</strong></div>
                <div className="auditRow"><span>Slots refilled</span><strong>{analyticsSummary.slotsRefilled}</strong></div>
                <div className="auditRow"><span>Refill rate</span><strong>{Math.round((analyticsSummary.slotsRefilled / analyticsSummary.earlyCancellations) * 100)}%</strong></div>
              </div>
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader">
              <div><span className="eyebrow">Branch comparison</span><h2>Where performance differs</h2></div>
              <span className="status neutral">4 locations</span>
            </div>
            <div className="practiceTable">
              <div className="practiceRow practiceHead" style={{ gridTemplateColumns: '1.4fr 90px 110px 100px 120px 120px 120px' }}>
                <span>Branch</span><span>Journeys</span><span>Completion</span><span>Review</span><span>Pathway change</span><span>Cancellations</span><span>Recovered</span>
              </div>
              {branchMetrics.map((item) => (
                <div className="practiceRow" key={item.branch} style={{ gridTemplateColumns: '1.4fr 90px 110px 100px 120px 120px 120px' }}>
                  <strong>{item.branch}</strong>
                  <span>{item.journeys}</span>
                  <span>{item.completion}%</span>
                  <span>{item.review}%</span>
                  <span>{item.pathwayChange}%</span>
                  <span>{item.cancellations}</span>
                  <strong>{item.recovered}h</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="desktopCards" style={{ marginTop: 18 }}>
            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Clinician comparison</span><h2>Pre-care readiness</h2></div></div>
              <div className="auditList">
                {clinicianMetrics.map((item) => (
                  <div className="auditRow" key={item.clinician} style={{ gridTemplateColumns: '1.2fr .8fr' }}>
                    <span><strong style={{ display: 'block', color: '#29413d' }}>{item.clinician}</strong>{item.journeys} journeys · {item.questions} patient questions</span>
                    <strong>{item.ready}% ready · {item.review}% review</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader"><div><span className="eyebrow">Accessibility</span><h2>Support demand</h2></div><span className="status neutral">{analyticsSummary.accessibilityJourneys} journeys</span></div>
              <div className="section" style={{ display: 'grid', gap: 16 }}>
                {supportNeeds.map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7, fontSize: 12 }}><span>{item.label}</span><strong>{item.count}</strong></div>
                    <div style={{ height: 9, background: '#edf2f0', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${(item.count / maxSupport) * 100}%`, height: '100%', background: '#245c5a', borderRadius: 999 }} /></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="dashboardCard" style={{ marginTop: 18 }}>
            <div className="cardHeader"><div><span className="eyebrow">Executive signals</span><h2>What Sitora is surfacing</h2></div></div>
            <div className="auditList">
              <div className="auditRow"><span>Patient questions raised before arrival</span><strong>{analyticsSummary.patientQuestions}</strong></div>
              <div className="auditRow"><span>Cases routed for follow-up review</span><strong>{analyticsSummary.followUpReviews}</strong></div>
              <div className="auditRow"><span>Treatment pathway changes detected</span><strong>{analyticsSummary.pathwayChanges}</strong></div>
              <div className="auditRow"><span>Appointments with accessibility or support preferences</span><strong>{analyticsSummary.accessibilityJourneys}</strong></div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small style={{ color: '#788985', fontSize: 11 }}>{note}</small></div>;
}
