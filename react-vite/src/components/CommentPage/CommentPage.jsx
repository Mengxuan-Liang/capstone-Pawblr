import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { Link, NavLink } from 'react-router-dom';
import '../HomePage/HomePage.css';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkGetComments } from '../../redux/commentReducer';

export default function Comment() {
  const username = useSelector(state => state.session.user.username)
  const userId = useSelector(state => state.session.user.id)
  const [expandedPostId, setExpandedPostId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(thunkGetPosts());
      await dispatch(thunkGetComments());
    };
    fetchData();
  }, [dispatch]);

  const comments = useSelector(state => state.comment.comment?.filter(el => el.user_id === userId))
  console.log('how many comments?', comments)


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
              <li><a href="#">Comments</a></li>
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
          {comments?.map(post => {


            return (
              <article className="post" key={post.id}>
                <div className="post-header">
                  <h3>{post.post.username}{' '}<Link>Follow</Link></h3>

                </div>
                <div className="post-content">
                  <img src="https://via.placeholder.com/600x300" alt="Post" />
                  <p style={{ marginTop: '20px' }}>{post.post.text}</p>
                  <br />
                  {/* {post.labels?.map(label => (
                      <span key={label.id} style={{ color: 'gray' }}>
                        #{label.name} {' '}
                      </span>
                    ))} */}
                </div>
                <br />
                <hr style={{ color: 'grey' }} />

                <div className='comment-reply-like'>
                    Your comments:
                    <br></br>
                 {post.text}
<span>update comment</span><span>delete comment</span>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="right-column">
          <h3>{username}</h3>
          <ul>
            <li><a href="#">Follower</a></li>
            <li><a href="#">Activity</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}