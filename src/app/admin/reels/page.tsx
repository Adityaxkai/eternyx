'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Reel } from '@/services/reelService';

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);

  // Form states
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formLikes, setFormLikes] = useState('');
  const [formProductTag, setFormProductTag] = useState('');
  const [formActive, setFormActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await fetch('/api/admin/reels');
      if (res.ok) {
        const data = await res.json();
        setReels(data);
      }
    } catch (error) {
      console.error('Failed to fetch reels', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(reels);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, position: index }));
    setReels(updatedItems);

    try {
      await fetch('/api/admin/reels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: updatedItems.map(item => ({ id: item.id, position: item.position }))
        })
      });
    } catch (error) {
      fetchReels();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setReels(reels.map(r => r.id === id ? { ...r, active: !currentStatus } : r));
      await fetch(`/api/admin/reels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
    } catch (error) {
      fetchReels();
    }
  };

  const deleteReel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reel?')) return;
    try {
      const res = await fetch(`/api/admin/reels/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReels(reels.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete');
    }
  };

  const openDrawer = (reel: Reel | null = null) => {
    if (reel) {
      setEditingReel(reel);
      setFormVideoUrl(reel.video_url || '');
      setFormThumbnailUrl(reel.thumbnail_url || '');
      setFormHandle(reel.handle || '');
      setFormLikes(reel.likes || '');
      setFormProductTag(reel.product_tag || '');
      setFormActive(reel.active);
    } else {
      setEditingReel(null);
      setFormVideoUrl('');
      setFormThumbnailUrl('');
      setFormHandle('@');
      setFormLikes('10K');
      setFormProductTag('Silken Oud');
      setFormActive(true);
    }
    setIsDrawerOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormThumbnailUrl(data.url);
      } else {
        alert('Failed to upload thumbnail.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHandle || !formVideoUrl || !formThumbnailUrl) {
      alert('Please fill in Handle, Video URL, and Thumbnail.');
      return;
    }

    setSubmitting(true);
    const payload = {
      video_url: formVideoUrl,
      thumbnail_url: formThumbnailUrl,
      handle: formHandle,
      likes: formLikes,
      product_tag: formProductTag,
      active: formActive,
    };

    try {
      let res;
      if (editingReel) {
        res = await fetch(`/api/admin/reels/${editingReel.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsDrawerOpen(false);
        fetchReels();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save reel.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving reel.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading reels...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reels & Social</h1>
        <button onClick={() => openDrawer(null)} className="admin-btn-primary">+ Add New Reel</button>
      </div>

      <p className="admin-page-desc">
        Manage the Instagram and TikTok reels shown in the homepage slider. 
        Drag to reorder them.
      </p>

      <div className="table-container">
        <div className="table-header">
          <div className="th col-drag"></div>
          <div className="th col-image">Thumbnail</div>
          <div className="th col-handle">Handle</div>
          <div className="th col-likes">Likes</div>
          <div className="th col-tag">Product Tag</div>
          <div className="th col-status">Status</div>
          <div className="th col-actions">Actions</div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="reels">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="table-body">
                {reels.length === 0 && (
                  <div className="empty-state">No reels found. Add your first reel.</div>
                )}
                {reels.map((reel, index) => (
                  <Draggable key={reel.id} draggableId={reel.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`table-row ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <div className="td col-drag" {...provided.dragHandleProps}>
                          <span className="drag-handle">⋮⋮</span>
                        </div>
                        <div className="td col-image">
                          {reel.thumbnail_url ? (
                            <img src={reel.thumbnail_url} alt={reel.handle} className="row-img portrait" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="row-img-placeholder portrait"></div>
                          )}
                        </div>
                        <div className="td col-handle">
                          <strong>{reel.handle}</strong>
                          <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="view-link">View Video ↗</a>
                        </div>
                        <div className="td col-likes">{reel.likes}</div>
                        <div className="td col-tag">
                          {reel.product_tag ? (
                            <span className="product-tag">{reel.product_tag}</span>
                          ) : (
                            <span className="subtext">—</span>
                          )}
                        </div>
                        <div className="td col-status">
                          <button 
                            className={`toggle-btn ${reel.active ? 'on' : 'off'}`}
                            onClick={() => toggleActive(reel.id, reel.active)}
                          >
                            {reel.active ? 'Active' : 'Hidden'}
                          </button>
                        </div>
                        <div className="td col-actions">
                          <button onClick={() => openDrawer(reel)} className="action-link edit">Edit</button>
                          <button onClick={() => deleteReel(reel.id)} className="action-link delete">Delete</button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Sliding Form Drawer */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
        <div className={`drawer-content ${isDrawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>{editingReel ? 'Edit Video Reel' : 'Add New Video Reel'}</h2>
            <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="drawer-form">
            <div className="form-group">
              <label>Handle</label>
              <input 
                type="text" 
                value={formHandle} 
                onChange={(e) => setFormHandle(e.target.value)} 
                placeholder="@username"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Likes Count</label>
                <input 
                  type="text" 
                  value={formLikes} 
                  onChange={(e) => setFormLikes(e.target.value)} 
                  placeholder="e.g. 84K"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Tag</label>
                <input 
                  type="text" 
                  value={formProductTag} 
                  onChange={(e) => setFormProductTag(e.target.value)} 
                  placeholder="e.g. Silken Oud"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Video URL</label>
              <input 
                type="url" 
                value={formVideoUrl} 
                onChange={(e) => setFormVideoUrl(e.target.value)} 
                placeholder="https://instagram.com/p/... or TikTok URL"
                required
              />
            </div>

            <div className="form-group">
              <label>Video Thumbnail Image</label>
              <div className="image-upload-wrapper">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  id="reel-thumbnail-upload" 
                  style={{ display: 'none' }}
                />
                <label htmlFor="reel-thumbnail-upload" className="upload-box" style={{ height: '180px' }}>
                  {uploading ? (
                    <span className="spinner">Uploading...</span>
                  ) : formThumbnailUrl ? (
                    <img src={formThumbnailUrl} alt="Thumbnail Preview" className="upload-preview" style={{ objectFit: 'contain' }} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="upload-placeholder">Click to upload Video Thumbnail</span>
                  )}
                </label>
                {formThumbnailUrl && (
                  <p className="image-url-text">URL: {formThumbnailUrl}</p>
                )}
              </div>
            </div>

            <div className="form-group toggle-group">
              <label>Active (Visible on homepage)</label>
              <button 
                type="button"
                className={`toggle-btn ${formActive ? 'on' : 'off'}`}
                onClick={() => setFormActive(!formActive)}
              >
                {formActive ? 'Active' : 'Hidden'}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={uploading || submitting}>
              {submitting ? 'Saving...' : editingReel ? 'Save Changes' : 'Create Reel'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-loading {
          padding: 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .admin-page-desc {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 30px;
          font-size: 0.9rem;
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
          background: #111;
          transition: background 0.2s ease;
        }

        .table-row:hover {
          background: #151515;
        }

        .table-row.dragging {
          background: #1a1a1a;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .th, .td {
          display: flex;
          align-items: center;
        }

        .col-drag { width: 40px; flex-shrink: 0; }
        .col-image { width: 60px; flex-shrink: 0; }
        .col-handle { flex: 1; min-width: 150px; flex-direction: column; align-items: flex-start; justify-content: center; }
        .col-likes { width: 100px; flex-shrink: 0; font-family: var(--font-serif); }
        .col-tag { width: 150px; flex-shrink: 0; }
        .col-status { width: 100px; flex-shrink: 0; }
        .col-actions { width: 120px; flex-shrink: 0; gap: 12px; justify-content: flex-end; }

        .drag-handle {
          color: rgba(255, 255, 255, 0.2);
          cursor: grab;
          font-size: 1.2rem;
          letter-spacing: -2px;
        }

        .row-img.portrait {
          width: 40px;
          height: 70px;
          object-fit: cover;
          border-radius: 4px;
          background: #000;
        }

        .row-img-placeholder.portrait {
          width: 40px;
          height: 70px;
          border-radius: 4px;
          background: #222;
        }

        .col-handle strong {
          font-size: 0.9rem;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .view-link {
          font-size: 0.7rem;
          color: #d4af37;
          text-decoration: none;
        }
        
        .view-link:hover {
          text-decoration: underline;
        }

        .product-tag {
          font-size: 0.7rem;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .subtext {
          color: rgba(255, 255, 255, 0.3);
        }

        .toggle-btn {
          background: none;
          border: 1px solid;
          padding: 4px 10px;
          border-radius: 12px;
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

        .action-link {
          background: none;
          border: none;
          font-size: 0.8rem;
          cursor: pointer;
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

        .empty-state {
          padding: 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        /* Drawer Styles */
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
          right: -450px;
          width: 100%;
          max-width: 450px;
          height: 100%;
          background: #0d0d0d;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          padding: 30px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .drawer-content.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
          flex: 1;
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
        .form-group textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          padding: 10px 14px;
          color: #fff;
          font-size: 0.9rem;
          font-family: var(--font-sans);
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255, 255, 255, 0.04);
        }

        .image-upload-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-box {
          height: 120px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.01);
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .upload-box:hover {
          border-color: #d4af37;
        }

        .upload-placeholder {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .upload-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-url-text {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.3);
          word-break: break-all;
          margin: 0;
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
