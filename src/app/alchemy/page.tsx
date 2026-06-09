'use client';

import { useState } from 'react';

interface NoteDetail {
  title: string;
  duration: string;
  description: string;
  ingredients: { name: string; description: string; origin: string }[];
}

const noteData: Record<string, NoteDetail> = {
  top: {
    title: 'Top Notes (The Prelude)',
    duration: '0 – 30 Minutes',
    description: 'The initial impression. Luminous, volatile, and ethereal accords that greet the senses immediately upon application before floating away to reveal the core.',
    ingredients: [
      { name: 'Saffron', description: 'Leathery, soft, and gold-hued spice adding immediate intrigue.', origin: 'Iran' },
      { name: 'Bergamot', description: 'Crisp, sparkling citrus that lifts the opening with cold brilliance.', origin: 'Calabria, Italy' },
      { name: 'Pink Pepper', description: 'Vibrant, rosy spiciness that provides a modern, biting edge.', origin: 'Brazil' },
    ]
  },
  heart: {
    title: 'Heart Notes (The Character)',
    duration: '30 Minutes – 4 Hours',
    description: 'The soul of the fragrance. Deeper, richer, and full-bodied notes that define the signature identity and form the true core character of ETERNYX scents.',
    ingredients: [
      { name: 'Agarwood (Oud)', description: 'Dark, woody, and resinous treasure of unparalleled complexity.', origin: 'Assam, India' },
      { name: 'Bulgarian Rose', description: 'Rich, honeyed, floral absolute harvested by hand at sunrise.', origin: 'Valley of Roses, Bulgaria' },
      { name: 'Jasmine Sambac', description: 'Indolic, sensual floral note delivering nocturnal warmth.', origin: 'Tamil Nadu, India' },
    ]
  },
  base: {
    title: 'Base Notes (The Memory)',
    duration: '4 – 12+ Hours',
    description: 'The lingering sillage. Deep, structural, and tenacious compounds that bind to the skin, slowing the evaporation of lighter notes and leaving a velvet memory.',
    ingredients: [
      { name: 'Sandalwood', description: 'Creamy, smooth, and milky wood that anchors the olfactory arc.', origin: 'Mysore, India' },
      { name: 'Ambergris', description: 'Salty, mineral-rich ocean warmth that morphs uniquely on skin.', origin: 'New Zealand Coastline' },
      { name: 'White Musk', description: 'Clean, clean-skin effect that binds the scent structures together.', origin: 'Synthesized' },
    ]
  }
};

export default function AlchemyPage() {
  const [activeTab, setActiveTab] = useState<'top' | 'heart' | 'base'>('heart');

  const selectedNote = noteData[activeTab];

  return (
    <main className="alchemy-container">
      {/* Hero Header */}
      <section className="alchemy-hero animate-fade-in">
        <p className="alchemy-eyebrow">Formulation Artistry</p>
        <h1 className="alchemy-title">The Alchemy of Scent</h1>
        <p className="alchemy-subtitle">
          In our pursuit of olfactory poetry, we merge the precision of organic science with the rarity of raw nature. Explore the molecular evolution of our compositions.
        </p>
      </section>

      {/* Scent Pyramid & Spotlights Grid */}
      <section className="alchemy-pyramid-section">
        <div className="alchemy-grid">
          
          {/* Scent Pyramid visual column */}
          <div className="pyramid-visual-col">
            <h3 className="visual-heading">The Olfactory Pyramid</h3>
            <p className="visual-desc">Click a layer to dissect its active ingredients</p>
            
            <div className="pyramid-interactive">
              {/* Top Layer */}
              <button 
                className={`pyramid-layer layer-top ${activeTab === 'top' ? 'active' : ''}`}
                onClick={() => setActiveTab('top')}
                aria-label="Top Notes"
              >
                <span className="layer-label">Top Notes</span>
                <span className="layer-duration">0 - 30m</span>
              </button>

              {/* Heart Layer */}
              <button 
                className={`pyramid-layer layer-heart ${activeTab === 'heart' ? 'active' : ''}`}
                onClick={() => setActiveTab('heart')}
                aria-label="Heart Notes"
              >
                <span className="layer-label">Heart Notes</span>
                <span className="layer-duration">30m - 4h</span>
              </button>

              {/* Base Layer */}
              <button 
                className={`pyramid-layer layer-base ${activeTab === 'base' ? 'active' : ''}`}
                onClick={() => setActiveTab('base')}
                aria-label="Base Notes"
              >
                <span className="layer-label">Base Notes</span>
                <span className="layer-duration">4h - 12h+</span>
              </button>
            </div>
          </div>

          {/* Details column */}
          <div className="pyramid-details-col">
            <div className="glass-card details-card">
              <span className="details-badge">{selectedNote.duration}</span>
              <h2 className="details-title">{selectedNote.title}</h2>
              <p className="details-desc">{selectedNote.description}</p>
              
              <div className="ingredients-list">
                <h4 className="ingredients-heading">Key Raw Materials</h4>
                {selectedNote.ingredients.map((ing, idx) => (
                  <div key={idx} className="ingredient-item">
                    <div className="ing-header">
                      <strong className="ing-name">{ing.name}</strong>
                      <span className="ing-origin">{ing.origin}</span>
                    </div>
                    <p className="ing-desc">{ing.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Evaporation Chart Section */}
      <section className="alchemy-chart-section">
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3>Notes Evaporation Curve</h3>
            <p>Visualizing the molecular dry-down timeline on skin over 12 hours</p>
          </div>

          <div className="svg-container">
            <svg viewBox="0 0 800 350" className="chart-svg">
              {/* Grids */}
              <line x1="50" y1="50" x2="750" y2="50" stroke="rgba(255,255,255,0.03)" />
              <line x1="50" y1="125" x2="750" y2="125" stroke="rgba(255,255,255,0.03)" />
              <line x1="50" y1="200" x2="750" y2="200" stroke="rgba(255,255,255,0.03)" />
              <line x1="50" y1="275" x2="750" y2="275" stroke="rgba(255,255,255,0.03)" />
              
              {/* Axes */}
              <line x1="50" y1="300" x2="750" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="50" y1="300" x2="50" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              
              {/* Chart lines for each note category */}
              
              {/* Top Notes Curve (Volatile fast drop) */}
              <path 
                d="M 50 40 Q 150 150 250 300 L 750 300" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeDasharray="4"
                opacity={activeTab === 'top' ? 1 : 0.25}
                className="curve-path"
              />
              
              {/* Heart Notes Curve (Slower hump and gradual fall) */}
              <path 
                d="M 50 150 C 150 40 250 100 450 300 L 750 300" 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth="3.5"
                opacity={activeTab === 'heart' ? 1 : 0.25}
                className="curve-path"
              />
              
              {/* Base Notes Curve (Tenacious long baseline) */}
              <path 
                d="M 50 250 Q 150 220 300 200 T 750 220" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2.5"
                strokeDasharray="2"
                opacity={activeTab === 'base' ? 1 : 0.25}
                className="curve-path"
              />

              {/* Data points */}
              {/* Top notes peak */}
              <circle cx="50" cy="40" r="5" fill="#ef4444" opacity={activeTab === 'top' ? 1 : 0.4} />
              {/* Heart notes peak */}
              <circle cx="180" cy="55" r="6" fill="#d4af37" opacity={activeTab === 'heart' ? 1 : 0.4} />
              {/* Base notes transition */}
              <circle cx="300" cy="200" r="5" fill="#3b82f6" opacity={activeTab === 'base' ? 1 : 0.4} />

              {/* Labels */}
              <text x="75" y="30" fill="#ef4444" fontSize="10" opacity={activeTab === 'top' ? 1 : 0.4}>Top Notes Peak (Instant)</text>
              <text x="200" y="45" fill="#d4af37" fontSize="10" opacity={activeTab === 'heart' ? 1 : 0.4}>Heart Accords (Full Bloom)</text>
              <text x="320" y="190" fill="#3b82f6" fontSize="10" opacity={activeTab === 'base' ? 1 : 0.4}>Base Fixatives (Sillage)</text>

              {/* Y Axis labels */}
              <text x="15" y="55" fill="rgba(255,255,255,0.4)" fontSize="10">High</text>
              <text x="15" y="170" fill="rgba(255,255,255,0.4)" fontSize="10">Medium</text>
              <text x="15" y="295" fill="rgba(255,255,255,0.4)" fontSize="10">Low</text>
              <text x="-190" y="35" fill="rgba(255,255,255,0.4)" fontSize="10" transform="rotate(-90)" letterSpacing="0.1em">CONCENTRATION</text>

              {/* X Axis labels */}
              <text x="50" y="325" fill="rgba(255,255,255,0.4)" fontSize="10">0 Hours (Spray)</text>
              <text x="250" y="325" fill="rgba(255,255,255,0.4)" fontSize="10">1 Hour</text>
              <text x="450" y="325" fill="rgba(255,255,255,0.4)" fontSize="10">4 Hours</text>
              <text x="650" y="325" fill="rgba(255,255,255,0.4)" fontSize="10">12+ Hours (Dry Down)</text>
            </svg>
          </div>
          
          <div className="chart-legend">
            <div className="legend-item" onClick={() => setActiveTab('top')}>
              <span className="legend-dot color-top" />
              <span>Top Notes (Ethereal Opening)</span>
            </div>
            <div className="legend-item" onClick={() => setActiveTab('heart')}>
              <span className="legend-dot color-heart" />
              <span>Heart Notes (Core Sillage)</span>
            </div>
            <div className="legend-item" onClick={() => setActiveTab('base')}>
              <span className="legend-dot color-base" />
              <span>Base Notes (Deep Fixation)</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .alchemy-container {
          min-height: 100vh;
          background-color: #050505;
          padding: 140px 50px 80px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .alchemy-hero {
          text-align: center;
          margin-bottom: 60px;
          max-width: 700px;
        }

        .alchemy-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .alchemy-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .alchemy-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          font-weight: 300;
        }

        .alchemy-pyramid-section {
          width: 100%;
          max-width: 1200px;
          margin-bottom: 60px;
        }

        .alchemy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .alchemy-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .pyramid-visual-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          padding: 40px;
        }

        .visual-heading {
          font-size: 1.15rem;
          margin-bottom: 8px;
          color: #fff;
        }

        .visual-desc {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 40px;
        }

        .pyramid-interactive {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .pyramid-layer {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          padding: 24px 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          outline: none;
        }

        .layer-top {
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          height: 100px;
          justify-content: flex-end;
          padding-bottom: 12px;
          width: 65%;
        }

        .layer-heart {
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
          height: 90px;
          justify-content: center;
          width: 85%;
        }

        .layer-base {
          clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
          height: 90px;
          justify-content: center;
          width: 100%;
        }

        .layer-label {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.3s;
        }

        .layer-duration {
          font-size: 0.7rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pyramid-layer:hover {
          background: rgba(212, 175, 55, 0.03);
          border-color: rgba(212, 175, 55, 0.4);
          color: #fff;
        }

        .pyramid-layer.active {
          background: rgba(212, 175, 55, 0.08);
          border-color: #d4af37;
          color: #fff;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .layer-top.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.06);
        }
        .layer-top:hover {
          border-color: rgba(239, 68, 68, 0.4);
        }

        .layer-base.active {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.06);
        }
        .layer-base:hover {
          border-color: rgba(59, 130, 246, 0.4);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 6px;
        }

        .details-card {
          padding: 40px;
          height: 100%;
        }

        .details-badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-block;
          margin-bottom: 20px;
        }

        .details-title {
          font-size: 1.75rem;
          color: #fff;
          margin-bottom: 16px;
          font-weight: 300;
        }

        .details-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .ingredients-list {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
        }

        .ingredients-heading {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 20px;
        }

        .ingredient-item {
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.01);
          padding: 12px 16px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .ing-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 0.9rem;
        }

        .ing-name {
          color: #fff;
          font-weight: 500;
        }

        .ing-origin {
          color: #d4af37;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ing-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
        }

        .alchemy-chart-section {
          width: 100%;
          max-width: 1200px;
          margin-bottom: 40px;
        }

        .chart-card {
          padding: 40px;
        }

        .chart-header {
          margin-bottom: 30px;
        }

        .chart-header h3 {
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 6px;
        }

        .chart-header p {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .svg-container {
          width: 100%;
          background: #080808;
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .chart-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .curve-path {
          transition: opacity 0.5s ease;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: color 0.2s;
        }

        .legend-item:hover {
          color: #fff;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .color-top { background-color: #ef4444; }
        .color-heart { background-color: #d4af37; }
        .color-base { background-color: #3b82f6; }

        @media (max-width: 768px) {
          .alchemy-container {
            padding: 100px 24px 60px 24px;
          }
          .alchemy-title {
            font-size: 2rem;
          }
          .details-card, .chart-card {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}
