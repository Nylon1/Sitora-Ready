export default function GovernancePage() {
  return (
    <main className="desktopApp">
      <header className="desktopHeader">
        <div><div className="brand">Sitora Ready™</div><div className="tagline">Governance Dashboard</div></div>
        <div className="headerMeta">Organisation view · Prototype</div>
      </header>
      <section className="desktopContent" style={{width:'min(1180px,100%)',margin:'0 auto'}}>
        <div className="heroPanel"><div><span className="eyebrow">Organisation governance</span><h1>See where pre-care needs attention.</h1><p>Monitor readiness, content coverage, clarification and treatment-plan mismatches across the practice.</p></div><span className="status green">Live demo</span></div>
        <div className="metricGrid">
          <div className="metric"><span>Journeys complete</span><strong>14 / 18</strong></div>
          <div className="metric"><span>Clarifications pending</span><strong>2</strong></div>
          <div className="metric"><span>Coverage mismatches</span><strong>1</strong></div>
          <div className="metric"><span>Approved content</span><strong>92%</strong></div>
        </div>
        <div className="desktopCards" style={{marginTop:18}}>
          <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Clinical governance</span><h2>Attention queue</h2></div></div><div className="auditList"><div className="auditRow"><span>Maria Lopez</span><strong>Bone graft coverage missing</strong></div><div className="auditRow"><span>Sarah Khan</span><strong>Clinician clarification pending</strong></div></div></section>
          <section className="dashboardCard"><div className="cardHeader"><div><span className="eyebrow">Content governance</span><h2>Publishing health</h2></div></div><div className="section"><span className="sectionTitle">Approved</span><p>Most live patient content is approved and versioned.</p></div><div className="section"><span className="sectionTitle">Draft</span><p>Bone graft risk and comprehension content remain in draft.</p></div></section>
        </div>
      </section>
    </main>
  );
}
