import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase.js';

const days = [
  { name: 'Sun', number: 4, month: 'May' },
  { name: 'Mon', number: 5, month: 'May' },
  { name: 'Tue', number: 6, month: 'May' },
  { name: 'Wed', number: 7, month: 'May' },
  { name: 'Thu', number: 8, month: 'May' },
  { name: 'Fri', number: 9, month: 'May' },
  { name: 'Sat', number: 10, month: 'May' },
];

const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'];

function parseEventTime(timeStr) {
  if (!timeStr) return null;
  const dateMatch = timeStr.match(/May (\d+)/i);
  const hourMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!dateMatch || !hourMatch) return null;

  const date = parseInt(dateMatch[1]);
  let hour = parseInt(hourMatch[1]);
  const ampm = hourMatch[3].toUpperCase();

  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  const hourLabel = hour === 12 ? '12 PM' :
    hour === 0 ? '12 AM' :
    hour > 12 ? (hour - 12) + ' PM' :
    hour + ' AM';

  return { date, hourLabel };
}

export default function DayView({ subtitle }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const eventsRef = ref(db, 'acceptedEvents');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAllEvents(Object.values(data));
      } else {
        setAllEvents([]);
      }
    });
  }, []);

  function handlePrevDay() {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  }

  function handleNextDay() {
    if (currentDayIndex < days.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  }

  function handleRemoveEvent(eventId) {
    setAllEvents(allEvents.filter((e) => e.id !== eventId));
  }

  const currentDay = days[currentDayIndex];

  function getEventsForHour(hour) {
    return allEvents.filter((event) => {
      const parsed = parseEventTime(event.time);
      return parsed && parsed.date === currentDay.number && parsed.hourLabel === hour;
    });
  }

  return (
    <div className="day-view">
      <div className="day-card">
        <div className="day-card-header">
          <button onClick={handlePrevDay} disabled={currentDayIndex === 0}>←</button>
          <div className="day-label">
            <span className="day-name">{currentDay.name}</span>
            <span className="day-number">{currentDay.number}</span>
          </div>
          <span className="month-label">{currentDay.month}</span>
          <button onClick={handleNextDay} disabled={currentDayIndex === days.length - 1}>→</button>
        </div>
        {subtitle && <p className="day-subtitle">{subtitle}</p>}
        <div className="timeline">
          {hours.map((hour) => {
            const events = getEventsForHour(hour);
            return (
              <div key={hour} className={'time-row' + (events.length > 0 ? ' has-event' : '')}>
                <span className="time">{hour}</span>
                <div className="time-line">
                  {events.map((event) => (
                    <div key={event.id} className="event-block">
                      <span>{hour} - {event.title}</span>
                      <button
                        className="remove-event-btn"
                        aria-label={'Remove ' + event.title}
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}