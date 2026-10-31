import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router';
import {getDatabase, ref, onValue, set as firebaseSet, push as firebasePush} from 'firebase/database';
import { db } from '../firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../index.css';

import NavBar from './NavBar';
import HomePage from './HomePage';
import AddActivity from './AddActivity';
import ActivityDetails from './ActivityDetails';
import InvitePage from './InvitePage';
import CalendarView from './CalendarView';
import SignInPage from './SignInPage';
import Footer from './Footer';



function NotFound() {
  return (
    <main style={{ padding: '2rem' }}>
      <h2>Page not found.</h2>
      <p><Link to="/">Return to home</Link></p>
    </main>
  );
}

const DEFAULT_USER = {
  userId: null,
  userName: "Anonymous",
  userImg: "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80",
  email: null,
};

export default function App() {

  const [activities, setActivities] = useState([]);

  const [loadingVotes, setLoadingVotes] = useState(true);

  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'votes'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setActivities(prev => prev.map(activity => {
          const vote = data[activity.id];
          if (vote) {
            return { ...activity, up: vote.up, down: vote.down };
          }
          return activity;
        }));
      }
      setLoadingVotes(false);
    }, () => {
      setLoadingVotes(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const activitiesRef = ref(db, 'activities');

    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setActivities([]);
        return;
      }

      const parsed = Object.keys(data).map((key) => {
        const activity = data[key];

        const commentsObj = activity.comments || {};
        const comments = Object.keys(commentsObj).map((cKey) => ({
          id: cKey,
          ...commentsObj[cKey]
        }));

        return {
          id: key,
          ...activity,
          comments,
          votes: activity.votes || { up: 0, down: 0 }
        };
      });

      setActivities(parsed);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {

        const userObj = {
          userId: firebaseUser.uid,
          userName: firebaseUser.displayName,
          userImg: firebaseUser.photoURL || DEFAULT_USER.userImg,
          email: firebaseUser.email
        };

        setCurrentUser(userObj);

        const db = getDatabase();
        const userRef = ref(db, 'users/' + firebaseUser.uid);

        firebaseSet(userRef, userObj);

      } else {
        setCurrentUser(DEFAULT_USER);
      }
    });

    return () => unsubscribe();
  }, []);

  function addComment(activityId, text) {
    const newComment = {
      text,
      userId: currentUser.userId,
      userName: currentUser.userName,
      userImg: currentUser.userImg,
      timestamp: Date.now()
    };

    const db = getDatabase();
    firebasePush(ref(db, `activities/${activityId}/comments`), newComment);
  }

  return (
    <div className="app-wrapper">
      {loadingVotes && <p>Loading...</p>}
      <NavBar currentUser={currentUser} />

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              activities={activities}
              updateActivities={setActivities}
            />
          }
        />

        <Route
          path="/add-activity"
          element={<AddActivity />}
        />

        <Route
          path="/activity-details/:id"
          element={
            <ActivityDetails
              activities={activities}
              addComment={addComment}
              currentUser={currentUser}
            />
          }
        />

        <Route path="/invite" element={<InvitePage />} />
        <Route path="/calendar" element={<CalendarView />} />

        <Route path="/signin" element={<SignInPage />} />

        <Route path="*" element={<NotFound />} />

      </Routes>

      <Footer />

    </div>
  );
}