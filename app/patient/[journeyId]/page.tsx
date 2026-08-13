'use client';

import { useState } from 'react';

const steps = ['Welcome','Language','Accessibility','Support','Treatment','Understanding','Priorities','Questions','Readiness','Summary'];

export default function PatientJourneyPage(){
  const [step,setStep]=useState(0);
  const [language,setLanguage]=useState('English');
  const [largeText,setLargeText]=useState(false);
  const [support,setSupport]=useState<string[]>([]);
  const [answer,setAnswer]=useState<string|null>(null);
  const [ack,setAck]=useState(false);
  const [priority,setPriority]=useState<string|null>(null);
  const [question,setQuestion]=useState('');
  const [attendance,setAttendance]=useState<string|null>(null);
  const wrong=answer==='Guaranteed';

  const next=()=>{
    if(step===5 && wrong && !ack){ setAck(true); return; }
    setStep(v=>Math.min(v+1,steps.length-1));
  };

  const toggleSupport=(value:string)=>setSupport(prev=>prev.includes(value)?prev.filter(x=>x!==value):[...prev,value]);

  const screen=()=>{
    switch(step){
      case 0:return <><span className="eyebrow">Your treatment tomorrow</span><h1>Understand your care before you arrive.</h1><p>Your dental team has prepared a short guide about your upcoming implant treatment.</p><div className="infoCard"><strong>Dental implant placement</strong><span>Tomorrow · 9:30 AM</span><span>Estimated time: 6 minutes</span></div></>;
      case 1:return <><span className="eyebrow">Language</span><h1>How would you like to receive this information?</h1><div className="choiceGrid">{['English','اردو','Polski','العربية'].map(v=><button key={v} onClick={()=>setLanguage(v)} className={language===v?'choice selected':'choice'}>{v}</button>)}</div></>;
      case 2:return <><span className="eyebrow">Accessibility</span><h1>How can we make this easier for you?</h1><div className="choiceGrid">{['Standard','Larger text','Read aloud','Easy Read'].map(v=><button key={v} onClick={()=>setLargeText(v==='Larger text')} className={(largeText&&v==='Larger text')||(!largeText&&v==='Standard')?'choice selected':'choice'}>{v}</button>)}</div></>;
      case 3:return <><span className="eyebrow">Visit support</span><h1>What would help make your visit easier?</h1><p>You do not need to tell us a diagnosis. Just choose what would help your care team prepare.</p><div className="choiceGrid">{['Quiet waiting area','Explain before touching','Extra appointment time','Support person attending','I may need breaks'].map(v=><button key={v} onClick={()=>toggleSupport(v)} className={support.includes(v)?'choice selected':'choice'}>{v}</button>)}</div></>;
      case 4:return <><span className="eyebrow">Dental implant</span><h1>Your treatment usually happens in stages.</h1><div className="timeline"><span>Assessment</span><b>→</b><span>Implant placement</span><b>→</b><span>Healing</span><b>→</b><span>Final tooth</span></div><p>The final tooth is not always fitted at the same appointment as the implant. Healing time may be required first.</p></>;
      case 5:return <><span className="eyebrow">Quick check</span><h1>Is a dental implant guaranteed to succeed?</h1><div className="choiceGrid">{['Guaranteed','Not guaranteed'].map(v=><button key={v} onClick={()=>{setAnswer(v);setAck(v==='Not guaranteed')}} className={answer===v?'choice selected':'choice'}>{v}</button>)}</div>{wrong&&<div className="correction"><strong>Not quite.</strong><p>An implant can occasionally fail to integrate or develop problems later, even when treatment has been carried out appropriately.</p><span>{ack?'✓ Correction acknowledged':'Select “I understand” below to continue.'}</span></div>}</>;
      case 6:return <><span className="eyebrow">What matters to you?</span><h1>What is most important about this treatment?</h1><div className="choiceGrid">{['Appearance','Long-term success','Pain & recovery','Treatment duration'].map(v=><button key={v} onClick={()=>setPriority(v)} className={priority===v?'choice selected':'choice'}>{v}</button>)}</div></>;
      case 7:return <><span className="eyebrow">Ask your dental team</span><h1>Is there anything you want your dentist to discuss with you?</h1><textarea className="questionBox" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Example: What happens if the implant does not integrate?"/></>;
      case 8:return <><span className="eyebrow">Appointment readiness</span><h1>Are you still planning to attend tomorrow?</h1><div className="choiceGrid">{['Yes, I’ll be there','I need to rearrange','I need to cancel','Please contact me'].map(v=><button key={v} onClick={()=>setAttendance(v)} className={attendance===v?'choice selected':'choice'}>{v}</button>)}</div></>;
      default:return <><span className="eyebrow">You’re ready</span><h1>Your pre-care journey is complete.</h1><div className="summaryList"><div className="summaryRow"><span>Treatment information</span><strong>Reviewed</strong></div><div className="summaryRow"><span>Language</span><strong>{language}</strong></div><div className="summaryRow"><span>Understanding</span><strong>{wrong?'Misunderstanding corrected':'Confirmed'}</strong></div><div className="summaryRow"><span>Attendance</span><strong>{attendance??'Not confirmed'}</strong></div><div className="summaryRow"><span>Questions for clinician</span><strong>{question.trim()?'1':'0'}</strong></div></div></>;
    }
  };

  return <main className={largeText?'patientApp largeText':'patientApp'}><div className="patientMobile"><div className="phoneTop"><span>Sitora Ready™</span><span>{step+1}/{steps.length}</span></div><div className="progressTrack"><div style={{width:`${((step+1)/steps.length)*100}%`}}/></div><div className="phoneBody"><div className="screen">{screen()}</div></div><div className="phoneActions"><button className="secondary" disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>Back</button>{step<steps.length-1&&<button className="primary" onClick={next} disabled={(step===5&&!answer)||(step===6&&!priority)||(step===8&&!attendance)}>{step===5&&wrong&&!ack?'I understand':'Continue'}</button>}</div></div></main>;
}
