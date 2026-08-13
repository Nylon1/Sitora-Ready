'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  demoPatients,
  demoPracticeMetrics,
  getMissingModules,
} from '../lib/demo-data';

type NewJourney = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
  clinician: string;
  language: string;
  reminder: string;
};

const initialJourney: NewJourney = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  treatment: 'Dental implant',
  date: '',
  time: '',
  clinician: 'Dr Ahmed',
  language: 'English',
  reminder: '24 hours before',
};

export default function AdminWorkspace() {
  const [selectedId, setSelectedId] = useState('sarah-khan');
  const [notice, setNotice] = useState('');
  const [newJourney, setNewJourney] = useState(initialJourney);
  const [generatedLink, setGeneratedLink] = useState('');

  const selected = useMemo(
    () => demoPatients.find((p) => p.id === selectedId) ?? demoPatients[0],
    [selectedId],
  );

  const missing = getMissingModules(selected);
  const existingLink = `/patient/${selected.id}`;

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const updateJourney = (field: keyof NewJourney, value: string) => {
    setNewJourney((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const createJourney = () => {
    if (!newJourney.firstName || !newJourney.lastName) {
      notify('Add patient name first');
      return;
    }

    const slug = `${newJourney.firstName}-${newJourney.lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setGeneratedLink(`/patient/${slug}-${Date.now().toString().slice(-5)}`);

    notify('Patient journey created');
  };

  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Admin Control Centre</div>
        </div>

        <div className="headerMeta">
          Pre-care operations · Prototype
        </div>
      </header>

      <section className="desktopGrid">
        <aside className="desktopSidebar">
          <span className="eyebrow">Control centre</span>

          {[
            'Overview',
            'New journey',
            'Journeys',
            'Patients',
            'Clinician',
            'Reception',
            'Treatments',
            'Content',
            'Accessibility',
            'Audit',
            'Analytics',
            'Integrations',
            'Settings',
          ].map((item) => (
            <div
              key={item}
              className={
                item === 'Overview'
                  ? 'patientNav active'
                  : 'patientNav'
              }
            >
              <strong>{item}</strong>
            </div>
          ))}
        </aside>

        <section className="desktopContent">
          <div className="heroPanel">
            <div>
              <span className="eyebrow">Admin overview</span>

              <h1>Run pre-care from one place.</h1>

              <p>
                Create journeys, send confirmations, schedule
                reminders, generate secure patient links and surface
                anything requiring action before arrival.
              </p>
            </div>

            <span className="status green">System ready</span>
          </div>

          <div className="metricGrid">
            <div className="metric">
              <span>Appointments tracked</span>
              <strong>
                {demoPracticeMetrics.appointmentsTracked}
              </strong>
            </div>

            <div className="metric">
              <span>Journeys complete</span>
              <strong>
                {demoPracticeMetrics.journeysComplete}
              </strong>
            </div>

            <div className="metric">
              <span>Needs action</span>
              <strong>
                {demoPracticeMetrics.needsAction}
              </strong>
            </div>

            <div className="metric">
              <span>Chair time released</span>
              <strong>
                {demoPracticeMetrics.chairTimeReleasedHours}h
              </strong>
            </div>
          </div>

          <section
            className="dashboardCard"
            style={{ marginBottom: 18 }}
          >
            <div className="cardHeader">
              <div>
                <span className="eyebrow">
                  Create patient journey
                </span>
                <h2>New appointment</h2>
              </div>

              <span className="status neutral">
                Admin workflow
              </span>
            </div>

            <div
              className="section"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: 14,
              }}
            >
              <AdminField label="First name">
                <input
                  className="adminInput"
                  value={newJourney.firstName}
                  onChange={(e) =>
                    updateJourney(
                      'firstName',
                      e.target.value,
                    )
                  }
                />
              </AdminField>

              <AdminField label="Last name">
                <input
                  className="adminInput"
                  value={newJourney.lastName}
                  onChange={(e) =>
                    updateJourney(
                      'lastName',
                      e.target.value,
                    )
                  }
                />
              </AdminField>

              <AdminField label="Mobile">
                <input
                  className="adminInput"
                  value={newJourney.mobile}
                  onChange={(e) =>
                    updateJourney('mobile', e.target.value)
                  }
                  placeholder="07..."
                />
              </AdminField>

              <AdminField label="Email">
                <input
                  className="adminInput"
                  value={newJourney.email}
                  onChange={(e) =>
                    updateJourney('email', e.target.value)
                  }
                  placeholder="patient@example.com"
                />
              </AdminField>

              <AdminField label="Treatment">
                <select
                  className="adminInput"
                  value={newJourney.treatment}
                  onChange={(e) =>
                    updateJourney(
                      'treatment',
                      e.target.value,
                    )
                  }
                >
                  <option>Dental implant</option>
                  <option>Implant + bone graft</option>
                  <option>Surgical extraction</option>
                  <option>Root canal</option>
                  <option>Crown</option>
                  <option>Orthodontic aligners</option>
                </select>
              </AdminField>

              <AdminField label="Clinician">
                <select
                  className="adminInput"
                  value={newJourney.clinician}
                  onChange={(e) =>
                    updateJourney(
                      'clinician',
                      e.target.value,
                    )
                  }
                >
                  <option>Dr Ahmed</option>
                  <option>Dr Patel</option>
                  <option>Dr Khan</option>
                </select>
              </AdminField>

              <AdminField label="Appointment date">
                <input
                  type="date"
                  className="adminInput"
                  value={newJourney.date}
                  onChange={(e) =>
                    updateJourney('date', e.target.value)
                  }
                />
              </AdminField>

              <AdminField label="Appointment time">
                <input
                  type="time"
                  className="adminInput"
                  value={newJourney.time}
                  onChange={(e) =>
                    updateJourney('time', e.target.value)
                  }
                />
              </AdminField>

              <AdminField label="Language">
                <select
                  className="adminInput"
                  value={newJourney.language}
                  onChange={(e) =>
                    updateJourney(
                      'language',
                      e.target.value,
                    )
                  }
                >
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Polish</option>
                  <option>Arabic</option>
                  <option>Punjabi</option>
                </select>
              </AdminField>

              <AdminField label="Reminder rule">
                <select
                  className="adminInput"
                  value={newJourney.reminder}
                  onChange={(e) =>
                    updateJourney(
                      'reminder',
                      e.target.value,
                    )
                  }
                >
                  <option>24 hours before</option>
                  <option>48 hours before</option>
                  <option>72 hours before</option>
                  <option>7 days before</option>
                  <option>No automatic reminder</option>
                </select>
              </AdminField>
            </div>

            <div className="section">
              <button
                className="primary desktopButton"
                onClick={createJourney}
              >
                Create & generate journey
              </button>
            </div>

            {generatedLink && (
              <div className="section">
                <span className="sectionTitle">
                  Generated patient link
                </span>

                <p>{generatedLink}</p>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    marginTop: 14,
                  }}
                >
                  <button
                    className="primary desktopButton"
                    onClick={() =>
                      notify(
                        'Appointment confirmation sent',
                      )
                    }
                  >
                    Send confirmation
                  </button>

                  <button
                    className="secondary desktopButton"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${window.location.origin}${generatedLink}`,
                      );
                      notify('Journey link copied');
                    }}
                  >
                    Copy link
                  </button>

                  <button
                    className="secondary desktopButton"
                    onClick={() =>
                      notify('Journey link sent')
                    }
                  >
                    Send journey
                  </button>

                  <button
                    className="secondary desktopButton"
                    onClick={() =>
                      notify(
                        `Reminder scheduled: ${newJourney.reminder}`,
                      )
                    }
                  >
                    Schedule reminder
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="desktopCards">
            <section className="dashboardCard">
              <div className="cardHeader">
                <div>
                  <span className="eyebrow">
                    Existing appointment
                  </span>
                  <h2>Patient management</h2>
                </div>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Patient
                </span>

                <select
                  className="adminInput"
                  value={selectedId}
                  onChange={(e) =>
                    setSelectedId(e.target.value)
                  }
                >
                  {demoPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.time} · {p.name} · {p.treatment}
                    </option>
                  ))}
                </select>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Appointment
                </span>

                <p>
                  <strong>{selected.name}</strong>
                  <br />
                  Tomorrow · {selected.time}
                  <br />
                  {selected.treatment}
                </p>
              </div>

              <div className="section">
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    className="primary desktopButton"
                    onClick={() =>
                      notify(
                        `Confirmation sent to ${selected.name}`,
                      )
                    }
                  >
                    Send confirmation
                  </button>

                  <button
                    className="secondary desktopButton"
                    onClick={() =>
                      notify(
                        `Reminder sent to ${selected.name}`,
                      )
                    }
                  >
                    Send reminder
                  </button>
                </div>
              </div>
            </section>

            <section className="dashboardCard">
              <div className="cardHeader">
                <div>
                  <span className="eyebrow">
                    Patient journey
                  </span>
                  <h2>Journey control</h2>
                </div>

                <span className="status neutral">
                  {selected.journey}
                </span>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Journey link
                </span>

                <p>{existingLink}</p>
              </div>

              <div className="section">
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href={existingLink}
                    className="primary desktopButton"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Open journey
                  </Link>

                  <button
                    className="secondary desktopButton"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `${window.location.origin}${existingLink}`,
                      );
                      notify('Journey link copied');
                    }}
                  >
                    Copy link
                  </button>
                </div>
              </div>

              <div className="section">
                <span className="sectionTitle">
                  Treatment coverage
                </span>

                <p>
                  {missing.length
                    ? `Missing module: ${missing.join(', ')}`
                    : 'Treatment pathway fully covered.'}
                </p>
              </div>
            </section>
          </div>

          <section className="dashboardCard">
            <div className="cardHeader">
              <div>
                <span className="eyebrow">
                  Requires attention
                </span>
                <h2>Tomorrow&apos;s exceptions</h2>
              </div>

              <span className="status amber">
                Action queue
              </span>
            </div>

            <div className="practiceTable">
              <div className="practiceRow practiceHead">
                <span>Time</span>
                <span>Patient</span>
                <span>Treatment</span>
                <span>Journey</span>
                <span>Attendance</span>
                <span>Support</span>
                <span>Action</span>
              </div>

              {demoPatients.map((p) => (
                <div className="practiceRow" key={p.id}>
                  <strong>{p.time}</strong>
                  <span>{p.name}</span>
                  <span>{p.treatment}</span>
                  <span>{p.journey}</span>
                  <span>{p.attendance}</span>
                  <span>
                    {[
                      p.language !== 'English'
                        ? p.language
                        : '',
                      ...p.accessibility,
                      ...p.support,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'None'}
                  </span>
                  <strong className="actionText">
                    {p.receptionAction}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 18,
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/clinician"
              className="secondary desktopButton"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Open clinician
            </Link>

            <Link
              href="/practice"
              className="secondary desktopButton"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Open reception
            </Link>
          </div>

          {notice && (
            <div
              style={{
                position: 'fixed',
                right: 24,
                bottom: 24,
                padding: '14px 18px',
                borderRadius: 14,
                background: '#173f3d',
                color: '#fff',
                boxShadow:
                  '0 16px 40px rgba(0,0,0,.18)',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {notice}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="sectionTitle">{label}</span>
      {children}
    </label>
  );
}