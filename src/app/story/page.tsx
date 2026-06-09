'use client';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  location: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2022',
    title: 'The Genesis',
    description: 'ETERNYX was founded in Grasse, France—the cradle of perfumery—by a collective of independent noses seeking to strip away commercial noise and return to pure, undiluted oil extractions.',
    location: 'Grasse, France'
  },
  {
    year: '2023',
    title: 'Olfactory Silence',
    description: 'We published the "Silence is Luxury" manifesto, introducing our signature design language: matte black violet glass bottles, minimalist labels, and complex, slow-evaporating skin scents.',
    location: 'Atelier de L\'Odorat'
  },
  {
    year: '2024',
    title: 'The Parisian Salon',
    description: 'Opened our flagship formulation laboratory in Paris. A private, reservation-only sanctuary where clients could consult directly with master perfumers away from public view.',
    location: 'Paris, France'
  },
  {
    year: '2025',
    title: 'Bespoke Commissions',
    description: 'Launched the Bespoke Project, creating custom, signature formulations for private art collectors and scent purists. Every bespoke formula is registered and archived forever.',
    location: 'Grasse Laboratory'
  },
  {
    year: '2026',
    title: 'The Global Archive',
    description: 'Eternyx expands to select luxury boutiques in London, Tokyo, and New York, preserving our commitment to small-batch formulations and silent exclusivity.',
    location: 'Worldwide'
  }
];

export default function StoryPage() {
  return (
    <main className="story-container">
      {/* Editorial Header */}
      <section className="story-hero">
        <p className="story-eyebrow">Our Heritage</p>
        <h1 className="story-title">Silence is Luxury</h1>
        <p className="story-subtitle">
          ETERNYX was born from a desire to escape the loud, ephemeral trends of modern perfumery. We believe that true luxury does not shout; it lingers in the quiet air, a velvet shadow.
        </p>
      </section>

      {/* Brand Philosophy Split Columns */}
      <section className="philosophy-section">
        <div className="philosophy-grid">
          <div className="philosophy-text">
            <h2>The Craft</h2>
            <p className="philosophy-paragraph">
              Every creation that exits the house of ETERNYX is hand-formulated in Grasse and aged in darkness. We do not use standard synthetic bulk compounds. Instead, we source the highest grade natural concretes and absolutes—from organic Bulgarian Rose to rare wild Assam Oud.
            </p>
            <p className="philosophy-paragraph">
              Our scent curves are engineered to morph dynamically on the skin, adapting to individual warmth to create a profile that is entirely unique to the wearer. Scent is not a mask; it is an extension of identity.
            </p>
          </div>
          <div className="philosophy-visual">
            <div className="visual-box">
              <div className="gold-accent-line" />
              <p className="visual-caption">“A fragrance must whisper to the skin before it speaks to the world.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-header">
          <h2>The Chronology</h2>
          <p>The milestones defining our journey in olfactory architecture</p>
        </div>

        <div className="timeline-tree">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="timeline-node">
              <div className="node-year-col">
                <span className="node-year">{event.year}</span>
              </div>
              
              <div className="node-marker-col">
                <div className="node-dot" />
                <div className="node-line" />
              </div>

              <div className="node-content-col">
                <div className="glass-card node-card">
                  <span className="node-location">{event.location}</span>
                  <h3 className="node-title">{event.title}</h3>
                  <p className="node-desc">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .story-container {
          min-height: 100vh;
          background-color: #060606;
          padding: 140px 50px 80px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .story-hero {
          text-align: center;
          margin-bottom: 80px;
          max-width: 750px;
        }

        .story-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .story-title {
          font-family: var(--font-serif);
          font-size: 3rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .story-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.7;
          font-weight: 300;
        }

        .philosophy-section {
          width: 100%;
          max-width: 1100px;
          margin-bottom: 100px;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 900px) {
          .philosophy-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .philosophy-text h2 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 24px;
          font-weight: 300;
        }

        .philosophy-paragraph {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.8;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .philosophy-visual {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          padding: 40px;
          position: relative;
        }

        .visual-box {
          text-align: center;
          max-width: 280px;
        }

        .gold-accent-line {
          width: 40px;
          height: 1.5px;
          background-color: #d4af37;
          margin: 0 auto 24px auto;
        }

        .visual-caption {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-style: italic;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
        }

        .timeline-section {
          width: 100%;
          max-width: 900px;
          margin-bottom: 40px;
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .timeline-header h2 {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .timeline-header p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .timeline-tree {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .timeline-node {
          display: flex;
          position: relative;
        }

        .node-year-col {
          width: 100px;
          display: flex;
          justify-content: flex-end;
          padding-right: 30px;
          padding-top: 20px;
          flex-shrink: 0;
        }

        .node-year {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: #d4af37;
          font-weight: 400;
          line-height: 1;
        }

        .node-marker-col {
          width: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex-shrink: 0;
        }

        .node-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #d4af37;
          z-index: 2;
          margin-top: 24px;
        }

        .node-line {
          flex: 1;
          width: 1.5px;
          background: rgba(255, 255, 255, 0.08);
          z-index: 1;
        }

        .timeline-node:last-child .node-line {
          display: none;
        }

        .node-content-col {
          flex: 1;
          padding-left: 30px;
          padding-bottom: 40px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 4px;
        }

        .node-card {
          padding: 24px 30px;
          transition: border-color 0.3s;
        }

        .node-card:hover {
          border-color: rgba(212, 175, 55, 0.2);
        }

        .node-location {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
          display: block;
          margin-bottom: 6px;
        }

        .node-title {
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 12px;
          font-weight: 400;
        }

        .node-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          font-weight: 300;
        }

        @media (max-width: 768px) {
          .story-container {
            padding: 100px 24px 60px 24px;
          }
          .story-title {
            font-size: 2.25rem;
          }
          .node-year-col {
            width: 70px;
            padding-right: 15px;
          }
          .node-year {
            font-size: 1.2rem;
          }
          .node-content-col {
            padding-left: 15px;
          }
          .node-card {
            padding: 16px 20px;
          }
        }
      `}</style>
    </main>
  );
}
