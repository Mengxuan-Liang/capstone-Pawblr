import { useState } from "react";
import { Link } from 'react-router-dom';

export function Post({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleNotesClick = () => {
    setIsExpanded(prev => !prev);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Implement comment posting logic here
    console.log(`Post ID: ${post.id}, New Comment: ${newComment}`);
    // Clear the input field after submitting
    setNewComment("");
  };

  return (
    <article className="post">
      <div className="post-header">
        <h3>{post.user.username}{' '}<Link>Follow</Link></h3>
        <span>{post.created_at}</span>
      </div>
      <div className="post-content">
        <img src="https://via.placeholder.com/600x300" alt="Post" />
        <p style={{ marginTop: '20px' }}>{post.text}</p>
        <br />
        {post.labels?.map(label => (
          <span key={label.id} style={{ color: 'gray' }}>
            #{label.name} {' '}
          </span>
        ))}
      </div>
      <br />
      <hr style={{ color: 'grey' }} />
      <div className="comments-row-container">
        <button onClick={handleNotesClick}>
          {isExpanded ? 'Close' : `${post.comments ? post.comments.length : 0} notes`}
        </button>
        <div className="reply-like-container">
          <span>reply</span>
          <span>like</span>
        </div>
      </div>
      {isExpanded && (
        <div className="comments-section">
          <h4>Comments:</h4>
          <ul>
            {post.comments?.map(comment => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
          />
          <button onClick={handleCommentSubmit}>
            Post Comment
          </button>
        </div>
      )}
    </article>
  );
}
