import { Link } from 'react-router';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function BoardCard({ activity, onVote, userVote, onAccept, isAccepted }) {

  const total = activity.up + activity.down;
  const approvePercent = total > 0 ? Math.round((activity.up / total) * 100) : null;

  return (

    <div className="activity-card">

      <img
        src={activity.img}
        alt={activity.alt}
      />

      <section className="activity-card-body">

        <h3 className="activity-title">
          {activity.title}
        </h3>

        <p className="activity-time">
          {activity.time}
        </p>

        <p className="activity-location">
          {activity.location}
        </p>

        <div className="activity-meta">

          <span className="price-tag">
            {activity.price}
          </span>

        </div>

        {approvePercent !== null && (
          <p className="vote-ratio">{approvePercent}% approve</p>
        )}

        <div className="card-footer">

          <div className="votes">

            <span className="votes-label">
              Community Vote:
            </span>

            <button
              className={
                'vote-up' +
                (userVote === 'up' ? ' active-vote' : '')
              }
              aria-label={'Approve activity: ' + activity.title}
              onClick={() => onVote(activity.id, 'up')}
            >
              <FaThumbsUp /> {activity.up}
            </button>

            <button
              className={
                'vote-down' +
                (userVote === 'down' ? ' active-vote' : '')
              }
              aria-label={'Reject activity: ' + activity.title}
              onClick={() => onVote(activity.id, 'down')}
            >
              <FaThumbsDown /> {activity.down}
            </button>

          </div>

          <Link
            to={`/activity-details/${activity.id}`}
            className="view-details"
          >
            View Details →
          </Link>

        </div>

        <button
          className={'schedule-btn' + (isAccepted ? ' scheduled' : '')}
          aria-label={(isAccepted ? 'Remove from calendar: ' : 'Add to calendar: ') + activity.title}
          onClick={() => onAccept(activity)}
        >
          {isAccepted ? '✓ Scheduled' : 'Accept'}
        </button>

      </section>

    </div>
  );
}

export default BoardCard;