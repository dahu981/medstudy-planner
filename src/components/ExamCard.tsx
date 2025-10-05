import type { Exam } from '../types';
import { parseLocalDateString } from '../utils/dateUtils';

interface ExamCardProps {
  exam: Exam;
  onDelete: (id: number) => void;
}

const statusColors = {
  'bestanden': 'var(--color-lerngruppe)',
  'nicht-bestanden': 'var(--color-klausur)',
  'geplant': 'var(--gray-400)'
};

const statusLabels = {
  'bestanden': 'Bestanden',
  'nicht-bestanden': 'Nicht bestanden',
  'geplant': 'Geplant'
};

export function ExamCard({ exam, onDelete }: ExamCardProps) {
  const date = parseLocalDateString(exam.date);
  const dateStr = date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const gradeColor = exam.grade 
    ? (exam.grade <= 1.5 ? 'var(--color-lerngruppe)' :
       exam.grade <= 2.5 ? 'var(--color-vorlesung)' :
       exam.grade <= 3.5 ? 'var(--color-seminar)' :
       'var(--color-klausur)')
    : 'var(--gray-500)';

  return (
    <div className="event-card" style={{ borderLeftColor: statusColors[exam.status] }}>
      <div className="event-header">
        <div className="event-title">📝 {exam.subject}</div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {exam.grade && (
            <div style={{ 
              background: gradeColor, 
              color: 'white', 
              padding: '3px 8px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              fontWeight: '600' 
            }}>
              {exam.grade}
            </div>
          )}
          <div style={{ 
            background: statusColors[exam.status], 
            color: 'white', 
            padding: '3px 8px', 
            borderRadius: '10px', 
            fontSize: '11px' 
          }}>
            {statusLabels[exam.status]}
          </div>
        </div>
      </div>
      
      <div className="event-details">
        <div className="event-detail">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {dateStr}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontSize: '13px' }}>
          <div>📚 {exam.semester}. Semester</div>
          {exam.attempt > 1 && (
            <div style={{ color: 'var(--color-klausur)', fontWeight: '500' }}>
              🔄 {exam.attempt}. Versuch
            </div>
          )}
          {exam.percent && <div>📊 {exam.percent}%</div>}
        </div>
        
        {exam.notes && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            background: 'var(--gray-50)', 
            borderRadius: '6px', 
            fontSize: '12px', 
            color: 'var(--gray-600)' 
          }}>
            {exam.notes}
          </div>
        )}
      </div>
      
      <button 
        className="btn btn-danger" 
        style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px' }} 
        onClick={() => onDelete(exam.id)}
      >
        Löschen
      </button>
    </div>
  );
}