'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Reel } from '@/services/reelService';

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="admin-loading">Loading reels...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reels & Social</h1>
        <button className="admin-btn-primary">+ Add New Reel</button>
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
                            <img src={reel.thumbnail_url} alt={reel.handle} className="row-img portrait" />
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
                          <button className="action-link edit">Edit</button>
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
      `}</style>
    </div>
  );
}
