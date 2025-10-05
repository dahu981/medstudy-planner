import { useState, useEffect } from 'react';
import type { Event, Exam, TabType } from './types';
import { loadEvents, saveEvents, loadExams, saveExams, exportData } from './utils/storage';
import { StatCard } from './components/StatCard';
import { EventCard } from './components/EventCard';
import { ExamCard } from './components/ExamCard';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { ExamModal } from './components/ExamModal';
import { createLocalDateString } from './utils/dateUtils';
import { SettingsMenu } from './components/SettingsMenu';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState<Event['category'] | 'all'>('all');

  useEffect(() => {
    const loadedEvents = loadEvents();
    const loadedExams = loadExams();
    
    if (loadedEvents.length === 0) {
      const today = createLocalDateString(new Date());
      const sampleEvents: Event[] = [
        {
          id: Date.now(),
          title: 'Anatomie Vorlesung',
          category: 'vorlesung',
          date: today,
          startTime: '08:15',
          endTime: '09:45',
          location: 'Hörsaal 1',
          notes: 'Kapitel 5: Herz-Kreislauf-System'
        }
      ];
      setEvents(sampleEvents);
    } else {
      setEvents(loadedEvents);
    }
    
    if (loadedExams.length === 0) {
      const sampleExams: Exam[] = [
        {
          id: Date.now() + 1,
          subject: 'Anatomie I',
          date: '2024-09-15',
          status: 'bestanden',
          grade: 1.7,
          percent: 87,
          semester: 1,
          attempt: 1,
          notes: ''
        }
      ];
      setExams(sampleExams);
    } else {
      setExams(loadedExams);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      saveEvents(events);
    }
  }, [events]);

  useEffect(() => {
    if (exams.length > 0) {
      saveExams(exams);
    }
  }, [exams]);

  const handleExport = () => {
    exportData(events, exams);
  };

  const deleteEvent = (id: number | string) => {
    if (confirm('Termin wirklich löschen?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const deleteExam = (id: number) => {
    if (confirm('Klausur wirklich löschen?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now()
    };
    setEvents([...events, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const handleSaveExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: Date.now()
    };
    setExams([...exams, newExam].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const handleImport = (importedEvents: Event[], importedExams: Exam[]) => {
  setEvents(importedEvents);
  setExams(importedExams);
};

  const handleOpenModal = () => {
    if (currentTab === 'exams') {
      setIsExamModalOpen(true);
    } else {
      setIsEventModalOpen(true);
    }
  };

  // Stats calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = createLocalDateString(today);
  
  const todayEvents = events.filter(e => e.date === todayStr);
  
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekStartStr = createLocalDateString(weekStart);
  const weekEndStr = createLocalDateString(weekEnd);
  const weekEvents = events.filter(e => e.date >= weekStartStr && e.date <= weekEndStr);
  
  const passedExams = exams.filter(e => e.status === 'bestanden').length;
  const totalExams = exams.filter(e => e.status !== 'geplant').length;
  
  const passedWithGrades = exams.filter(e => e.status === 'bestanden' && e.grade);
  const avgGrade = passedWithGrades.length > 0
    ? (passedWithGrades.reduce((sum, e) => sum + (e.grade || 0), 0) / passedWithGrades.length).toFixed(1)
    : '-';
  
  const upcomingEvents = events
    .filter(e => e.date >= todayStr)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.startTime || '').localeCompare(b.startTime || '');
    })
    .slice(0, 5);

  const selectedDateStr = createLocalDateString(selectedDate);
  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);
  const selectedDateText = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Exam stats
  const passed = exams.filter(e => e.status === 'bestanden').length;
  const failed = exams.filter(e => e.status === 'nicht-bestanden').length;
  const total = passed + failed;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Filter events
  const filteredEvents = eventFilter === 'all' 
    ? events 
    : events.filter(e => e.category === eventFilter);

  return (
    <div className="app">
      <header className="header">
  <div className="header-actions">
<h1>
  <img src="/icon-512.png" alt="Logo" style={{ width: '24px', height: '24px' }} />
  MedStudy Planner
</h1>
    <SettingsMenu events={events} exams={exams} onImport={handleImport} />
  </div>
</header>

      <nav className="nav-tabs">
        <button className={`nav-tab ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Übersicht</span>
        </button>
        <button className={`nav-tab ${currentTab === 'calendar' ? 'active' : ''}`} onClick={() => setCurrentTab('calendar')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Kalender</span>
        </button>
        <button className={`nav-tab ${currentTab === 'events' ? 'active' : ''}`} onClick={() => setCurrentTab('events')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>Termine</span>
        </button>
        <button className={`nav-tab ${currentTab === 'exams' ? 'active' : ''}`} onClick={() => setCurrentTab('exams')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span>Klausuren</span>
        </button>
      </nav>

      <main className="content">
        {currentTab === 'dashboard' && (
          <div className="tab-panel active">
            <div className="stats-grid">
              <StatCard value={todayEvents.length} label="Termine heute" variant="primary" />
              <StatCard value={weekEvents.length} label="Diese Woche" variant="success" />
              <StatCard value={`${passedExams}/${totalExams}`} label="Bestanden" variant="warning" />
              <StatCard value={avgGrade} label="Ø Note" variant="info" />
            </div>
            
            <h3 style={{ marginBottom: '12px', color: 'var(--gray-700)' }}>Nächste Termine</h3>
            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <p>Keine anstehenden Termine</p>
              </div>
            ) : (
              <div>
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'calendar' && (
          <div className="tab-panel active">
            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
            />
            
            <h3 style={{ marginBottom: '12px', marginTop: '20px', color: 'var(--gray-700)' }}>
              Termine am {selectedDateText}
            </h3>
            {selectedDateEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>Keine Termine an diesem Tag</p>
              </div>
            ) : (
              <div>
                {selectedDateEvents.map(event => (
                  <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'events' && (
          <div className="tab-panel active">
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '16px', 
              flexWrap: 'wrap',
              padding: '12px',
              background: 'var(--gray-50)',
              borderRadius: '8px'
            }}>
              <button 
                className={`btn ${eventFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('all')}
              >
                Alle
              </button>
              <button 
                className={`btn ${eventFilter === 'vorlesung' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('vorlesung')}
              >
                📚 Vorlesung
              </button>
              <button 
                className={`btn ${eventFilter === 'praktikum' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('praktikum')}
              >
                🔬 Praktikum
              </button>
              <button 
                className={`btn ${eventFilter === 'seminar' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('seminar')}
              >
                👥 Seminar
              </button>
              <button 
                className={`btn ${eventFilter === 'klausur' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('klausur')}
              >
                📝 Klausur
              </button>
              <button 
                className={`btn ${eventFilter === 'lerngruppe' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('lerngruppe')}
              >
                📖 Lerngruppe
              </button>
              <button 
                className={`btn ${eventFilter === 'sprechstunde' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('sprechstunde')}
              >
                💬 Sprechstunde
              </button>
              <button 
                className={`btn ${eventFilter === 'sonstige' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setEventFilter('sonstige')}
              >
                📋 Sonstige
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>Keine Termine {eventFilter !== 'all' ? 'in dieser Kategorie' : 'vorhanden'}</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Tippe auf + um einen Termin zu erstellen</p>
              </div>
            ) : (
              <div>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'exams' && (
          <div className="tab-panel active">
            {exams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>Keine Klausuren vorhanden</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Tippe auf + um eine Klausur hinzuzufügen</p>
              </div>
            ) : (
              <>
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginBottom: '12px', color: 'var(--gray-700)', fontSize: '16px' }}>Übersicht</h3>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span>Fortschritt</span>
                      <span><strong>{passed}</strong> von <strong>{total}</strong> bestanden ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-lerngruppe), var(--color-vorlesung))', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
                    <div style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-lerngruppe)' }}>{passed}</div>
                      <div style={{ color: 'var(--gray-600)', fontSize: '11px' }}>Bestanden</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-klausur)' }}>{failed}</div>
                      <div style={{ color: 'var(--gray-600)', fontSize: '11px' }}>Nicht bestanden</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: 'var(--gray-50)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>{avgGrade}</div>
                      <div style={{ color: 'var(--gray-600)', fontSize: '11px' }}>Ø Note</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {exams.map(exam => (
                    <ExamCard key={exam.id} exam={exam} onDelete={deleteExam} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <button className="fab" onClick={handleOpenModal}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={currentTab === 'calendar' ? selectedDateStr : undefined}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSave={handleSaveExam}
      />
    </div>
  );
}

export default App;