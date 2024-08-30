import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkGetComments, thunkAddComments, thunkDeleteComment } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import ProfileButton from '../Navigation/ProfileButton';
import { FaRegComment } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";



export default function Like() {
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
  const [text, setText] = useState({})
  // const [text, setText] = useState('')
  // const [searchTag, setSearchTag] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followStatus, setFollowStatus] = useState(new Set());
  const [errors, setErrors] = useState({})
  const allPosts = useSelector(state => state.post.post);
  const posts = allPosts?.map(el => {
    const filteredLikes = el.likes?.filter(ell => ell.user_id === userId);
    if(filteredLikes?.length > 0){
        return {...el, likes: filteredLikes}
    }
    return null;
  }).filter(post => post !== null)
// console.log('post', posts)
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
  }, [dispatch, isloaded, userId]);

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
  // const handleSubmit = async (e, post_id) => {
  //   e.preventDefault();
  //   const response = await dispatch(thunkAddComments({
  //     post_id,
  //     text
  //   }));
  //   if (response.errors) {
  //     setErrors(response)
  //   } else {
  //     // navigate('/')
  //     setText('')
  //     setIsloaded(!isloaded)
  //   }
  // }
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
          {/* <h4>For you</h4> */}
          {/* <a href="#">Following</a> */}
          {/* <a href="#">Your tags</a> */}
        </nav>
        <div className="search-bar">
          {/* <input type="text" placeholder="Search..." /> */}
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
              <li><NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Follows</NavLink></li>
              {/* <li><a href="#">Activity</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li> */}
            </ul>
            <div className='create-blog-button'><CreateBlogButton /></div>
          </div>
        </aside>

        <section className="feed">
          {posts?.map(post => {
            // Determine if the current post is liked, post's author is followed
            const isLiked = likedPosts.has(post.id);
            const isFollowed = followStatus.has(post.user_id);

            return (
              <article className="post" key={post.id}>
                {!post?.root_post ? (
                  <>
                    <div className="post-header">
                      <img style={{ width: '50px' }} src={post.user?.profileImage ? post.user.profileImage : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1724973068/capstone/download_n3qjos.png'} />
                      <div>
                        <div className='post-author-follow-button'>
                          <h3>{post.user?.username}{' '}</h3>
                          {post.user_id !== userId && <button className='follow-button' onClick={() => handleFollow(post.user_id)}>{isFollowed ? 'Following' : 'Follow'}</button>}
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
                    {
                      post.user_id === userId && <div style={{display:'flex', justifyContent:'flex-end', gap:'15px'}}>
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
                                value={text[post.id]||''}
                                onChange={e => handleTextChange(e, post.id)}
                                placeholder={`Comment as @${user}`}
                                required
                              />
                            </label>
                            {errors[post.id]?.text && <p style={{ color: 'red' }}>{errors[post.id].text}</p>} {' '}
                            <button type="submit">send</button>
                          </form>
                          <br></br>
                          {post.comments?.map(comment => (
                            <div className='comment-details-container' key={comment.id}>
                              <span style={{ fontSize: 'small' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap:'10px' }}>
                              <div key={comment.id}>{comment.text}</div>
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
                          {/* <FaRegShareSquare className='react-icon' title='Reblog' onClick={() => handleReblog(post.id)} /> */}
                          {/* {post.user_id !== userId &&    */}
                          <span
                            style={{ cursor: 'pointer' }}
                            className="like-button"
                            onClick={() => toggleLike(post.id)}
                          >
                            {isLiked ? (
                              // <FaHeart style={{ color: 'red' }} />
                              <BiSolidLike className='react-icon' title='Unlike' style={{ color: 'red' }}/>
                            ) : (
                              // <FaRegHeart />
                              <BiLike className='react-icon' title='Like' />
                            )}
                          </span>
                          {/* // } */}


                        </div>
                      </span>
                    </div>
                  </>) :



                  <>
                    <div className="post-header">
                      <img style={{ width: '50px' }} src={post.user?.profileImage} />
                      <div>
                        <div className='post-author-follow-button'>
                          {/* <h3>{post.user?.username}{' '}Reblogged</h3> */}
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
                            post.user_id === userId && <div style={{display:'flex', justifyContent:'flex-end', gap:'15px'}}>
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
                          {post.root_post.comments ? post.root_post.comments?.length : 0} comments
                        </h4>
                        <br></br>
                        <ul className='comment-container hidden' data-comment-count={post.root_post.comments?.length}>
                          <form onSubmit={(e) => handleSubmit(e, post.root_post.id)}>
                            <label>
                            <input
                                type='text'
                                value={text[post.root_post.id]||''}
                                onChange={e => handleTextChange(e, post.root_post.id)}
                                placeholder={`Comment as @${user}`}
                                required
                              />
                            </label>
                            {errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.text}</p>} {' '}
                            <button type="submit">send</button>
                          </form>
                          <br></br>
                          {post.root_post.comments?.map(comment => (
                            <div className='comment-details-container' key={comment.id}>
                              <span style={{ fontSize: 'small' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap:'10px' }}>
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
                          {/* <FaRegShareSquare className='react-icon' title='Reblog' onClick={() => handleReblog(post.id)} /> */}
                          <span
                            style={{ cursor: 'pointer' }}
                            className="like-button"
                            onClick={() => toggleLike(post.id)}
                          >
                            {isLiked ? (
                              // <FaHeart style={{ color: 'red' }} />
                              <BiSolidLike title='Unlike' style={{ color: 'red', fontSize: '20px' }} />
                            ) : (
                              // <FaRegHeart />
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
          {/* <h3>Suggested Blogs</h3> */}
          <ul>
            {/* <li><a href="#">Blog 1</a></li>
            <li><a href="#">Blog 2</a></li>
            <li><a href="#">Blog 3</a></li>
            <li><a href="#">Blog 4</a></li> */}
          </ul>
        </aside>
      </div>
    </div>
  );
}
