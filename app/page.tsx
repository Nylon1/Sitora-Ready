'use client';

import { useMemo, useState } from 'react';

type AuditEvent = { label: string; detail: string };

const steps = [
  'Welcome',
  'Language',
  'Accessibility',
  'Support',
  'Treatment',
  'Understanding',
  'Priorities',
  'Questions',
  'Readiness',
  'Summary',
];

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('English');
  const [largeText, setLargeText] = useState(false);
  const [support, setSupport] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [priority, setPriority] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [attendance, setAttendance] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  const addAudit = (label: string, detail: string) => {
    setAudit((prev) => [...prev, { label, detail }]);
  };

  const toggleSupport = (value: string) => {
    setSupport((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
    addAudit('Support preference updated', value);
  };

  const incorrect = answer === 'Guaranteed';
  const complete = step === steps.length - 1;

  const clinicianStatus = useMemo(() => {
    if (!answer) return 'Waiting for patient';
    if (incorrect && !acknowledged) return 'Review required';
    if (question.trim()) return 'Question to discuss';
    return 'Ready for clinician review';
  }, [answer, incorrect, acknowledged, question]);

  const next = () => {
    if (step === 5 && incorrect && !acknowledged) {
      setAcknowledged(true);
      addAudit('Patient acknowledged correction', 'Implant success is not guaranteed');
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const previous = () => setStep((current) => Math.max(0, current - 1));

  const patientScreen = () => {
    switch (step) {
      case 0:
        return (
          <Screen eyebrow="Your treatment tomorrow" title="Understand your care before you arrive.">
            <p>Your dental team has prepared a short guide about your upcoming implant treatment.</p>
            <div className="infoCard">
              <strong>Dental implant placement</strong>
              <span>Tomorrow · 9:30 AM</span>
              <span>Estimated time: 6 minutes</span>
            </div>
          </Screen>
        );
      case 1:
        return (
          <Screen eyebrow="Language" title="How would you like to receive this information?">
            <ChoiceGrid
              options={['English', 'اردو', 'Polski', 'العربية']}
              selected={language}
              onSelect={(value) => {
                setLanguage(value);
                addAudit('Language selected', value);
              }}
            />
          </Screen>
        );
      case 2:
        return (
          <Screen eyebrow="Accessibility" title="How can we make this easier for you?">
            <ChoiceGrid
              options={['Standard', 'Larger text', 'Read aloud', 'Easy Read']}
              selected={largeText ? 'Larger text' : 'Standard'}
              onSelect={(value) => {
                setLargeText(value === 'Larger text');
                addAudit('Accessibility updated', value);
              }}
            />
          </Screen>
        );
      case 3:
        return (
          <Screen eyebrow="Visit support" title="What would help make your visit easier?">
            <p>You do not need to tell us a diagnosis. Just choose what would help your care team prepare.</p>
            <MultiChoiceGrid
              options={[
                'Quiet waiting area',
                'Explain before touching',
                'Extra appointment time',
                'Support person attending',
                'I may need breaks',
              ]}
              selected={support}
              onSelect={toggleSupport}
            />
          </Screen>
        );
      case 4:
        return (
          <Screen eyebrow="Dental implant" title="Your treatment usually happens in stages.">
            <div className="timeline">
              <span>Assessment</span><b>→</b><span>Implant placement</span><b>→</b><span>Healing</span><b>→</b><span>Final tooth</span>
            </div>
            <p>The final tooth is not always fitted at the same appointment as the implant. Healing time may be required first.</p>
          </Screen>
        );
      case 5:
        return (
          <Screen eyebrow="Quick check" title="Is a dental implant guaranteed to succeed?">
            <ChoiceGrid
              options={['Guaranteed', 'Not guaranteed']}
              selected={answer ?? ''}
              onSelect={(value) => {
                setAnswer(value);
                setAcknowledged(value === 'Not guaranteed');
                addAudit('Comprehension answer', value);
                if (value === 'Guaranteed') addAudit('Correction displayed', 'Implant success is not guaranteed');
              }}
            />
            {incorrect && (
              <div className="correction">
                <strong>Not quite.</strong>
                <p>An implant can occasionally fail to integrate or develop problems later, even when treatment has been carried out appropriately.</p>
                {!acknowledged && <span>Select “I understand” below to continue.</span>}
                {acknowledged && <span>✓ Correction acknowledged</span>}
              </div>
            )}
          </Screen>
        );
      case 6:
        return (
          <Screen eyebrow="What matters to you?" title="What is most important about this treatment?">
            <ChoiceGrid
              options={['Appearance', 'Long-term success', 'Pain & recovery', 'Treatment duration']}
              selected={priority ?? ''}
              onSelect={(value) => {
                setPriority(value);
                addAudit('Patient priority', value);
              }}
            />
          </Screen>
        );
      case 7:
        return (
          <Screen eyebrow="Ask your dental team" title="Is there anything you want your dentist to discuss with you?">
            <textarea
              className="questionBox"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onBlur={() => question.trim() && addAudit('Patient question submitted', question.trim())}
              placeholder="Example: What happens if the implant does not integrate?"
            />
          </Screen>
        );
      case 8:
        return (
          <Screen eyebrow="Appointment readiness" title="Are you still planning to attend tomorrow?">
            <ChoiceGrid
              options={['Yes, I’ll be there', 'I need to rearrange', 'I need to cancel', 'Please contact me']}
              selected={attendance ?? ''}
              onSelect={(value) => {
                setAttendance(value);
                addAudit('Appointment readiness', value);
              }}
            />
          </Screen>
        );
      default:
        return (
          <Screen eyebrow="You’re ready" title="Your pre-care journey is complete.">
            <div className="summaryList">
              <SummaryRow label="Treatment information" value="Reviewed" />
              <SummaryRow label="Language" value={language} />
              <SummaryRow label="Understanding" value={incorrect ? 'Misunderstanding corrected' : 'Confirmed'} />
              <SummaryRow label="Attendance" value={attendance ?? 'Not confirmed'} />
              <SummaryRow label="Questions for clinician" value={question.trim() ? '1' : '0'} />
            </div>
          </Screen>
        );
    }
  };

  return (
    <main className={largeText ? 'appShell largeText' : 'appShell'}>
      <header className="topbar">
        <div>
          <div className="brand">Sitora Ready™</div>
          <div className="tagline">Pre-Care Intelligence for Healthcare</div>
        </div>
        <span className="prototypeBadge">Prototype v0.3</span>
      </header>

      <section className="workspace">
        <div className="patientColumn">
          <div className="phoneFrame">
            <div className="phoneTop">
              <span>Sitora Ready™</span>
              <span>{step + 1}/{steps.length}</span>
            </div>
            <div className="progressTrack"><div style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <div className="phoneBody">{patientScreen()}</div>
            <div className="phoneActions">
              <button className="secondary" onClick={previous} disabled={step === 0}>Back</button>
              {!complete && (
                <button
                  className="primary"
                  onClick={next}
                  disabled={(step === 5 && !answer) || (step === 6 && !priority) || (step === 8 && !attendance)}
                >
                  {step === 5 && incorrect && !acknowledged ? 'I understand' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="dashboardColumn">
          <section className="dashboardCard">
            <div className="cardHeader">
              <div>
                <span className="eyebrow">Clinician briefing</span>
                <h2>Sarah Khan · Implant UR6</h2>
              </div>
              <span className={`status ${clinicianStatus.includes('Review') ? 'amber' : 'green'}`}>{clinicianStatus}</span>
            </div>
            <div className="metricGrid">
              <Metric label="Journey" value={complete ? 'Complete' : `${step + 1}/${steps.length}`} />
              <Metric label="Attendance" value={attendance ?? 'Pending'} />
              <Metric label="Language" value={language} />
              <Metric label="Support needs" value={support.length ? `${support.length}` : 'None'} />
            </div>
            <Section title="Understanding">
              <p>{!answer ? 'Comprehension check not completed yet.' : incorrect ? (acknowledged ? 'One misunderstanding was identified, corrected and acknowledged.' : 'One misunderstanding requires acknowledgement.') : 'Key implant-success concept understood first time.'}</p>
            </Section>
            <Section title="Patient priority"><p>{priority ?? 'Not captured yet.'}</p></Section>
            <Section title="Support passport"><p>{support.length ? support.join(' · ') : 'No additional support requested.'}</p></Section>
            <Section title="Question for dentist"><p>{question.trim() || 'No question submitted yet.'}</p></Section>
          </section>

          <section className="dashboardCard">
            <div className="cardHeader">
              <div>
                <span className="eyebrow">Sitora Audit</span>
                <h2>Evidence trail</h2>
              </div>
              <span className="status neutral">Live</span>
            </div>
            <div className="auditList">
              {audit.length === 0 && <p className="muted">Patient interactions will appear here.</p>}
              {audit.slice(-7).map((event, index) => (
                <div className="auditRow" key={`${event.label}-${index}`}>
                  <span>{event.label}</span>
                  <strong>{event.detail}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Screen({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="screen"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children}</div>;
}

function ChoiceGrid({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {
  return <div className="choiceGrid">{options.map((option) => <button key={option} onClick={() => onSelect(option)} className={selected === option ? 'choice selected' : 'choice'}>{option}</button>)}</div>;
}

function MultiChoiceGrid({ options, selected, onSelect }: { options: string[]; selected: string[]; onSelect: (value: string) => void }) {
  return <div className="choiceGrid">{options.map((option) => <button key={option} onClick={() => onSelect(option)} className={selected.includes(option) ? 'choice selected' : 'choice'}>{option}</button>)}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="section"><span className="sectionTitle">{title}</span>{children}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="summaryRow"><span>{label}</span><strong>{value}</strong></div>;
}
