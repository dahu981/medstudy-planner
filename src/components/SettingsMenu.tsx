import { useState, useRef } from 'react';
import type { Event, Exam } from '../types';

interface SettingsMenuProps {
  events: Event[];
  exams: Exam[];
  onImport: (events: Event[], exams: Exam[]) => void;
}

export function SettingsMenu({ events, exams, onImport }: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      events,
      exams,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medstudyplanner_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.events && data.exams) {
          if (confirm('Backup laden? Dies überschreibt alle aktuellen Daten!')) {
            onImport(data.events, data.exams);
            alert('Backup erfolgreich geladen!');
          }
        } else {
          alert('Ungültige Backup-Datei!');
        }
      } catch (err) {
        alert('Fehler beim Laden der Backup-Datei!');
      }
      setIsOpen(false);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', color: 'white', padding: '8px' }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m-8-7h6m6 0h6"></path>
          <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24m-15.56 0l4.24-4.24m7.08-7.08l4.24-4.24"></path>
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            <button
              onClick={handleExport}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: 'var(--gray-800)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Backup erstellen
            </button>
            <button
              onClick={handleImport}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: 'var(--gray-800)',
                borderTop: '1px solid var(--gray-200)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Backup laden
            </button>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}