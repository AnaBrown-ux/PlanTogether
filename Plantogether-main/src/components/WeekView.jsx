import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase.js';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DATES = [4, 5, 6, 7, 8, 9, 10];
const HOURS = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'];

function parseEventTime(timeStr) {
  if (!timeStr) return null;
  const dayMatch = timeStr.match(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/i);
  const dateMatch = timeStr.match(/May (\d+)/i);
  const hourMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (!dayMatch || !dateMatch || !hourMatch) return null;

  const date = parseInt(dateMatch[1]);
  let hour = parseInt(hourMatch[1]);
  const minute = hourMatch[2];
  const ampm = hourMatch[3].toUpperCase();

  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  const hourLabel = hour === 12 ? '12 PM' :
    hour === 0 ? '12 AM' :
    hour > 12 ? (hour - 12) + ' PM' :
    hour + ' AM';

  const dayIndex = WEEK_DATES.indexOf(date);
  return { dayIndex, hourLabel };
}

export default function WeekView({ subtitle }) {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const eventsRef = ref(db, 'acceptedEvents');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCalendarEvents(Object.values(data));
      } else {
        setCalendarEvents([]);
      }
    });
  }, []);

  function handleRemoveEvent(eventId) {
    setCalendarEvents(calendarEvents.filter((e) => e.id !== eventId));
  }

  function getEventsForCell(dayIndex, hourLabel) {
    return calendarEvents.filter((event) => {
      const parsed = parseEventTime(event.time);
      return parsed && parsed.dayIndex === dayIndex && parsed.hourLabel === hourLabel;
    });
  }

  return (
    <div>
      {subtitle && <p className="board-subtitle">{subtitle}</p>}
      <table className="week-view">
        <thead>
          <tr>
            <th></th>
            {WEEK_DAYS.map((day, i) => (
              <th key={day}>{day} <span className="week-date">{WEEK_DATES[i]}</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="time-label">{hour}</td>
              {WEEK_DAYS.map((day, dayIndex) => {
                const events = getEventsForCell(dayIndex, hour);
                return (
                  <td key={day}>
                    {events.map((event) => (
                      <div key={event.id} className="week-event">
                        {event.title}
                        <button
                          className="remove-event-btn"
                          aria-label={'Remove ' + event.title}
                          onClick={() => handleRemoveEvent(event.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="calendar-toolbar">
        <Link to="/add-activity" className="add-btn">+ Add Event</Link>
      </div>
    </div>
  );
}