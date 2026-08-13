import Link from 'next/link';

const layers = [
  {
    eyebrow: 'Patient',
    title: 'Patient Journey',
    description:
      'Mobile-first pre-care journey for treatment education, understanding, accessibility, support needs and appointment readiness.',
    href: '/patient/demo',
    action: 'Open patient journey',
  },
  {
    eyebrow: 'Clinical',
    title: 'Clinician Dashboard',
    description:
      'Desktop briefing showing what the patient understood, questions raised, support requirements and anything needing discussion.',
    href: '/clinician',
    action: 'Open clinician dashboard',
  },
  {
    eyebrow: 'Operations',
    title: 'Practice & Reception',
    description:
      'Desktop operations view for tomorrow’s patients, incomplete journeys, cancellations, support needs and recovered chair capacity.',
    href: '/practice',
    action: 'Open practice dashboard',
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(36,92,90,.10), transparent 32%), #f4f7f6',
        padding: '48px 24px',
        color: '#102321',
      }}
    >
      <div
        style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 850,
                letterSpacing: '-0.04em',
                color: '#173f3d',
              }}
            >
              Sitora Ready™
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: 650,
                color: '#667773',
              }}
            >
              Pre-Care Intelligence for Healthcare
            </div>
          </div>

          <div
            style={{
              padding: '9px 14px',
              borderRadius: 999,
              border: '1px solid #d9e4e1',
              background: 'rgba(255,255,255,.75)',
              color: '#245c5a',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Prototype
          </div>
        </header>

        <section
          style={{
            maxWidth: 760,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              color: '#245c5a',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              fontSize: 11,
              fontWeight: 900,
              marginBottom: 14,
            }}
          >
            One platform · Three experiences
          </div>

          <h1
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: 'clamp(42px, 6vw, 72px)',
              lineHeight: 0.98,
              letterSpacing: '-0.055em',
              color: '#102c29',
            }}
          >
            Prepare the patient.
            <br />
            Prepare the clinic.
          </h1>

          <p
            style={{
              maxWidth: 650,
              margin: '24px 0 0',
              fontSize: 18,
              lineHeight: 1.65,
              color: '#61716e',
            }}
          >
            Sitora Ready gives patients a simple mobile pre-care experience
            while clinicians and practice teams receive the intelligence they
            need before the patient arrives.
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {layers.map((layer, index) => (
            <article
              key={layer.href}
              style={{
                minHeight: 330,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 26,
                border: '1px solid rgba(36,92,90,.12)',
                background: '#ffffff',
                boxShadow: '0 16px 44px rgba(23,63,61,.07)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: 28,
                  borderRadius: 14,
                  background: index === 0 ? '#e8f1ef' : '#f3f6f5',
                  color: '#245c5a',
                  fontSize: 15,
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>

              <div
                style={{
                  color: '#7a8a86',
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                  fontSize: 10,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                {layer.eyebrow}
              </div>

              <h2
                style={{
                  margin: 0,
                  color: '#173f3d',
                  fontSize: 26,
                  lineHeight: 1.05,
                  letterSpacing: '-0.035em',
                }}
              >
                {layer.title}
              </h2>

              <p
                style={{
                  margin: '16px 0 28px',
                  color: '#667773',
                  lineHeight: 1.65,
                  fontSize: 14,
                }}
              >
                {layer.description}
              </p>

              <Link
                href={layer.href}
                style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  minHeight: 50,
                  padding: '0 18px',
                  borderRadius: 14,
                  background: '#245c5a',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {layer.action}
                <span>→</span>
              </Link>
            </article>
          ))}
        </section>

        <footer
          style={{
            marginTop: 34,
            paddingTop: 20,
            borderTop: '1px solid #dfe7e5',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            color: '#82908d',
            fontSize: 12,
          }}
        >
          <span>Sitora Ready™ prototype</span>
          <span>Patient · Clinician · Practice</span>
        </footer>
      </div>
    </main>
  );
}