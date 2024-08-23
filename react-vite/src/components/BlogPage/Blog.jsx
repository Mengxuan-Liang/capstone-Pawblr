import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { Link, NavLink } from 'react-router-dom';
import '../HomePage/HomePage';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';

export default function Blog(){
    const username = useSelector(state => state.session.user.username)
    const userId = useSelector(state => state.session.user.id)
    const [expandedPostId, setExpandedPostId] = useState(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchData = async () => {
        await dispatch(thunkGetPosts());
      };
      fetchData();
    }, [dispatch]);
  
    const posts = useSelector(state => state.post.post?.filter(el => el.user_id == userId));
    console.log('shake post', posts)
  
    const handleNotesClick = (postId) => {
      setExpandedPostId(prevId => prevId === postId ? null : postId);
    };

    const handleDelete = async (id) => {
        await dispatch(thunkDeletePost(id))
    }
  
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
              <div><CreateBlogButton/></div>
            </div>
          </aside>
  
          <section className="feed">
            {posts?.map(post => {
              const isExpanded = expandedPostId === post.id;
  
              return (
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
                  <div className="comments-row-container">
                    <button onClick={() => handleNotesClick(post.id)}>
                      {isExpanded ? 'Close' : `${post.comments ? post.comments.length : 0} notes`}
                    </button>
                    <div className="reply-like-container">
                      <span>reply</span>
                      <span>like</span>
                     <span><UpdateBlogButton el ={post}/></span>
                      <span><button onClick={() => handleDelete(post.id)}>delete</button></span>
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
                    </div>
                  )}
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