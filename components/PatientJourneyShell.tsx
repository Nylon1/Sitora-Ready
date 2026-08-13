'use client';

import { useState } from 'react';
import type { DemoPatient } from '../lib/demo-data';

export default function PatientJourneyShell({
  patient,
}: {
  patient: DemoPatient;
}) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(patient.language || 'English');
  const [attendance, setAttendance] = useState(patient.attendance);

  const steps = ['Welcome', 'Language', 'Treatment', 'Readiness', 'Summary'];

  return (
    <main className="patientApp">
      <div className="patientMobile">
        <div className="phoneTop">
          <span>Sitora Ready™</span>
          <span>{step + 1}/{steps.length}</span>
        </div>

        <div className="progressTrack">
          <div
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div className="phoneBody">
          <div className="screen">

            {step === 0 && (
              <>
                <span className="eyebrow">Welcome</span>

                <h1>
                  Hi {patient.name.split(' ')[0]}.
                </h1>

                <p>Your pre-care journey is ready.</p>

                <div className="infoCard">
                  <strong>{patient.treatment}</strong>
                  <span>Tomorrow · {patient.time}</span>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <span className="eyebrow">Language</span>

                <h1>Choose your language.</h1>

                <div className="choiceGrid">
                  {['English', 'اردو', 'Polski', 'العربية'].map((value) => (
                    <button
                      key={value}
                      className={
                        language === value
                          ? 'choice selected'
                          : 'choice'
                      }
                      onClick={() => setLanguage(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <span className="eyebrow">Treatment</span>

                <h1>{patient.treatment}</h1>

                <div className="summaryList">
                  {patient.treatmentModules.map((module) => (
                    <div className="summaryRow" key={module}>
                      <span>{module}</span>
                      <strong>Review</strong>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <span className="eyebrow">Readiness</span>

                <h1>Are you planning to attend?</h1>

                <div className="choiceGrid">
                  {['Confirmed', 'Rearrange', 'Cancel'].map((value) => (
                    <button
                      key={value}
                      className={
                        attendance === value
                          ? 'choice selected'
                          : 'choice'
                      }
                      onClick={() =>
                        setAttendance(
                          value as DemoPatient['attendance']
                        )
                      }
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <span className="eyebrow">Complete</span>

                <h1>
                  Thank you, {patient.name.split(' ')[0]}.
                </h1>

                <div className="summaryList">
                  <div className="summaryRow">
                    <span>Treatment</span>
                    <strong>{patient.treatment}</strong>
                  </div>

                  <div className="summaryRow">
                    <span>Language</span>
                    <strong>{language}</strong>
                  </div>

                  <div className="summaryRow">
                    <span>Attendance</span>
                    <strong>{attendance}</strong>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        <div className="phoneActions">
          <button
            className="secondary"
            disabled={step === 0}
            onClick={() =>
              setStep((value) => Math.max(0, value - 1))
            }
          >
            Back
          </button>

          {step < steps.length - 1 && (
            <button
              className="primary"
              onClick={() =>
                setStep((value) =>
                  Math.min(steps.length - 1, value + 1)
                )
              }
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </main>
  );
}