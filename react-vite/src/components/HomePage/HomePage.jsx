import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts, thunkDeletePost } from '../../redux/postReducer';
import { Link, NavLink, useFetcher, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkAddComments, thunkDeleteComment, thunkGetComments } from '../../redux/commentReducer';
import './HomePage.css';
import ProfileButton from '../Navigation/ProfileButton';
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function HomePage() {
  const posts = useSelector(state => state.post.post);
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
  const profileImage = userInfo?.profileImage;
  const commments = useSelector(state => state.comment.comment)
  const [isloaded, setIsloaded] = useState(false)
  const [text, setText] = useState('')
  const [searchTag, setSearchTag] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followStatus, setFollowStatus] = useState(new Set());
  const [errors, setErrors] = useState({})

  const [isModalOpen, setIsModalOpen] = useState(true);

  const toggleModal = () => {
    setIsModalOpen(prevState => !prevState);
    setIsloaded(!isloaded)
  };


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
      try {
        const response = await fetch(`/api/follow/status`);
        const data = await response.json();
        const followedUsers = new Set(data?.follows?.map(follow => follow.id))
        setFollowStatus(followedUsers)
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    fetchData();
  }, [dispatch, isloaded, userId,isModalOpen]);
  
console.log('is modle open????????', isModalOpen)
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
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
      const res = await dispatch(thunkDeleteComment(id))
      if (res.errors) {
        setErrors(res.errors)
      } else {
        setIsloaded(!isloaded)
      }
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
        // console.log('res after click like', response)
        if (!response.ok) {
          throw new Error('Failed to like the post');
        }
        setLikedPosts(prev => new Set(prev).add(postId));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // TOGGLE FOLLOW
  const handleFollow = async (followeeId) => {
    if (followStatus.has(followeeId)) {
      const res = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followee_id: followeeId }),
      });
      if (!res.ok) {
        throw new Error('Failed to unfollow this user');
      }
      setFollowStatus(pre => {
        const newSet = new Set(pre)
        newSet.delete(followeeId)
        return newSet
      })
    } else {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followee_id: followeeId }),
      });
      if (!res.ok) {
        throw new Error('Failed to follow this user');
      };
      setFollowStatus(prev => new Set(prev).add(followeeId))
    }
  }

  // DELETE POST
  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      await dispatch(thunkDeletePost(id));
    }
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
              <li><NavLink to={'/'}>Home</NavLink></li>
              <li><NavLink to={'/blog'}>Blogs</NavLink></li>
              <li><NavLink to={'/comment'}>Comments</NavLink></li>
              {/* <li><a href="#">Likes</a></li> */}
              {/* <li><a href="#">Activity</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li> */}
            </ul>
            <button onClick={toggleModal} className='create-blog-button'><CreateBlogButton /></button>
          </div>
        </aside>

        <section className="feed">
          {posts?.map(post => {
            // Determine if the current post is liked, post's author is followed
            const isLiked = likedPosts.has(post.id);
            const isFollowed = followStatus.has(post.user_id);

            return (
              <article className="post" key={post.id}>
                <div className="post-header">
                  <img style={{ width: '50px' }} src={post.user?.profileImage} />
                  <div>
                    <div className='post-author-follow-button'>
                      <h3>{post.user?.username}{' '}</h3>
                      {post.user_id !== userId && <button className='follow-button' onClick={() => handleFollow(post.user_id)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>}
                    </div>
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
                    <h4 className={isModalOpen?'clickable-h4':''} onClick={() => toggleComments(post.id)}>
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
                          <span style={{ fontSize: 'small' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
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
