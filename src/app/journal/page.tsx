'use client';

import { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime?: string;
  excerpt: string;
  content?: string;
}

const CATEGORIES = ['All', 'Heritage', 'Scent Care', 'Releases'];

export default function PublicJournalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/journal')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch public articles:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getReadTime = (content: string = '') => {
    const words = content.split(/\s+/).length;
    const minutes = Math.max(Math.round(words / 200), 2);
    return `${minutes} min read`;
  };

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(art => art.category === selectedCategory);

  return (
    <main className="journal-container">
      {/* Hero Header */}
      <section className="journal-hero">
        <p className="journal-eyebrow">The Editorial</p>
        <h1 className="journal-title">The Journal</h1>
        <p className="journal-subtitle">
          Olfactory philosophy, extraction diaries, and seasonal notes curated by the noses and editors of ETERNYX.
        </p>
      </section>

      {/* Category Navigation Tabs */}
      <section className="journal-filter-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Articles Grid */}
      <section className="articles-grid-section">
        {loading ? (
          <div className="no-articles">
            <p>Loading journal articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="no-articles">
            <p>No journal entries found in this category.</p>
          </div>
        ) : (
          <div className="journal-grid">
            {filteredArticles.map((art) => (
              <article key={art.id} className="journal-card glass-card">
                <div className="card-header-meta">
                  <span className="card-cat">{art.category}</span>
                  <span className="card-dot">·</span>
                  <span className="card-read">{art.readTime || getReadTime(art.content)}</span>
                </div>
                
                <h2 className="card-title">{art.title}</h2>
                <p className="card-excerpt">{art.excerpt}</p>
                
                <div className="card-footer-meta">
                  <span className="card-date">{art.date}</span>
                  <button className="read-more-link">
                    Read Article <span className="arrow">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .journal-container {
          min-height: 100vh;
          background-color: #050505;
          padding: 140px 50px 80px 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .journal-hero {
          text-align: center;
          margin-bottom: 60px;
          max-width: 700px;
        }

        .journal-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #d4af37;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .journal-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .journal-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          font-weight: 300;
        }

        .journal-filter-tabs {
          display: flex;
          gap: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          max-width: 1100px;
          justify-content: center;
          padding-bottom: 16px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s ease;
          outline: none;
        }

        .tab-btn:hover, .tab-btn.active {
          color: #ffffff;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -17px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #d4af37;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .tab-btn.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .articles-grid-section {
          width: 100%;
          max-width: 1100px;
        }

        .journal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        @media (max-width: 768px) {
          .journal-grid {
            grid-template-columns: 1fr;
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 6px;
        }

        .journal-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          min-height: 280px;
          transition: border-color 0.3s, transform 0.3s;
        }

        .journal-card:hover {
          border-color: rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }

        .card-header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .card-cat {
          color: #d4af37;
          font-weight: 500;
        }

        .card-dot {
          color: rgba(255, 255, 255, 0.2);
        }

        .card-read {
          color: rgba(255, 255, 255, 0.4);
        }

        .card-title {
          font-size: 1.35rem;
          color: #fff;
          margin-bottom: 14px;
          font-weight: 400;
          line-height: 1.4;
          text-transform: none;
          letter-spacing: 0.02em;
        }

        .card-excerpt {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          margin-bottom: 30px;
          flex: 1;
          font-weight: 300;
        }

        .card-footer-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 16px;
        }

        .card-date {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .read-more-link {
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .read-more-link:hover {
          color: #fff;
        }

        .read-more-link:hover .arrow {
          transform: translateX(4px);
        }

        .arrow {
          transition: transform 0.2s;
        }

        .no-articles {
          text-align: center;
          padding: 80px 0;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .journal-container {
            padding: 100px 24px 60px 24px;
          }
          .journal-title {
            font-size: 2rem;
          }
          .journal-filter-tabs {
            gap: 15px;
            margin-bottom: 30px;
          }
          .journal-card {
            padding: 24px;
            min-height: auto;
          }
        }
      `}</style>
    </main>
  );
}
