import { useState } from 'react';
import type { Exam } from '../types';
import { createLocalDateString } from '../utils/dateUtils';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Omit<Exam, 'id'>) => void;
}

export function ExamModal({ isOpen, onClose, onSave }: ExamModalProps) {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(createLocalDateString(new Date()));
  const [status, setStatus] = useState<Exam['status']>('geplant');
  const [grade, setGrade] = useState('');
  const [percent, setPercent] = useState('');
  const [semester, setSemester] = useState('1');
  const [attempt, setAttempt] = useState('1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!subject || !date) {
      alert('Bitte Fach und Datum eingeben!');
      return;
    }

    onSave({
      subject,
      date,
      status,
      grade: grade ? parseFloat(grade) : null,
      percent: percent ? parseInt(percent) : null,
      semester: parseInt(semester),
      attempt: parseInt(attempt),
      notes
    });

    // Reset form
    setSubject('');
    setDate(createLocalDateString(new Date()));
    setStatus('geplant');
    setGrade('');
    setPercent('');
    setSemester('1');
    setAttempt('1');
    setNotes('');
    
    onClose();
  };

  const showGradeInputs = status !== 'geplant';

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Neue Klausur</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Fach</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="z.B. Anatomie I"
            />
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
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as Exam['status'])}>
              <option value="geplant">Geplant</option>
              <option value="bestanden">Bestanden</option>
              <option value="nicht-bestanden">Nicht bestanden</option>
            </select>
          </div>
          
          {showGradeInputs && (
            <>
              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <input
                  type="number"
                  className="form-input"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  placeholder="z.B. 1.7"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Prozent (optional)</label>
                <input
                  type="number"
                  className="form-input"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  min="0"
                  max="100"
                  placeholder="z.B. 87"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label className="form-label">Semester</label>
            <input
              type="number"
              className="form-input"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              min="1"
              max="14"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Versuch</label>
            <select className="form-select" value={attempt} onChange={(e) => setAttempt(e.target.value)}>
              <option value="1">1. Versuch</option>
              <option value="2">2. Versuch</option>
              <option value="3">3. Versuch</option>
            </select>
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