import type { Event } from '../types';
import { createLocalDateString, parseLocalDateString, isToday, isSameDay } from '../utils/dateUtils';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: Event[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (delta: number) => void;
}

export function Calendar({ currentDate, selectedDate, events, onDateSelect, onMonthChange }: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  const firstDayOfMonth = firstDay.getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(year, month, 1 - startOffset + i);
    days.push(day);
  }
  
  const hasEvents = (date: Date): boolean => {
    const dateStr = createLocalDateString(date);
    return events.some(e => e.date === dateStr);
  };
  
  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div>
      <div className="calendar-header">
        <button className="calendar-nav" onClick={() => onMonthChange(-1)}>◀</button>
        <h2>{monthNames[month]} {year}</h2>
        <button className="calendar-nav" onClick={() => onMonthChange(1)}>▶</button>
      </div>
      
      <div className="calendar-grid">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        
        {days.map((day, idx) => {
          const isOtherMonth = day.getMonth() !== month;
          const isTodayDay = isToday(day);
          const isSelected = isSameDay(day, selectedDate);
          const hasEventsDay = hasEvents(day);
          
          return (
            <div
              key={idx}
              className={`calendar-day ${isOtherMonth ? 'other-month' : ''} ${isTodayDay ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEventsDay ? 'has-events' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}