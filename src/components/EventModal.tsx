import { useState } from 'react';
import type { Event } from '../types';
import { createLocalDateString } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  initialDate?: string;
}

export function EventModal({ isOpen, onClose, onSave, initialDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Event['category']>('vorlesung');
  const [date, setDate] = useState(initialDate || createLocalDateString(new Date()));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title || !date) {
      alert('Bitte Titel und Datum eingeben!');
      return;
    }

    onSave({
      title,
      category,
      date,
      startTime,
      endTime,
      location,
      notes
    });

    // Reset form
    setTitle('');
    setCategory('vorlesung');
    setDate(createLocalDateString(new Date()));
    setStartTime('');
    setEndTime('');
    setLocation('');
    setNotes('');
    
    onClose();
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Neuer Termin</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Titel</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Anatomie Vorlesung"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Kategorie</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as Event['category'])}>
              <option value="vorlesung">📚 Vorlesung</option>
              <option value="praktikum">🔬 Praktikum</option>
              <option value="seminar">👥 Seminar</option>
              <option value="klausur">📝 Klausur</option>
              <option value="lerngruppe">📖 Lerngruppe</option>
              <option value="sprechstunde">💬 Sprechstunde</option>
              <option value="sonstige">📋 Sonstige</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Datum</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Zeit</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Beginn"
              />
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Ende"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Ort</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="z.B. Hörsaal 1"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Notizen</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Informationen..."
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Speichern</button>
        </div>
      </div>
    </div>
  );
}