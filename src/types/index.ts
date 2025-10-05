export interface Event {
  id: number | string;
  title: string;
  category: 'vorlesung' | 'praktikum' | 'seminar' | 'klausur' | 'lerngruppe' | 'sprechstunde' | 'sonstige';
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  recurrenceEnd?: string;
  isMultiDay?: boolean;
  endDate?: string;
  generatedFromRecurring?: boolean;
  parentId?: number;
  parentMultiDayId?: number;
}

export interface Exam {
  id: number;
  subject: string;
  date: string;
  status: 'geplant' | 'bestanden' | 'nicht-bestanden';
  grade?: number | null;
  percent?: number | null;
  semester: number;
  attempt: number;
  notes?: string;
}

export type TabType = 'dashboard' | 'calendar' | 'events' | 'exams';