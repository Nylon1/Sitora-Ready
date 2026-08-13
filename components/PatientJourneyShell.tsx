'use client';

import { useMemo, useState } from 'react';
import type { DemoPatient } from '../lib/demo-data';

const languages = ['English', 'اردو', 'Polski', 'العربية'];
const supportOptions = ['Large text', 'Read aloud', 'Quiet waiting area', 'Explain before touching', 'Interpreter', 'Support person'];
const priorities = ['Appearance', 'Comfort', 'Long-term success', 'Recovery', 'Treatment time', 'I have another concern'];

export default function PatientJourneyShell({ patient }: { patient: DemoPatient }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(patient.language || 'English');
  const [support, setSupport] = useState<string[]>([...patient.accessibility, ...patient.support]);
  const [understanding, setUnderstanding] = useState<'Not answered' | 'Correct' | 'Corrected'>('Not answered');
  const [showCorrection, setShowCorrection] = useState(false);
  const [priority, setPriority] = useState(patient.priority || '');
  const [question, setQuestion] = useState(patient.question || '');
  const [healthChanged, setHealthChanged] = useState<'No' | 'Yes' | ''>('');
  const [readiness, setReadiness] = useState('Ready to continue');
  const [attendance, setAttendance] = useState(patient.attendance === 'Pending' ? 'Confirmed' : patient.attendance);
  const [precareConfirmed, setPrecareConfirmed] = useState(false);
  const [secondaryConfirmed, setSecondaryConfirmed] = useState(false);

  const steps = [
    'Welcome',
    'Preferences',
    'Your treatment',
    'What to expect',
    'Things worth knowing',
    'Understanding',
    'What matters to you',
    'Your questions',
    'Before your visit',
    'Pre-care confirmation',
    'Clinician discussion',
    'Secondary confirmation',
  ];

  const firstName = patient.name.split(' ')[0];
  const progress = ((step + 1) / steps.length) * 100;

  const toggleSupport = (value: string) => {
    setSupport((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  };

  const missingModules = useMemo(
    () => patient.treatmentModules.filter((module) => !patient.completedModules.includes(module)),
    [patient],
  );

  const answerCheck = (answer: 'Guaranteed' | 'Not guaranteed' | 'Not sure') => {
    if (answer === 'Not guaranteed') {
      setUnderstanding('Correct');
      setShowCorrection(false);
      return;
    }
    setUnderstanding('Corrected');
    setShowCorrection(true);
  };

  const canContinue = () => {
    if (step === 5) return understanding !== 'Not answered';
    if (step === 9) return precareConfirmed;
    if (step === 11) return secondaryConfirmed;
    return true;
  };

  return (
    <main className="patientApp">
      <div className="patientMobile" style={{ boxShadow: '0 28px 80px rgba(23,63,61,.14)' }}>
        <div className="phoneTop">
          <span>Sitora Ready™</span>
          <span>{step + 1}/{steps.length}</span>
        </div>

        <div className="progressTrack"><div style={{ width: `${progress}%` }} /></div>

        <div className="phoneBody">
          <div className="screen">
            {step === 0 && <>
              <span className="eyebrow">Welcome, {firstName}</span>
              <h1>Let’s help you feel prepared.</h1>
              <p>We’ll take you through the important information about your treatment one step at a time. You can pause, go back or raise a question at any point.</p>
              <div className="infoCard">
                <strong>{patient.treatment}</strong>
                <span>Tomorrow · {patient.time}</span>
              </div>
              <div className="infoCard" style={{ marginTop: 12, background: '#f8faf9' }}>
                <strong>You’re in control</strong>
                <span>This usually takes only a few minutes. Nothing here replaces your conversation with your clinician.</span>
              </div>
            </>}

            {step === 1 && <>
              <span className="eyebrow">Make this comfortable for you</span>
              <h1>How would you like to go through this?</h1>
              <p>Choose a language and any support that would make your visit easier.</p>
              <div className="choiceGrid">
                {languages.map((value) => <button key={value} className={language === value ? 'choice selected' : 'choice'} onClick={() => setLanguage(value)}>{value}</button>)}
              </div>
              <div className="choiceGrid" style={{ marginTop: 16 }}>
                {supportOptions.map((value) => <button key={value} className={support.includes(value) ? 'choice selected' : 'choice'} onClick={() => toggleSupport(value)}>{value}</button>)}
              </div>
            </>}

            {step === 2 && <>
              <span className="eyebrow">Your treatment</span>
              <h1>{patient.treatment}</h1>
              <p>This is the treatment your dental team has asked Sitora to help you prepare for.</p>
              <div className="summaryList">
                {patient.treatmentModules.map((module) => <div className="summaryRow" key={module}><span>{module}</span><strong>{missingModules.includes(module) ? 'To review' : 'Included'}</strong></div>)}
              </div>
              <div className="infoCard" style={{ marginTop: 14 }}><strong>If your treatment plan changes</strong><span>We’ll make sure any new treatment information is covered before you proceed.</span></div>
            </>}

            {step === 3 && <>
              <span className="eyebrow">What to expect</span>
              <h1>We’ll keep this simple.</h1>
              <div className="summaryList">
                <div className="summaryRow"><span>1. Before treatment</span><strong>Assessment & planning</strong></div>
                <div className="summaryRow"><span>2. Treatment</span><strong>{patient.treatment}</strong></div>
                <div className="summaryRow"><span>3. Afterwards</span><strong>Recovery & review</strong></div>
              </div>
              <p style={{ marginTop: 18 }}>Your clinician will explain anything specific to you before treatment starts. If something is unclear, you can ask us now.</p>
            </>}

            {step === 4 && <>
              <span className="eyebrow">Things worth knowing</span>
              <h1>Clear expectations matter.</h1>
              <div className="infoCard"><strong>Treatment outcomes</strong><span>Dental treatment is planned carefully, but an exact result or long-term outcome cannot be guaranteed.</span></div>
              <div className="infoCard" style={{ marginTop: 12 }}><strong>Recovery</strong><span>Some discomfort or temporary symptoms can be normal. Your dental team will explain what to expect and when to contact them.</span></div>
              <div className="infoCard" style={{ marginTop: 12 }}><strong>Your choices</strong><span>You can ask about reasonable alternatives, ask for more time, or change your mind before treatment.</span></div>
            </>}

            {step === 5 && <>
              <span className="eyebrow">A quick understanding check</span>
              <h1>Is the outcome of treatment guaranteed?</h1>
              <p>This isn’t a test. It simply helps us spot anything your dental team may need to explain more clearly.</p>
              <div className="choiceGrid">
                {(['Guaranteed', 'Not guaranteed', 'Not sure'] as const).map((value) => <button key={value} className={(value === 'Not guaranteed' && understanding === 'Correct') || (showCorrection && value !== 'Not guaranteed') ? 'choice selected' : 'choice'} onClick={() => answerCheck(value)}>{value}</button>)}
              </div>
              {understanding === 'Correct' && <div className="infoCard" style={{ marginTop: 16 }}><strong>That’s right</strong><span>Outcomes cannot be guaranteed. Your clinician will explain the important benefits, limitations and risks that apply to you.</span></div>}
              {showCorrection && <div className="infoCard" style={{ marginTop: 16, background: '#fff8ed' }}><strong>Worth clarifying</strong><span>Treatment is planned to give the best possible outcome, but success cannot be guaranteed. We’ve saved this so your clinician can make sure you’re comfortable with it.</span></div>}
            </>}

            {step === 6 && <>
              <span className="eyebrow">What matters to you</span>
              <h1>What is most important to you?</h1>
              <p>This helps your clinician focus the conversation on what matters to you personally.</p>
              <div className="choiceGrid">{priorities.map((value) => <button key={value} className={priority === value ? 'choice selected' : 'choice'} onClick={() => setPriority(value)}>{value}</button>)}</div>
            </>}

            {step === 7 && <>
              <span className="eyebrow">Your questions</span>
              <h1>Anything you’d like to ask?</h1>
              <p>You don’t need to remember it for the appointment. Add it here and your clinician can see it before you arrive.</p>
              <textarea className="questionBox" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type a question, concern or anything you want your clinician to explain..." style={{ minHeight: 150 }} />
              <p className="muted">It’s completely fine to leave this blank.</p>
            </>}

            {step === 8 && <>
              <span className="eyebrow">Before your visit</span>
              <h1>Has anything changed?</h1>
              <p>Has there been any change to your health or medication since the practice last saw you?</p>
              <div className="choiceGrid">
                {['No', 'Yes'].map((value) => <button key={value} className={healthChanged === value ? 'choice selected' : 'choice'} onClick={() => setHealthChanged(value as 'No' | 'Yes')}>{value}</button>)}
              </div>
              {healthChanged === 'Yes' && <div className="infoCard" style={{ marginTop: 14 }}><strong>Thank you for telling us</strong><span>Your dental team will review this with you before treatment.</span></div>}
              <h2 style={{ marginTop: 28 }}>How are you feeling about proceeding?</h2>
              <div className="choiceGrid">
                {['Ready to continue', 'I have a question', 'I’m unsure', 'Discuss alternatives'].map((value) => <button key={value} className={readiness === value ? 'choice selected' : 'choice'} onClick={() => setReadiness(value)}>{value}</button>)}
              </div>
              <h2 style={{ marginTop: 28 }}>Are you still planning to attend?</h2>
              <div className="choiceGrid">
                {['Confirmed', 'Rearrange', 'Cancel'].map((value) => <button key={value} className={attendance === value ? 'choice selected' : 'choice'} onClick={() => setAttendance(value as DemoPatient['attendance'])}>{value}</button>)}
              </div>
            </>}

            {step === 9 && <>
              <span className="eyebrow">Pre-care confirmation</span>
              <h1>You’ve completed your review.</h1>
              <p>You’ve looked through the key information and had the opportunity to raise anything that matters to you.</p>
              <div className="summaryList">
                <div className="summaryRow"><span>Treatment</span><strong>{patient.treatment}</strong></div>
                <div className="summaryRow"><span>Understanding</span><strong>{understanding === 'Corrected' ? 'Clarification flagged' : 'Reviewed'}</strong></div>
                <div className="summaryRow"><span>Your priority</span><strong>{priority || 'Not specified'}</strong></div>
                <div className="summaryRow"><span>Question</span><strong>{question ? 'Shared with clinician' : 'None added'}</strong></div>
              </div>
              <label className="infoCard" style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={precareConfirmed} onChange={(e) => setPrecareConfirmed(e.target.checked)} style={{ marginTop: 4, width: 20, height: 20 }} />
                <span><strong style={{ display: 'block', marginBottom: 5 }}>I understand the information provided and I’m happy to continue to my discussion with the clinician.</strong><span>This is your pre-care confirmation. It does not replace the clinician-led consent process.</span></span>
              </label>
            </>}

            {step === 10 && <>
              <span className="eyebrow">Your clinician discussion</span>
              <h1>One final conversation.</h1>
              <p>Your clinician will use your Sitora summary to focus on your questions, anything you were unsure about, and what matters most to you.</p>
              <div className="infoCard"><strong>They can already see</strong><span>{priority ? `Your priority: ${priority}. ` : ''}{question ? `Your question: “${question}” ` : ''}{understanding === 'Corrected' ? 'A point that needed clarification.' : 'Your understanding review.'}</span></div>
              <div className="infoCard" style={{ marginTop: 12, background: '#f8faf9' }}><strong>No need to rush</strong><span>You can ask another question, ask for something to be explained again, or decide not to proceed.</span></div>
            </>}

            {step === 11 && <>
              <span className="eyebrow">Secondary patient confirmation</span>
              <h1>Ready to continue?</h1>
              <p>This confirmation comes after the clinician discussion. The formal clinical consent record remains part of your treating clinician’s process.</p>
              <label className="infoCard" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={secondaryConfirmed} onChange={(e) => setSecondaryConfirmed(e.target.checked)} style={{ marginTop: 4, width: 20, height: 20 }} />
                <span><strong style={{ display: 'block', marginBottom: 6 }}>I confirm that I have had the opportunity to discuss my treatment and ask questions. My questions have been addressed and I am happy to proceed with the proposed treatment.</strong><span>Your confirmation is recorded with the treatment, information version and time completed.</span></span>
              </label>
              {secondaryConfirmed && <div className="infoCard" style={{ marginTop: 16, background: '#eef7f2' }}><strong>Thank you, {firstName}</strong><span>Your secondary confirmation is ready to be recorded alongside the clinician-led consent process.</span></div>}
            </>}
          </div>
        </div>

        <div className="phoneActions">
          <button className="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
          {step < steps.length - 1 ? (
            <button className="primary" disabled={!canContinue()} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Continue</button>
          ) : (
            <button className="primary" disabled={!secondaryConfirmed}>Complete</button>
          )}
        </div>
      </div>
    </main>
  );
}
