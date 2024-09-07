import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts, thunkDeletePost } from '../../redux/postReducer';
import {  useNavigate, useLocation } from 'react-router-dom';
// import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkAddComments, thunkDeleteComment, thunkGetComments } from '../../redux/commentReducer';
import './HomePage.css';
// import ProfileButton from '../Navigation/ProfileButton';
import { FaRegComment } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import NavBar from '../NavSideBar/NavBar';
import SideBar from '../NavSideBar/SideBar';
import { FaRegShareSquare } from "react-icons/fa";
import RightColumn from '../RightColumn/RightColumn';
import { GiPawHeart } from "react-icons/gi";
import { IoPawOutline } from "react-icons/io5";

export default function Feed({posts}) {
  const location = useLocation();
  const { newPostId } = location.state || {};

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector(state => state.session.user)
//   const posts = useSelector(state => state.post.post);
// const posts = posts;

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
  const [text, setText] = useState({})
  // const [text, setText] = useState('')
  // const [searchTag, setSearchTag] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followStatus, setFollowStatus] = useState(new Set());
  const [errors, setErrors] = useState({})

  //state for the confirmation modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({}); // To store ID and type (post/comment)


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
  }, [dispatch, isloaded, userId,newPostId]);

  // ADD COMMENT
  const handleSubmit = async (e, post_id) => {
    e.preventDefault();
    const response = await dispatch(thunkAddComments({
      post_id,
      text: text[post_id] || ''
    }));
    if (response.errors) {
      setErrors(prev => ({ ...prev, [post_id]: response.errors }));
    } else {
      setText(prev => ({ ...prev, [post_id]: '' }));
      setErrors(prev => ({ ...prev, [post_id]: null }));
      setIsloaded(!isloaded);
    }
  };

  const handleTextChange = (e, post_id) => {
    const value = e.target.value;
    // Clear error if the input is valid (length between 2 and 50 characters)
    if (value.length >= 2 && value.length <= 255) {
      setErrors(prev => ({ ...prev, [post_id]: null }));
    }

    setText(prev => ({ ...prev, [post_id]: value }));
  };
  // DELETE COMMENT
  const handleDelete = async (id) => {
    setShowModal(true); // Show modal
    setModalData({ id, type: 'comment' }); // Store ID and type
  };

  const handleConfirmDelete = async () => {
    const { id, type } = modalData;

    if (type === 'comment') {
      const res = await dispatch(thunkDeleteComment(id));
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setIsloaded(!isloaded);
      }
    } else if (type === 'post') {
      await dispatch(thunkDeletePost(id));
    }

    setShowModal(false); // Close modal
  };
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
    notesHeader.textContent = isHidden ? `${commentCount} comments` : 'close comments';
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
      }
      setFollowStatus(prev => new Set(prev).add(followeeId))
    }
  }
  // REBLOG
  const handleReblog = async (postId) => {
    try {
      const response = await fetch('/api/reblog/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_post_id: postId })
      });
      if (!response.ok) {
        throw new Error('Failed to reblog the post')
      }
      setIsloaded(!isloaded)
    } catch (error) {
      console.error('Error reblogging the post:', error)
    }
  }

  // DELETE POST
  const handleDeletePost = async (id) => {
    setShowModal(true); // Show modal
    setModalData({ id, type: 'post' }); // Store ID and type
  };

  return (
    <div className='page-container'>
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message="Confirm Deletion"
      />
      <header className="header">
        <NavBar />
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <SideBar />
        </aside>

        <section className="feed">
          {posts?.map(post => {
            const isLiked = likedPosts.has(post.id);
            const isFollowed = followStatus.has(post.user_id);
            return (
              <article className="post" key={post.id}>
                {!post?.root_post ? (
                  <>
                    <div className="post-header">
                      <img style={{ width: '50px' }} src={post.user?.profileImage ? post.user.profileImage : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1725296015/capstone/Blue_Dog_Coalition_dgsbdq.webp'} />
                      <div>
                        <div className='post-author-follow-button'>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>

                          <h3>{post.user?.username}{' '}</h3>
                        <span>{post.created_at}</span>
                          </div>
                          {post.user_id !== userId && <button className='follow-button' onClick={() => handleFollow(post.user_id)}>{isFollowed ? 'Following' : 'Follow'}</button>}
                        </div>
                      </div>
                    </div>
                    <div className="post-content">
                      {post?.img && <img src={post.img} alt="Post" style={{ width: '100%' }} />}
                      <p style={{ marginTop: '20px' }}>{post.text}</p>
                      <br />
                      {post.labels?.map(label => (
                        <span key={label.id} style={{ color: 'gray' }}>
                          #{label.name} {' '}
                        </span>
                      ))}
                    </div>
                    <br />
                    {
                      post.user_id === userId && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <span ><UpdateBlogButton el={post} /></span>
                        {/* <span><button onClick={() => handleDeletePost(post.id)}>Delete</button></span> */}
                        <RiDeleteBin6Line className='react-icon' title='Delete' onClick={() => handleDeletePost(post.id)} />
                      </div>
                    }
                    <hr style={{ color: 'grey' }} />
                    <br></br>
                    <div className='notes-reply-like-update-delete-container'>
                      <span className="comments-section" id={`comments-section-${post.id}`}>
                        <h4 className='clickable-h4' onClick={() => toggleComments(post.id)}>
                          {post.comments ? post.comments?.length : 0} comments
                        </h4>
                        <br></br>
                        <ul className='comment-container hidden' data-comment-count={post.comments?.length}>
                          <form onSubmit={(e) => handleSubmit(e, post.id)}>
                            <label>
                              <input
                                type='text'
                                value={text[post.id] || ''}
                                onChange={e => handleTextChange(e, post.id)}
                                placeholder={`Comment as @${user}`}
                                required
                              />
                            </label>
                            {errors[post.id]?.text && <p style={{ color: 'red' }}>{errors[post.id].text}</p>} {' '}
                            <br></br>
                            <br></br>
                            <button onClick={(e)=> setText('')}>Clear</button>{' '}
                            <button onClick={() => toggleComments(post.id)}>Close</button>{' '}
                            <button  type="submit">Send</button>
                          </form>
                          <br></br>
                          {post.comments?.map(comment => (
                            <div className='comment-details-container' key={comment.id}>
                              <span style={{ fontSize: 'large' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <div className='comment-text' key={comment.id}>{comment.text}</div>
                                {/* <button >reply</button> */}
                                {
                                  userId === comment.user_id && <button onClick={() => handleDelete(comment.id)}>Delete</button>
                                }
                              </div>
                            </div>
                          ))}
                        </ul>
                      </span>

                      <span className="comments-row-container">
                        <div className="reply-like-container">
                          {/* <button onClick={() => toggleComments(post.id)}>Reply</button> */}
                          <FaRegComment className='react-icon' title='Comment' onClick={() => toggleComments(post.id)} />
                          {/* <div onClick={() => handleReblog(post.id)}>Reblog</div> */}
                          <FaRegShareSquare className='react-icon' title='Reblog' onClick={() => handleReblog(post.id)} />
                          {/* {post.user_id !== userId &&    */}
                          <span
                            style={{ cursor: 'pointer' }}
                            className="like-button"
                            onClick={() => toggleLike(post.id)}
                          >
                            {isLiked ? (
                              <GiPawHeart className='react-icon' title='Unlike' style={{ color: 'red' }} />
                            ) : (
                              <IoPawOutline className='react-icon' title='Like' />
                            )}
                          </span>
                          {/* }  */}


                        </div>
                      </span>
                    </div>
                  </>) :

                  <>
                    <div className="post-header">
                      <img style={{ width: '50px' }} src={post.user?.profileImage} />
                      <div>
                        <div className='post-author-follow-button'>
                          <h3>{post.user?.username}{' '}Reblogged</h3>
                          {/* {post.user_id !== userId && <button className='follow-button' onClick={() => handleFollow(post.user_id)}>{isFollowed ? 'Following' : 'Follow'}</button>} */}
                        </div>
                        <span>{post.created_at}</span>
                      </div>
                    </div>
                    <div className="post-header">
                      <img style={{ width: '50px' }} src={post.root_post.user?.profileImage} />
                      <div>
                        <div className='post-author-follow-button'>
                          <h3>{post.root_post.user?.username}{' '}</h3>
                          {post.root_post.user_id !== userId && <button className='follow-button' onClick={() => handleFollow(post.root_post?.user_id)}>
                            {followStatus.has(post.root_post.user_id) ? 'Following' : 'Follow'}</button>}
                        </div>
                        <span>{post.root_post.created_at}</span>
                      </div>
                    </div>
                    <div className="post-content">
                      {post?.root_post?.img && <img src={post.root_post.img} alt="Post" style={{ width: '40%' }} />}
                      <p style={{ marginTop: '20px' }}>{post.root_post.text}</p>
                      <br />
                      {post?.root_post?.labels?.map(label => (
                        <span key={label.id} style={{ color: 'gray' }}>
                          #{label.name} {' '}
                        </span>
                      ))}
                    </div>
                    <br />
                    {
                      post.user_id === userId && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        {/* <span ><UpdateBlogButton el={post} /></span> */}
                        {/* <span><button onClick={() => handleDeletePost(post.id)}>Delete</button></span> */}
                        <RiDeleteBin6Line className='react-icon' title='Delete' onClick={() => handleDeletePost(post.id)} />
                      </div>
                    }
                    <hr style={{ color: 'grey' }} />
                    <br></br>
                    <div className='notes-reply-like-update-delete-container'>
                      <span className="comments-section" id={`comments-section-${post.id}`}>
                        <h4 className='clickable-h4' onClick={() => toggleComments(post.id)}>
                          {post.root_post.comments ? post.root_post.comments?.length : 0} comments
                        </h4>
                        <br></br>
                        <ul className='comment-container hidden' data-comment-count={post.root_post.comments?.length}>
                          <form onSubmit={(e) => handleSubmit(e, post.root_post.id)}>
                            <label>
                              <input
                                type='text'
                                value={text[post.root_post.id] || ''}
                                onChange={e => handleTextChange(e, post.root_post.id)}
                                placeholder={`Comment as @${user}`}
                                required
                              />
                            </label>
                            {" "}
                            <button onClick={(e)=> setText('')}>Clear</button>{' '}
                            <button onClick={() => toggleComments(post.id)}>Close</button>{' '}
                            <button type="submit">Send</button> 
                            <div>
                            {errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.text}</p>} {' '}
                            </div>
                          </form>
                          <br></br>
                          {post.root_post.comments?.map(comment => (
                            <div className='comment-details-container' key={comment.id}>
                              <span style={{ fontSize: 'small' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <div key={comment.id}>{comment.text}</div>
                                {
                                  userId === comment.user_id && <button onClick={() => handleDelete(comment.id)}>Delete</button>
                                }
                              </div>
                            </div>
                          ))}
                        </ul>
                      </span>

                      <span className="comments-row-container">
                        <div className="reply-like-container">
                          {/* <button onClick={() => toggleComments(post?.id)}>Reply</button> */}
                          <FaRegComment className='react-icon' title='Comment' onClick={() => toggleComments(post.id)} />
                          {/* <div onClick={() => handleReblog(post.id)}>Reblog</div> */}
                          <FaRegShareSquare className='react-icon' title='Reblog' onClick={() => handleReblog(post.id)} />
                          <span
                            style={{ cursor: 'pointer' }}
                            className="like-button"
                            onClick={() => toggleLike(post.id)}
                          >
                            {isLiked ? (
                              <BiSolidLike title='Unlike' style={{ color: 'red', fontSize: '20px' }} />
                            ) : (
                              <BiLike title='Like' style={{ fontSize: '20px' }} />
                            )}
                          </span>

                        </div>
                      </span>
                    </div>
                  </>}


              </article>
            );
          })}
        </section>

        <aside className="right-column">
        <RightColumn />
        </aside>
      </div>
      <footer className="sign-in-footer" >
        <span>Terms</span>{' '}
        <span>Privacy</span>{' '}
        <span>Support</span>{' '}
        <span>About</span>{' '}
      </footer>
    </div>
  );
}
