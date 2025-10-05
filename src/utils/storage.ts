// utils/storage.ts
import type { Event, Exam } from '../types';

const EVENTS_KEY = 'medStudyEvents';
const EXAMS_KEY = 'medStudyExams';

export function loadEvents(): Event[] {
  const saved = localStorage.getItem(EVENTS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load events:', e);
      return [];
    }
  }
  return [];
}

export function saveEvents(events: Event[]): void {
  const eventsToSave = events.filter(e => !e.generatedFromRecurring);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsToSave));
}

export function loadExams(): Exam[] {
  const saved = localStorage.getItem(EXAMS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load exams:', e);
      return [];
    }
  }
  return [];
}

export function saveExams(exams: Exam[]): void {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
}

export function exportData(events: Event[], exams: Exam[]): void {
  const data = {
    events,
    exams,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medstudyplanner_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}