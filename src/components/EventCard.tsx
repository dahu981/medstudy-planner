import type { Event } from '../types';
import { parseLocalDateString } from '../utils/dateUtils';

interface EventCardProps {
  event: Event;
  onDelete?: (id: number | string) => void;
}

const categoryIcons: Record<string, string> = {
  vorlesung: '📚',
  praktikum: '🔬',
  seminar: '👥',
  klausur: '📝',
  lerngruppe: '📖',
  sprechstunde: '💬',
  sonstige: '📋'
};

export function EventCard({ event, onDelete }: EventCardProps) {
  const date = parseLocalDateString(event.date);
  const dateStr = date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className={`event-card ${event.category}`}>
      <div className="event-header">
        <div className="event-title">
          {categoryIcons[event.category]} {event.title}
        </div>
        <div className="event-category">{event.category}</div>
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
        {event.startTime && (
          <div className="event-detail">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {event.startTime} {event.endTime && `- ${event.endTime}`}
          </div>
        )}
        {event.location && (
          <div className="event-detail">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {event.location}
          </div>
        )}
        {event.notes && <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--gray-500)' }}>{event.notes}</div>}
      </div>
      {onDelete && (
        <button className="btn btn-danger" style={{ marginTop: '12px', padding: '6px 12px', fontSize: '14px' }} onClick={() => onDelete(event.id)}>
          Löschen
        </button>
      )}
    </div>
  );
}