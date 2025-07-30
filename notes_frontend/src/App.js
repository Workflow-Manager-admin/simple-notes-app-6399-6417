import React, { useState, useEffect } from 'react';
import './App.css';

// Color variables from workspace requirements
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffb300',
};

/*
 * PUBLIC_INTERFACE
 * The root component for the notes app, with sidebar navigation, main note list, and modals for create/edit.
 */
const App = () => {
  // Initial empty notes; in real usage connect to backend
  const [notes, setNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editNoteData, setEditNoteData] = useState({ id: '', title: '', content: '' });

  // For demonstration only: initial demo notes
  useEffect(() => {
    setNotes([
      {
        id: '1',
        title: 'Welcome Note',
        content: 'This is your first note!',
        created: new Date().toLocaleString(),
      },
      {
        id: '2',
        title: 'React Minimal UI',
        content: 'A simple notes app using a modern minimal UI and modal dialogs.',
        created: new Date().toLocaleString(),
      }
    ]);
  }, []);

  // Helpers
  const currentNote = notes.find(n => n.id === selectedNoteId);

  // PUBLIC_INTERFACE
  const handleCreate = (note) => {
    setNotes(prev => [
      ...prev,
      {
        ...note,
        id: String(Date.now()),
        created: new Date().toLocaleString(),
      }
    ]);
    setShowCreateModal(false);
  };

  // PUBLIC_INTERFACE
  const handleEdit = (updatedNote) => {
    setNotes(prev =>
      prev.map(n => (n.id === updatedNote.id ? { ...n, ...updatedNote } : n))
    );
    setShowEditModal(false);
    setEditNoteData({ id: '', title: '', content: '' });
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  // PUBLIC_INTERFACE
  const openEditModal = (note) => {
    setEditNoteData(note);
    setShowEditModal(true);
  };

  // PUBLIC_INTERFACE
  const filteredNotes = notes.filter(
    n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-app-root" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        open={sidebarOpen}
        notes={filteredNotes}
        selectedId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onAdd={() => setShowCreateModal(true)}
        search={search}
        onSearch={setSearch}
        accentColor={COLORS.accent}
        secondaryColor={COLORS.secondary}
        primaryColor={COLORS.primary}
      />
      <main className="main-section">
        {!selectedNoteId ? (
          <div className="no-note-selected">
            <h2>Welcome!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a note or <button className="btn-accent" onClick={() => setShowCreateModal(true)}>create one</button>.</p>
          </div>
        ) : (
          <NoteView
            note={currentNote}
            onEdit={() => openEditModal(currentNote)}
            onDelete={() => handleDelete(currentNote.id)}
            accentColor={COLORS.accent}
            primaryColor={COLORS.primary}
          />
        )}
      </main>
      {showCreateModal && (
        <NoteModal
          title="Create Note"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          accentColor={COLORS.accent}
        />
      )}
      {showEditModal && (
        <NoteModal
          title="Edit Note"
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
          note={editNoteData}
          accentColor={COLORS.accent}
        />
      )}
    </div>
  );
};

/*
 * Sidebar component: navigation and search
 */
function Sidebar({
  open,
  notes,
  selectedId,
  onSelect,
  onAdd,
  search,
  onSearch,
  accentColor,
  secondaryColor,
  primaryColor
}) {
  return (
    <aside
      className="sidebar"
      style={{
        backgroundColor: '#f7f7f9',
        borderRight: '1px solid #eee',
        width: 260,
        minWidth: 220,
        padding: '2rem 1rem 1rem 1rem',
      }}
    >
      <div className="sidebar-header" style={{ marginBottom: '1rem' }}>
        <span style={{
          display: 'inline-block', fontWeight: 'bold',
          fontSize: 24, color: primaryColor, letterSpacing: '0.03em'
        }}>
          🗒️ Notes
        </span>
      </div>
      <div className="sidebar-search">
        <input
          className="sidebar-search-input"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <nav style={{ margin: '1.5rem 0 0 0', flex: 1, minHeight: 0 }}>
        <ul className="sidebar-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notes.length === 0 &&
            <li className="sidebar-note-empty" style={{ padding: '0.8rem', color: '#bbb', fontStyle: 'italic' }}>
              No notes yet
            </li>
          }
          {notes.map(note => (
            <li
              key={note.id}
              className={`sidebar-note-summary${selectedId === note.id ? ' selected' : ''}`}
              onClick={() => onSelect(note.id)}
              style={{
                cursor: 'pointer',
                background: selectedId === note.id ? accentColor + '22' : 'transparent',
                borderRadius: 8,
                marginBottom: 6,
                padding: '0.7rem 0.5rem',
                transition: 'background .1s'
              }}
              tabIndex={0}
            >
              <div style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>{note.title}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{note.created}</div>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button
          className="btn-accent"
          style={{
            width: '100%',
            marginTop: '2rem',
            background: accentColor,
            color: '#fff',
            border: 'none',
            padding: '12px 0',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}
          onClick={onAdd}
        >
          + New Note
        </button>
      </div>
    </aside>
  );
}

/*
 * NoteView component: shows the note details with edit/delete
 */
function NoteView({ note, onEdit, onDelete, accentColor, primaryColor }) {
  if (!note) return null;
  return (
    <section className="note-view" style={{ padding: '2.5rem 2rem', maxWidth: 650, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8, fontSize: 30 }}>{note.title}</h1>
      <div style={{
        fontSize: 12, color: '#999', marginBottom: 18
      }}>
        Created: {note.created}
      </div>
      <div style={{
        background: '#f5f7fa', borderRadius: 8, fontSize: 18,
        padding: '18px 14px', minHeight: 120
      }}>
        {note.content}
      </div>
      <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
        <button
          className="btn-outline"
          style={{
            border: `2px solid ${accentColor}`,
            color: accentColor,
            padding: '8px 24px',
            borderRadius: 8,
            background: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 16
          }}
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="btn-danger"
          style={{
            border: `2px solid #d13030`,
            color: '#d13030',
            background: '#fff',
            padding: '8px 24px',
            borderRadius: 8,
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 16
          }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </section>
  );
}

/*
 * NoteModal component: for creating or editing notes (title/content)
 */
function NoteModal({ title, onClose, onSave, note, accentColor }) {
  const [form, setForm] = useState(note ? { ...note } : { title: '', content: '', id: '' });

  useEffect(() => {
    if (note) {
      setForm(note);
    }
  }, [note]);

  // PUBLIC_INTERFACE
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required');
    onSave({ ...form, title: form.title.trim(), content: form.content.trim() });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.15)', zIndex: 900, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-dialog" style={{
        background: '#fff',
        borderRadius: 11,
        padding: '36px 32px 28px 32px',
        minWidth: 340,
        maxWidth: 430,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative'
      }}>
        <div
          className="modal-close"
          style={{
            position: 'absolute', top: 16, right: 16, fontSize: 24,
            color: '#aaa', cursor: 'pointer', fontWeight: 600,
          }}
          onClick={onClose}
          tabIndex={0}
        >×</div>
        <h2 style={{ margin: 0, color: accentColor, fontWeight: 600 }}>{title}</h2>
        <form style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={128}
              style={{
                width: '100%', padding: '10px 8px', fontSize: 17, borderRadius: 6, border: '1px solid #ccc'
              }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              style={{
                width: '100%', padding: '10px 8px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{
                border: `2px solid #bbb`,
                color: '#888', padding: '8px 24px',
                borderRadius: 8, background: '#fff',
                fontWeight: 500, fontSize: 15, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent"
              style={{
                background: accentColor, color: '#fff',
                border: 'none', borderRadius: 8, padding: '8px 28px',
                fontWeight: 600, fontSize: 16, boxShadow: '0 1px 5px rgba(0,0,0,0.07)'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
