'use client';

import { useEffect, useState } from 'react';

interface JournalPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Heritage');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Draft');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/admin/journal')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch journal posts:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openDrawer = (post: JournalPost | null = null) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setAuthor(post.author);
      setCategory(post.category);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setStatus(post.status);
    } else {
      setEditingPost(null);
      setTitle('');
      setAuthor('Eternyx Editorial');
      setCategory('Heritage');
      setExcerpt('');
      setContent('');
      setStatus('Draft');
    }
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete article.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !excerpt || !content) {
      alert('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    const payload = { title, author, excerpt, content, category, status };

    try {
      let res;
      if (editingPost) {
        res = await fetch(`/api/admin/journal/${editingPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsDrawerOpen(false);
        fetchPosts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save article.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">The Journal</h1>
        <div className="admin-actions">
          <button className="admin-btn-primary" onClick={() => openDrawer(null)}>+ New Article</button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading article listings...</div>
      ) : posts.length === 0 ? (
        <div className="admin-empty">
          <p>No journal articles found. Create your first post.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="col-title">Title</div>
            <div className="col-author">Author</div>
            <div className="col-date">Date</div>
            <div className="col-status">Status</div>
            <div className="col-actions"></div>
          </div>

          <div className="table-body">
            {posts.map((post) => (
              <div key={post.id} className="table-row">
                <div className="col-title">
                  <strong>{post.title}</strong>
                  <span className="col-subtext">{post.category}</span>
                </div>
                <div className="col-author">{post.author}</div>
                <div className="col-date">{post.date}</div>
                <div className="col-status">
                  <span className={`status-badge ${post.status.toLowerCase()}`}>
                    {post.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-link edit" onClick={() => openDrawer(post)}>Edit</button>
                  <button className="action-link delete" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sliding Form Drawer */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
        <div className={`drawer-content ${isDrawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
          <div className="drawer-header">
            <h2>{editingPost ? 'Edit Article' : 'Draft New Article'}</h2>
            <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="drawer-form">
            <div className="form-group">
              <label htmlFor="art-title">Title</label>
              <input 
                id="art-title"
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Science of Sillage"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="art-author">Author</label>
                <input 
                  id="art-author"
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="art-cat">Category</label>
                <select 
                  id="art-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Heritage">Heritage</option>
                  <option value="Scent Care">Scent Care</option>
                  <option value="Releases">Releases</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="art-excerpt">Excerpt / Preview Text</label>
              <textarea 
                id="art-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary displayed on feed list card..."
                rows={2}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="art-body">Article Body Content</label>
              <textarea 
                id="art-body"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full article content body..."
                rows={8}
                required
              />
            </div>

            <div className="form-group toggle-group">
              <label>Publish Status</label>
              <button 
                type="button"
                className={`toggle-btn ${status === 'Published' ? 'on' : 'off'}`}
                onClick={() => setStatus(status === 'Published' ? 'Draft' : 'Published')}
              >
                {status}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : editingPost ? 'Save Changes' : 'Create Article'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-actions {
          display: flex;
          gap: 12px;
        }

        .admin-btn-primary {
          background: #d4af37;
          color: #000;
          padding: 10px 20px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
        }

        .admin-loading, .admin-empty {
          padding: 80px 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .table-container {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .table-header {
          display: flex;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .table-row {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: #151515;
        }

        .col-title { flex: 2; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
        .col-title strong { font-family: var(--font-serif); font-size: 1.1rem; color: #fff; font-weight: 300; }
        .col-subtext { font-size: 0.75rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; }
        .col-author { flex: 1; color: rgba(255, 255, 255, 0.6); }
        .col-date { width: 150px; color: rgba(255, 255, 255, 0.5); }
        .col-status { width: 120px; }
        .col-actions { width: 150px; text-align: right; display: flex; gap: 12px; justify-content: flex-end; }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-badge.published { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-badge.draft { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); }

        .action-link {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          transition: color 0.2s ease;
        }

        .action-link.edit {
          color: #d4af37;
        }
        
        .action-link.edit:hover {
          color: #fff;
        }

        .action-link.delete {
          color: rgba(239, 68, 68, 0.7);
        }

        .action-link.delete:hover {
          color: #ef4444;
        }

        /* Sliding Drawer Styles */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-content {
          position: fixed;
          top: 0;
          right: -520px;
          width: 100%;
          max-width: 520px;
          height: 100vh;
          max-height: 100vh;
          background: #0d0d0d;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          padding: 30px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .drawer-content::-webkit-scrollbar {
          width: 6px;
        }
        .drawer-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .drawer-content::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 3px;
        }
        .drawer-content::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.6);
        }

        .drawer-content.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .drawer-header h2 {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: #fff;
          font-weight: 300;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: color 0.2s;
          padding: 5px;
        }

        .close-btn:hover {
          color: #fff;
        }

        .drawer-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 40px;
          flex-shrink: 0;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 14px;
          color: #fff;
          font-size: 0.85rem;
          font-family: inherit;
          border-radius: 2px;
          transition: all 0.2s;
        }

        .form-group select option {
          background: #0d0d0d;
          color: #fff;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255, 255, 255, 0.04);
        }

        .toggle-group {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .toggle-btn {
          background: none;
          border: 1px solid;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn.on {
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.1);
        }

        .toggle-btn.off {
          color: rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }

        .submit-btn {
          margin-top: 15px;
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
