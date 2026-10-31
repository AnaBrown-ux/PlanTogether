import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase.js';

export default function AddActivity() {

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);

  async function handleSaveDraft() {
    if (title.trim() === '') {
      setError('Please enter an activity name before saving a draft.');
      setMessage('');
      return;
    }

    const draftId = Date.now();

    const draftActivity = {
      id: draftId,
      title: title.trim(),
      time: time.trim(),
      location: location.trim(),
      price: price.trim(),
      description: description.trim(),
      img: imageLink.trim()
    };

    setDraftSaving(true);
    setError('');
    setMessage('');

    try {
      await set(ref(db, 'activityDrafts/' + draftId), draftActivity);
      setMessage('Draft saved. You can keep editing before adding the activity.');
    } catch (error) {
      setError('Could not save draft: ' + error.message);
    }

    setDraftSaving(false);
  }

  async function handleSubmit(event) {

    event.preventDefault();

    if (title.trim() === '' || time.trim() === '' || location.trim() === '' || imageLink.trim() === '') {
      setError('Please fill out the required fields before adding an activity.');
      setMessage('');
      return;
    }

    const activityId = Date.now();

    const newActivity = {
      id: activityId,
      title: title.trim(),
      time: time.trim(),
      location: location.trim(),
      price: price.trim(),
      description: description.trim(),
      img: imageLink.trim(),
      alt: title.trim(),
      rating: '5.0',
      up: 0,
      down: 0,
      comments: []
    };

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await set(ref(db, 'activities/' + newActivity.id), newActivity);

      setMessage('Activity added successfully!');

      setTitle('');
      setTime('');
      setLocation('');
      setPrice('');
      setDescription('');
      setImageLink('');
    } catch (error) {
      setError('Could not add activity: ' + error.message);
    }

    setSaving(false);
  }

  return (

    <main className="add-activity-main">

      <section className="form-card">

        <h2>Add an Activity</h2>

        <p>
          Suggest a new activity for your group board.
        </p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="activity-form">

          <div className="form-group">

            <label htmlFor="activity-title">
              Activity Name
            </label>

            <input
              id="activity-title"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="activity-time">
              Time
            </label>

            <input
              id="activity-time"
              type="text"
              value={time}
              onChange={(event) => {
                setTime(event.target.value);
              }}
              placeholder="Example: Friday 6:00 PM"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="activity-location">
              Location
            </label>

            <input
              id="activity-location"
              type="text"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
              }}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="activity-price">
              Price
            </label>

            <input
              id="activity-price"
              type="text"
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
              }}
              placeholder="Example: Free or $20"
            />

          </div>

          <div className="form-group">

            <label htmlFor="activity-image">
              Image Link
            </label>

            <input
              id="activity-image"
              type="url"
              value={imageLink}
              onChange={(event) => {
                setImageLink(event.target.value);
              }}
              placeholder="Paste an image URL"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="activity-description">
              Description
            </label>

            <textarea
              id="activity-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              placeholder="Write a short description."
            />

          </div>

          <div className="form-actions">
            <button
              type="button"
              className="add-btn secondary-btn"
              onClick={handleSaveDraft}
              disabled={draftSaving || saving}
            >
              {draftSaving ? 'Saving Draft...' : 'Save Draft'}
            </button>

            <button
              type="submit"
              className="add-btn submit-form-btn"
              disabled={saving || draftSaving}
            >
              {saving ? 'Adding...' : 'Add Activity'}
            </button>
          </div>

        </form>

      </section>

    </main>
  );
}
