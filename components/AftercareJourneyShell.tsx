'use client';

import { useMemo, useState } from 'react';
import type { DemoPatient } from '../lib/demo-data';

type RecoveryState = 'As expected' | 'Unsure' | 'Concerned' | '';

type AftercareStep = {
  eyebrow: string;
  title: string;
  body?: string;
};

const implantSteps: AftercareStep[] = [
  { eyebrow: 'After your treatment', title: 'You’re home. Let’s make recovery easier.', body: 'We’ll keep the important information simple and check how you’re doing along the way.' },
  { eyebrow: 'Today', title: 'What to expect in the first hours.', body: 'Your practice will have given you instructions specific to your treatment. Keep those instructions as your main guide.' },
  { eyebrow: 'Recovery', title: 'Some changes can be part of normal healing.', body: 'Soreness, swelling or tenderness can happen after treatment. What matters is how you are progressing and whether anything feels unusual for you.' },
  { eyebrow: 'Looking after the area', title: 'Small actions can help recovery.', body: 'Follow the cleaning, eating and medication instructions given by your treating team. If you are unsure about anything, contact the practice rather than guessing.' },
  { eyebrow: 'Check-in', title: 'How are you feeling right now?' },
  { eyebrow: 'When to get help', title: 'If something doesn’t feel right, tell us early.', body: 'Sitora does not diagnose problems. It helps you recognise when you should contact your treating team or seek urgent help using the instructions they provided.' },
  { eyebrow: 'Next few days', title: 'Recovery should feel like a journey, not a leaflet.', body: 'We can check in again as your recovery progresses and keep your treatment-specific guidance in one place.' },
  { eyebrow: 'Long-term care', title: 'Protect the result.', body: 'Your implant will need ongoing cleaning, reviews and maintenance. Your dental team will tell you what schedule is appropriate for you.' },
];

const genericSteps: AftercareStep[] = [
  { eyebrow: 'After your treatment', title: 'You’re home. Let’s make recovery easier.', body: 'Your aftercare is based on the treatment you received and the instructions from your treating team.' },
  { eyebrow: 'Today', title: 'Keep your instructions close.', body: 'Follow the advice your practice gave you for eating, cleaning, medication and activity.' },
  { eyebrow: 'Check-in', title: 'How are you feeling right now?' },
  { eyebrow: 'When to get help', title: 'If something doesn’t feel right, tell us early.', body: 'Sitora does not diagnose problems. Contact your treating team if you are concerned or follow the urgent-care instructions they gave you.' },
  { eyebrow: 'Next steps', title: 'We’ll keep the recovery journey simple.', body: 'Your future check-ins and maintenance guidance can be tailored to the treatment you received.' },
];

export default function AftercareJourneyShell({ patient }: { patient: DemoPatient }) {
  const [step, setStep] = useState(0);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('');
  const [note, setNote] = useState('');
  const [contactRequested, setContactRequested] = useState(false);
  const [auditEvents, setAuditEvents] = useState<string[]>(['AFTERCARE_OPENED']);

  const isImplant = patient.treatment.toLowerCase().includes('implant');
  const steps = useMemo(() => (isImplant ? implantSteps : genericSteps), [isImplant]);
  const firstName = patient.name.split(' ')[0];
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const addAudit = (event: string) => {
    setAuditEvents((events) => (events.includes(event) ? events : [...events, event]));
  };

  const chooseRecovery = (value: RecoveryState) => {
    setRecoveryState(value);
    addAudit(`RECOVERY_CHECK_${value.toUpperCase().replaceAll(' ', '_')}`);
    if (value === 'Concerned') addAudit('PATIENT_CONCERN_FLAGGED');
  };

  const next = () => {
    if (step === 4 && !recoveryState) return;
    const nextStep = Math.min(steps.length - 1, step + 1);
    setStep(nextStep);
    addAudit(`AFTERCARE_STEP_${nextStep + 1}_VIEWED`);
  };

  return (
    <main className="patientApp">
      <div className="patientMobile">
        <div className="phoneTop">
          <span>Sitora After™</span>
          <span>{step + 1}/{steps.length}</span>
        </div>
        <div className="progressTrack"><div style={{ width: `${progress}%` }} /></div>

        <div className="phoneBody">
          <div className="screen">
            <span className="eyebrow">{current.eyebrow}</span>
            <h1>{step === 0 ? `Hi ${firstName}. ${current.title}` : current.title}</h1>
            {current.body && <p>{current.body}</p>}

            {step === 0 && (
              <>
                <div className="infoCard"><strong>{patient.treatment}</strong><span>Your recovery guidance is linked to the treatment recorded by your dental team.</span></div>
                <div className="infoCard" style={{ marginTop: 12 }}><strong>No searching through paperwork</strong><span>Your aftercare, check-ins and next steps stay together in one calm journey.</span></div>
              </>
            )}

            {isImplant && step === 1 && (
              <div className="summaryList">
                <div className="summaryRow"><span>Food & drink</span><strong>Follow practice advice</strong></div>
                <div className="summaryRow"><span>Cleaning</span><strong>Follow practice advice</strong></div>
                <div className="summaryRow"><span>Medication</span><strong>As instructed</strong></div>
                <div className="summaryRow"><span>Questions</span><strong>Contact the team</strong></div>
              </div>
            )}

            {isImplant && step === 2 && (
              <>
                <div className="infoCard"><strong>Healing is individual</strong><span>Use your clinician’s instructions and how you are progressing as the guide. If symptoms are worsening or worrying you, contact the practice.</span></div>
                <div className="infoCard" style={{ marginTop: 12 }}><strong>You don’t need to decide what is “normal” alone</strong><span>If you are unsure, use the check-in and the practice can review what you report.</span></div>
              </>
            )}

            {isImplant && step === 3 && (
              <div className="summaryList">
                <div className="summaryRow"><span>1</span><strong>Keep to your written instructions</strong></div>
                <div className="summaryRow"><span>2</span><strong>Avoid guessing about changes</strong></div>
                <div className="summaryRow"><span>3</span><strong>Raise concerns early</strong></div>
              </div>
            )}

            {step === (isImplant ? 4 : 2) && (
              <>
                <p>Choose the option that best describes you. This is not a diagnosis.</p>
                <div className="choiceGrid">
                  {(['As expected', 'Unsure', 'Concerned'] as RecoveryState[]).map((value) => (
                    <button key={value} className={recoveryState === value ? 'choice selected' : 'choice'} onClick={() => chooseRecovery(value)}>{value}</button>
                  ))}
                </div>

                {recoveryState === 'As expected' && <div className="infoCard" style={{ marginTop: 16 }}><strong>Good to hear</strong><span>Keep following the instructions from your treating team. Sitora can check in again as recovery progresses.</span></div>}
                {recoveryState === 'Unsure' && <div className="infoCard" style={{ marginTop: 16, background: '#fff8ed' }}><strong>It’s okay to be unsure</strong><span>You can add what is worrying you and ask the practice to review it.</span></div>}
                {recoveryState === 'Concerned' && <div className="infoCard" style={{ marginTop: 16, background: '#fff4f1' }}><strong>Let the practice know</strong><span>Sitora will flag that you are concerned. If you have been given urgent-care instructions, follow them now where appropriate.</span></div>}

                {(recoveryState === 'Unsure' || recoveryState === 'Concerned') && (
                  <>
                    <textarea className="questionBox" style={{ marginTop: 14 }} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tell the practice what you are experiencing..." />
                    <button className="primary" style={{ width: '100%', marginTop: 12 }} type="button" onClick={() => { setContactRequested(true); addAudit('PRACTICE_REVIEW_REQUESTED'); }}>{contactRequested ? 'Practice review requested ✓' : 'Ask the practice to review this'}</button>
                  </>
                )}
              </>
            )}

            {step === (isImplant ? 5 : 3) && (
              <>
                <div className="infoCard"><strong>Your practice remains the clinical contact</strong><span>Sitora keeps the route back to your care team clear instead of trying to diagnose or replace them.</span></div>
                <div className="infoCard" style={{ marginTop: 12 }}><strong>Urgent problem?</strong><span>Use the urgent or emergency instructions provided by your healthcare team or local services rather than waiting for a digital reply.</span></div>
              </>
            )}

            {isImplant && step === 6 && (
              <div className="summaryList">
                <div className="summaryRow"><span>Today</span><strong>Immediate aftercare</strong></div>
                <div className="summaryRow"><span>Next check-in</span><strong>Recovery review</strong></div>
                <div className="summaryRow"><span>Later</span><strong>Clinical review</strong></div>
              </div>
            )}

            {step === steps.length - 1 && (
              <>
                <div className="infoCard"><strong>Your treatment journey continues</strong><span>Aftercare instructions, check-ins and maintenance can stay linked to the same treatment record.</span></div>
                <div className="infoCard" style={{ marginTop: 12, background: '#eef7f2' }}><strong>Evidence retained</strong><span>For the prototype, Sitora is recording aftercare opened, guidance viewed, recovery response and any request for practice review as audit events.</span></div>
                <div style={{ display: 'none' }} aria-hidden="true">{auditEvents.join('|')} {note}</div>
              </>
            )}
          </div>
        </div>

        <div className="phoneActions">
          <button className="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
          {step < steps.length - 1 ? (
            <button className="primary" disabled={step === (isImplant ? 4 : 2) && !recoveryState} onClick={next}>Continue</button>
          ) : (
            <button className="primary" onClick={() => addAudit('AFTERCARE_JOURNEY_COMPLETED')}>Finish</button>
          )}
        </div>
      </div>
    </main>
  );
}
