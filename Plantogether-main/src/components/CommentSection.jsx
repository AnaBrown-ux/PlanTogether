import React, { useState } from 'react';

export function CommentsSection(props) {

  const {
    comments,
    addComment,
    commentCount
  } = props;

  return (

    <section className="comments">

      <CommentsHeader
        commentCount={commentCount}
      />

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p><strong>{comment.userName}</strong></p>
          <p>{comment.text}</p>
        </div>
      ))}

      <MessageBox
        addComment={addComment}
      />

    </section>
  );
}

function CommentsHeader(props) {

  return (
    <h3>
      Comments ({props.commentCount})
    </h3>
  );
}

function MessageBox(props) {

  const [inputValue, setInputValue] = useState('');

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handlePost() {

    if (inputValue.trim() === '') {
      return;
    }

    props.addComment(inputValue);

    setInputValue('');
  }

  return (

    <div className="comment-box-container">

      <label htmlFor="comment-box">
        Post a Comment:
      </label>

      <textarea
        id="comment-box"
        placeholder="Add a comment..."
        value={inputValue}
        onChange={handleChange}
      />

      <button
        className="post-comment-btn"
        onClick={handlePost}
      >
        Post
      </button>

    </div>
  );
}