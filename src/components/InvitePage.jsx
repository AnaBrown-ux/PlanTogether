import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function InvitePage() {
  const [copied, setCopied] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setPeople([]);
        return;
      }

      const userList = Object.keys(data).map((uid) => ({
        id: uid,
        ...data[uid]
      }));

      setPeople(userList);
    });

    return () => unsubscribe();
  }, []);

  function handleCopy() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
  }

  const personItems = people.map((person) => (
    <li className="person" key={person.id}>
      <div className="person-info">
        {person.userImg && (
          <img
            src={person.userImg}
            alt={person.userName}
            className="person-avatar"
          />
        )}

        <div>
          <div className="person-name">
            {person.userName || "Anonymous"}
          </div>

          {person.email && (
            <a
              className="person-email"
              href={`mailto:${person.email}`}
            >
              {person.email}
            </a>
          )}
        </div>
      </div>
    </li>
  ));

  return (
    <main className="form-main">
      <section className="card">
        <h2>Share your Board</h2>
        <p className="board-subtitle">Invite friends to view and vote on your group's activities.</p>

        <h2>People with Access</h2>

        <ul className="people-list">
          {personItems}
        </ul>

        <button className="copy-btn" onClick={handleCopy}>
          Copy Link
        </button>

        {copied && <p className="copy-feedback" aria-live="polite" >Link copied!</p>}
      </section>
    </main>
  );
}