import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkGetComments, thunkAddComments, thunkDeleteComment } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import ProfileButton from '../Navigation/ProfileButton';
import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { createImage } from '../../redux/imageReducer';



export default function Blog() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector(state => state.session.user)
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);
  const user = userInfo?.username;
  const userId = userInfo?.id;
  // const profileImage = userInfo?.profileImage;
  const commments = useSelector(state => state.comment.comment)
  const [isloaded, setIsloaded] = useState(false)
  const [text, setText] = useState('')
  // const [searchTag, setSearchTag] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [errors, setErrors] = useState({})
  
  const posts = useSelector(state => state.post.post?.filter(el => el.user_id == userId));
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(thunkGetPosts());
      await dispatch(thunkGetComments());
      if (userId) {
        try {
          const response = await fetch(`/api/likes`);
          const userLikes = await response.json();
          const likedPostIds = new Set(userLikes?.likes?.map(like => like.post_id));
          setLikedPosts(likedPostIds);
        } catch (error) {
          console.error("Error fetching liked posts:", error);
        }
      }
    };
    fetchData();
  }, [dispatch, isloaded, userId]);

  // ADD COMMENT
  const handleSubmit = async (e, post_id) => {
    e.preventDefault();
    const response = await dispatch(thunkAddComments({
      post_id,
      text
    }));
    if (response.errors) {
      setErrors(response)
    } else {
      // navigate('/')
      setText('')
      setIsloaded(!isloaded)
    }
  }
  // DELETE COMMENT
  const handleDelete = async (id) => {
    const res = await dispatch(thunkDeleteComment(id))
    if (res.errors) {
      setErrors(res.errors)
    } else {
      setIsloaded(!isloaded)
    }
  }
  // TOGGLE COMMENT
const toggleComments = (postId) => {
  // Select the correct comments section using the postId
  const commentsSection = document.getElementById(`comments-section-${postId}`);
  
  if (!commentsSection) return; // Ensure that commentsSection exists

  // Find the comment container within the comments section
  const commentContainer = commentsSection.querySelector('.comment-container');
  const notesHeader = commentsSection.querySelector('.clickable-h4');

  if (!commentContainer || !notesHeader) return; // Ensure that commentContainer and notesHeader exist

  // Toggle visibility of the comment container
  const isHidden = commentContainer.classList.toggle('hidden');

  // Update the notes header text based on visibility
  const commentCount = commentContainer.dataset.commentCount || '0';
  notesHeader.textContent = isHidden ? `${commentCount} notes` : 'close notes';
};

  

  // TOGGLE LIKES
  const toggleLike = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        // Unlike the post
        const response = await fetch(`/api/likes/${postId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to unlike the post');
        }
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // Like the post
        const response = await fetch(`/api/likes/${postId}`, { method: 'POST' });
        console.log('res after click like', response)
        if (!response.ok) {
          throw new Error('Failed to like the post');
        }
        setLikedPosts(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  // DELETE POST
  const handleDeletePost = async (id) => {
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
          <div className='profile-button'>
            < ProfileButton />
          </div>
          <ul>
            <li><NavLink to={'/home'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Home</NavLink></li>
            <li><NavLink to={'/blog'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Blogs</NavLink></li>
            <li><NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Comments</NavLink></li>
            <li><NavLink to={'/like'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Likes</NavLink></li>
            {/* <li><a href="#">Activity</a></li>
            <li><a href="#">Messages</a></li>
            <li><a href="#">Settings</a></li> */}
          </ul>
          <div className='create-blog-button'><CreateBlogButton /></div>
        </div>
      </aside>

      <section className="feed">
        {posts?.map(post => {
          // Determine if the current post is liked
          const isLiked = likedPosts.has(post.id);

          return (
            <article className="post" key={post.id}>
              <div className="post-header">
                <img style={{ width: '50px' }} src={post.user?.profileImage} />
                <div>
                  <h3>{post.user?.username}{' '}</h3>
                  <span>{post.created_at}</span>

                </div>
              </div>
              <div className="post-content">
                {post?.img && <img src={post.img} alt="Post" style={{ width: '40%' }} />}
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
              <br></br>
              <div className='notes-reply-like-update-delete-container'>
                <span className="comments-section" id={`comments-section-${post.id}`}>
                  <h4 className='clickable-h4' onClick={() => toggleComments(post.id)}>
                    {post.comments ? post.comments?.length : 0} notes
                  </h4>
                  <br></br>
                  <ul className='comment-container hidden' data-comment-count={post.comments?.length}>
                    <form onSubmit={(e) => handleSubmit(e, post.id)}>
                      <label>
                        <input
                          type='text'
                          value={text}
                          onChange={e => setText(e.target.value)}
                          placeholder={`Reply as @${user}`}
                          required
                        />
                      </label>
                      {errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.text}</p>}
                      <button type="submit">send</button>
                    </form>
                    <br></br>
                    {post.comments?.map(comment => (
                      <div className='comment-details-container' key={comment.id}>
                        <span style={{fontSize:'small'}}>{comment.user?.username}</span>{' '}<span style={{fontSize:'small'}}>{comment.created_at}</span>
                        <div key={comment.id}>{comment.text}</div>
                        {/* <button >reply</button> */}
                        {
                          userId === comment.user_id && <button onClick={() => handleDelete(comment.id)}>delete</button>
                        }
                      </div>
                    ))}
                  </ul>
                </span>

                <span className="comments-row-container">
                  <div className="reply-like-container">
                  <button onClick={() => toggleComments(post.id)}>Reply</button>
                    <span
                      style={{ cursor: 'pointer' }}
                      className="like-button"
                      onClick={() => toggleLike(post.id)}
                    >
                      {isLiked ? (
                        <FaHeart style={{ color: 'red' }} />
                      ) : (
                        <FaRegHeart />
                      )}
                    </span>
                    {
                      post.user_id === userId && <>
                        <span className='update-post-button'><UpdateBlogButton el={post} /></span>
                        <span><button onClick={() => handleDeletePost(post.id)}>Delete</button></span>
                      </>
                    }
                  </div>
                </span>
              </div>
            </article>
          );
        })}
      </section>

        <aside className="right-column">
          <h3>{user}</h3>
          <ul>
            <li><a href="#">Follower</a></li>
            <li><a href="#">Activity</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}