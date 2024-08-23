import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts } from '../../redux/postReducer';
import { Link, NavLink } from 'react-router-dom';
import './HomePage.css';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(thunkGetPosts());
    };
    fetchData();
  }, [dispatch]);

  const posts = useSelector(state => state.post.post);

  const toggleComments = (event) => {
    const commentContainer = event.target.nextElementSibling;
    if (commentContainer) {
      commentContainer.classList.toggle('hidden');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo">Dumblr</div>
        <nav className="navigation">
          <a href="#">For you</a>
          <a href="#">Following</a>
          <a href="#">Your tags</a>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="fixed-menu">
            <ul>
              <li><NavLink to={'/'}>Home</NavLink></li>
              <li><NavLink to={'/blog'}>Blogs</NavLink></li>
              <li><NavLink to={'/comment'}>Comments</NavLink></li>
              <li><a href="#">Likes</a></li>
              <li><a href="#">Activity</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Log out</a></li>
            </ul>
            <div><CreateBlogButton /></div>
          </div>
        </aside>

        <section className="feed">
          {posts?.map(post => (
            <article className="post" key={post.id}>
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
           <div className='comment-reply-like'>

              <span className="comments-section">
                <h4 className='clickable-h4' onClick={toggleComments}>
                  {post.comments ? post.comments.length : 0} notes
                </h4>
                <ul className='comment-container hidden'>
                  {post.comments?.map(comment => (
                    <div className='comment-details-container'>
                      <span>{comment.user?.username}</span>{' '}<span>{comment.created_at}</span>
                      <div key={comment.id}>{comment.text}</div>
                      <button>reply</button>
                    </div>
                  ))}
                </ul>
              </span>
              <span className="comments-row-container">
                <div className="reply-like-container">
                  <span>reply</span>
                  <span>like</span>
                </div>
              </span>

           </div>
            </article>
          ))}
        </section>

        <aside className="right-column">
          <h3>Suggested Blogs</h3>
          <ul>
            <li><a href="#">Blog 1</a></li>
            <li><a href="#">Blog 2</a></li>
            <li><a href="#">Blog 3</a></li>
            <li><a href="#">Blog 4</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
