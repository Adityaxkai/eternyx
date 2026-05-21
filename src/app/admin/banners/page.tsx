'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Banner } from '@/services/bannerService';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

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
    // Only one can be mobile first
    try {
      setBanners(banners.map(b => ({ ...b, is_mobile_first: b.id === id })));
      
      // Update the selected one
      await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_mobile_first: true })
      });
      
      // Update others to false
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

  if (loading) {
    return <div className="admin-loading">Loading banners...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hero Banners</h1>
        <button className="admin-btn-primary">+ Add New Banner</button>
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
                        
                        <button className="btn-edit">Replace Images</button>
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
        }
        
        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #d4af37;
          color: #d4af37;
        }
      `}</style>
    </div>
  );
}
