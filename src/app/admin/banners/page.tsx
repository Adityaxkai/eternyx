'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Banner } from '@/services/bannerService';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form states
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formMobileImageUrl, setFormMobileImageUrl] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formMobileFirst, setFormMobileFirst] = useState(false);

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to fetch banners', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, position: index }));
    setBanners(updatedItems);

    try {
      await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: updatedItems.map(item => ({ id: item.id, position: item.position }))
        })
      });
    } catch (error) {
      fetchBanners();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setBanners(banners.map(b => b.id === id ? { ...b, active: !currentStatus } : b));
      await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
    } catch (error) {
      fetchBanners();
    }
  };

  const toggleMobileFirst = async (id: string) => {
    try {
      setBanners(banners.map(b => ({ ...b, is_mobile_first: b.id === id })));
      
      await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_mobile_first: true })
      });
      
      const others = banners.filter(b => b.id !== id);
      for (const other of others) {
        await fetch(`/api/admin/banners/${other.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_mobile_first: false })
        });
      }
    } catch (error) {
      fetchBanners();
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
      } else {
        alert('Failed to delete banner.');
      }
    } catch (error) {
      console.error('Failed to delete banner', error);
    }
  };

  const openDrawer = (banner: Banner | null = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormImageUrl(banner.image_url);
      setFormMobileImageUrl(banner.mobile_image_url || '');
      setFormActive(banner.active);
      setFormMobileFirst(banner.is_mobile_first || false);
    } else {
      setEditingBanner(null);
      setFormImageUrl('');
      setFormMobileImageUrl('');
      setFormActive(true);
      setFormMobileFirst(false);
    }
    setIsDrawerOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobileType: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isMobileType) {
      setUploadingMobile(true);
    } else {
      setUploadingDesktop(true);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (isMobileType) {
          setFormMobileImageUrl(data.url);
        } else {
          setFormImageUrl(data.url);
        }
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error.');
    } finally {
      if (isMobileType) {
        setUploadingMobile(false);
      } else {
        setUploadingDesktop(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      alert('Please upload a Desktop image.');
      return;
    }

    setSubmitting(true);
    const payload = {
      image_url: formImageUrl,
      mobile_image_url: formMobileImageUrl || formImageUrl,
      active: formActive,
      is_mobile_first: formMobileFirst,
    };

    try {
      let res;
      if (editingBanner) {
        res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsDrawerOpen(false);
        fetchBanners();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save banner.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving banner.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading banners...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hero Banners</h1>
        <button onClick={() => openDrawer(null)} className="admin-btn-primary">+ Add New Banner</button>
      </div>
      
      <p className="admin-page-desc">
        Manage the rotating hero banners on the homepage. Drag to reorder. 
        Select one banner to be the default "First" on mobile devices.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners" direction="vertical">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="banners-list"
            >
              {banners.map((banner, index) => (
                <Draggable key={banner.id} draggableId={banner.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`banner-card ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="drag-handle" {...provided.dragHandleProps}>⋮⋮</div>
                      
                      <div className="banner-preview">
                        <img src={banner.image_url} alt={`Banner ${index + 1}`} />
                        <div className="banner-number">{index + 1}</div>
                      </div>
                      
                      <div className="banner-details">
                        <div className="banner-alt">{`Banner ${index + 1}`}</div>
                        <div className="banner-paths">
                          <span><strong>Desktop:</strong> {banner.image_url}</span>
                          <span><strong>Mobile:</strong> {banner.mobile_image_url || 'Same as desktop'}</span>
                        </div>
                      </div>
                      
                      <div className="banner-actions">
                        <div className="action-toggle">
                          <label>Active</label>
                          <button 
                            className={`toggle-btn ${banner.active ? 'on' : 'off'}`}
                            onClick={() => toggleActive(banner.id, banner.active)}
                          >
                            {banner.active ? 'Yes' : 'No'}
                          </button>
                        </div>
                        
                        <div className="action-toggle">
                          <label>Mobile First</label>
                          <button 
                            className={`toggle-btn ${banner.is_mobile_first ? 'on' : 'off'}`}
                            onClick={() => toggleMobileFirst(banner.id)}
                            disabled={banner.is_mobile_first}
                          >
                            {banner.is_mobile_first ? 'Selected' : 'Set'}
                          </button>
                        </div>
                        
                        <div className="banner-buttons-wrap">
                          <button onClick={() => openDrawer(banner)} className="btn-edit">Edit</button>
                          <button onClick={() => deleteBanner(banner.id)} className="btn-delete">Delete</button>
                        </div>
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

      {/* Sliding Form Drawer */}
      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
        <div className={`drawer-content ${isDrawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>{editingBanner ? 'Edit Hero Banner' : 'Add New Hero Banner'}</h2>
            <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="drawer-form">
            <div className="form-group">
              <label>Desktop Image (Wide)</label>
              <div className="image-upload-wrapper">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, false)} 
                  id="banner-desktop-upload" 
                  style={{ display: 'none' }}
                />
                <label htmlFor="banner-desktop-upload" className="upload-box">
                  {uploadingDesktop ? (
                    <span className="spinner">Uploading...</span>
                  ) : formImageUrl ? (
                    <img src={formImageUrl} alt="Desktop Preview" className="upload-preview" />
                  ) : (
                    <span className="upload-placeholder">Click to upload Desktop image</span>
                  )}
                </label>
                {formImageUrl && (
                  <p className="image-url-text">URL: {formImageUrl}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Image (Optional)</label>
              <div className="image-upload-wrapper">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, true)} 
                  id="banner-mobile-upload" 
                  style={{ display: 'none' }}
                />
                <label htmlFor="banner-mobile-upload" className="upload-box">
                  {uploadingMobile ? (
                    <span className="spinner">Uploading...</span>
                  ) : formMobileImageUrl ? (
                    <img src={formMobileImageUrl} alt="Mobile Preview" className="upload-preview" />
                  ) : (
                    <span className="upload-placeholder">Click to upload Mobile image</span>
                  )}
                </label>
                {formMobileImageUrl && (
                  <p className="image-url-text">URL: {formMobileImageUrl}</p>
                )}
              </div>
            </div>

            <div className="form-group toggle-group">
              <label>Active Banner</label>
              <button 
                type="button"
                className={`toggle-btn ${formActive ? 'on' : 'off'}`}
                onClick={() => setFormActive(!formActive)}
              >
                {formActive ? 'Yes' : 'No'}
              </button>
            </div>

            <div className="form-group toggle-group">
              <label>Mobile First (Show first on phones)</label>
              <button 
                type="button"
                className={`toggle-btn ${formMobileFirst ? 'on' : 'off'}`}
                onClick={() => setFormMobileFirst(!formMobileFirst)}
              >
                {formMobileFirst ? 'Yes' : 'No'}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={uploadingDesktop || uploadingMobile || submitting}>
              {submitting ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
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

        .banners-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-card {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          display: flex;
          padding: 20px;
          align-items: center;
          gap: 24px;
          transition: background 0.2s ease;
        }

        .banner-card:hover {
          background: #151515;
        }

        .banner-card.dragging {
          background: #1a1a1a;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .drag-handle {
          color: rgba(255, 255, 255, 0.2);
          cursor: grab;
          font-size: 1.5rem;
          letter-spacing: -2px;
          padding: 0 10px;
        }

        .banner-preview {
          position: relative;
          width: 200px;
          height: 100px;
          background: #000;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .banner-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
        }

        .banner-number {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: #d4af37;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .banner-details {
          flex: 1;
        }

        .banner-alt {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 12px;
        }

        .banner-paths {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .banner-paths strong {
          color: rgba(255, 255, 255, 0.7);
        }

        .banner-actions {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .action-toggle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .action-toggle label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
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
        
        .toggle-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .banner-buttons-wrap {
          display: flex;
          gap: 10px;
        }

        .btn-edit {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 2px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #d4af37;
          color: #d4af37;
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.05);
          color: rgba(239, 68, 68, 0.7);
          border: 1px solid rgba(239, 68, 68, 0.1);
          padding: 8px 16px;
          border-radius: 2px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
          color: #ef4444;
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
