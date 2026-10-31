import { useParams } from 'react-router';
import { CommentsSection } from './CommentSection';

export default function ActivityDetails(props) {
  const { id } = useParams();
  const { activities, addComment, currentUser } = props;

  const activity = activities.find(
    (a) => String(a.id) === String(id)
  );

  if (!activity) {
    return <h2>Loading activity...</h2>;
  }

  const comments = activity.comments || [];

  function handleAddComment(text) {
    addComment(activity.id, text);
  }

  return (
    <main className="activity-details-page">
      <section className="activity-details-card">

        <img
          src={activity.img}
          alt={activity.alt}
          className="details-image"
        />

        <h2>{activity.title}</h2>

        <p><strong>Time:</strong> {activity.time}</p>
        <p><strong>Location:</strong> {activity.location}</p>
        <p><strong>Price:</strong> {activity.price}</p>
        <p><strong>Rating:</strong> {activity.rating}</p>

        <CommentsSection
          comments={comments}
          commentCount={comments.length}
          addComment={handleAddComment}
          currentUser={currentUser}
        />

      </section>
    </main>
  );
}