import { useState } from 'react';
import BoardCard from './BoardCard';
import { ref, update, remove } from 'firebase/database';
import { db } from '../firebase.js';



export default function HomePage(props) {

  const activities = props.activities;
  const setActivities = props.updateActivities;
  const [voteError, setVoteError] = useState(null);

  const [userVotes, setUserVotes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'evt-1', title: 'Hike', time: 'Wed · 9:00 AM' },
    { id: 'evt-2', title: 'Lunch', time: 'Mon · 1:00 PM' },
    { id: 'evt-3', title: "Dave's Hot Chicken", time: 'Fri · 6:00 PM' }
  ]);
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const filteredActivities = activities.filter((activity) => {
    return activity.title && activity.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  function handleVote(id, direction) {

    const current = userVotes[id] || null;

    setUserVotes((prev) => ({
      ...prev,
      [id]: current === direction ? null : direction
    }));

    setActivities((prev) =>
      prev.map((activity) => {

        if (activity.id !== id) {
          return activity;
        }

        if (current === direction) {

          return {
            ...activity,
            [direction]: activity[direction] - 1
          };

        } else if (current !== null) {

          return {
            ...activity,
            [current]: activity[current] - 1,
            [direction]: activity[direction] + 1
          };

        } else {

          return {
            ...activity,
            [direction]: activity[direction] + 1
          };
        }
      })
    );

    const activity = activities.find(a => a.id === id);
    let newUp = activity.up;
    let newDown = activity.down;

    if (current === direction) {
        if (direction === 'up') newUp = activity.up - 1;
        else newDown = activity.down - 1;
    } else if (current !== null) {
        if (current === 'up') { newUp = activity.up - 1; newDown = activity.down + 1; }
        else { newUp = activity.up + 1; newDown = activity.down - 1; }
    } else {
        if (direction === 'up') newUp = activity.up + 1;
        else newDown = activity.down + 1;
    }

    update(ref(db, 'votes/' + id), { up: newUp, down: newDown })
        .catch(err => setVoteError(err.message));
  }

  function handleAccept(activity) {
    const alreadyAccepted = acceptedIds.includes(activity.id);
    if (alreadyAccepted) {
      setAcceptedIds(acceptedIds.filter((id) => id !== activity.id));
      setCalendarEvents(calendarEvents.filter((e) => e.id !== 'act-' + activity.id));
      remove(ref(db, 'acceptedEvents/act-' + activity.id));
    } else {
      setAcceptedIds([...acceptedIds, activity.id]);
      update(ref(db, 'acceptedEvents/act-' + activity.id),  {
        id: 'act-' + activity.id,
        title: activity.title,
        time: activity.time || ''
      });
    }
  }

  function handleRemoveEvent(eventId) {
    setCalendarEvents(calendarEvents.filter((e) => e.id !== eventId));
    if (eventId.startsWith('act-')) {
      const activityId = Number(eventId.slice(4));
      setAcceptedIds(acceptedIds.filter((id) => id !== activityId));
    }
  }

  function handleAddEvent(e) {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    setCalendarEvents([...calendarEvents, {
      id: 'evt-' + Date.now(),
      title: newEventTitle,
      time: newEventTime
    }]);
    setNewEventTitle('');
    setNewEventTime('');
    setShowAddForm(false);
  }

  const boardCards = filteredActivities.map((activity) => {
    return (
      <BoardCard
        key={activity.id}
        activity={activity}
        onVote={handleVote}
        userVote={userVotes[activity.id] || null}
        onAccept={handleAccept}
        isAccepted={acceptedIds.includes(activity.id)}
      />
    );
  });

  const eventItems = calendarEvents.map((event) => {
    return (
      <li key={event.id} className="calendar-event-item">
        <div className="event-info">
          <strong>{event.title}</strong>
          {event.time && <span className="event-meta">{event.time}</span>}
        </div>
        <button
          className="remove-event-btn"
          aria-label={'Remove ' + event.title + ' from calendar'}
          onClick={() => handleRemoveEvent(event.id)}
        >
          Remove
        </button>
      </li>
    );
  });

  return (
    <main className="dashboard">
      {voteError && <p>{voteError}</p>}

      <section className="board-section">

        <div className="board-card">

          <div className="board-header">

            <h2 className="board-title">
              Weekend Plans with the Crew
            </h2>

            <p className="board-subtitle">
              Vote on activities your group has suggested or add your own idea.
            </p>

          </div>

          <div className="board-actions">

            <input
              type="text"
              className="search-input"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <a href="/add-activity" className="add-btn">
              + Add Activity
            </a>

          </div>

          <div className="activity-grid">

            {boardCards}

          </div>

        </div>

      </section>

    </main>
  );
}