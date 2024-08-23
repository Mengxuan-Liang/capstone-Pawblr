import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts } from '../../redux/postReducer';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './HomePage.css';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import { thunkAddComments, thunkGetComments } from '../../redux/commentReducer';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user.username)
  const posts = useSelector(state => state.post.post);
  const commments = useSelector(state => state.comment.comment)
  const [isloaded, setIsloaded] = useState(false)

  const [text, setText] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(thunkGetPosts());
      await dispatch(thunkGetComments());
  
    };
    fetchData();
  }, [dispatch,isloaded]);

  const handleSubmit = async (e, post_id) => {
    e.preventDefault();
    const response = await dispatch(thunkAddComments({
      post_id,
      text
    }));
    if(response.errors){
      setErrors(response)
    }else {
      navigate('/')
      setIsloaded(!isloaded)
    }
  }


  const toggleComments = (event) => {
    const commentsSection = event.target.closest('.comments-section');
    const commentContainer = commentsSection.querySelector('.comment-container');
    const notesHeader = commentsSection.querySelector('.clickable-h4');

    if (!commentContainer || !notesHeader) return;

    const isHidden = commentContainer.classList.toggle('hidden');
    const commentCount = commentContainer.dataset.commentCount || 'data-comment-count';

    notesHeader.textContent = isHidden
      ? `${commentCount} notes`
      : 'close notes';
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
                    {post.comments ? post.comments?.length : 0} notes
                  </h4>
                  <ul className='comment-container hidden' data-comment-count={post.comments?.length}>
                    <form onSubmit={(e)=>handleSubmit(e, post.id)}>
                      <label>
                    <input
                    type='text'
                      value={text}
                      onChange={e=>setText(e.target.value)}
                      placeholder={`Reply as @${user}`}
                      required
                    />

                      </label>
                     {errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.text}</p>}
                     <button type="submit">send</button>

                    </form>

                    {post.comments?.map(comment => (
                      <div className='comment-details-container' key={comment.id}>
                        <span>{comment.user?.username}</span>{' '}<span>{comment.created_at}</span>
                        <div key={comment.id}>{comment.text}</div>
                        <button >reply</button>
                      </div>
                    ))}
                  </ul>
                  <span className="comments-row-container">
                  </span>
                </span>
                <div className="reply-like-container ">
                  {/* <span style={{border:'red 1px solid'}}className="reply" onClick={toggleComments} >reply</span> */}
                  <span >like</span>
                </div>
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
