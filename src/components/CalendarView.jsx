import DayView from './DayView';
import WeekView from './WeekView';

export default function CalendarPage() {
  return (
    <main className="calendar-main">
      <section>
        <h2>Today's Activities</h2>
        <p className="calendar-subtitle">See what your group has planned and check upcoming activities for the week.</p>
      </section>
      <DayView />
      <WeekView />
    </main>
  );
}