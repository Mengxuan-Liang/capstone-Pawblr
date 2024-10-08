import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts, thunkDeletePost } from '../../redux/postReducer';
import { useNavigate } from 'react-router-dom';
// import CreateBlogButton from '../CreateBlog/CreateBlogButton';
// import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkAddComments, thunkDeleteComment, thunkGetComments } from '../../redux/commentReducer';
import '../HomePage/HomePage.css';
// import ProfileButton from '../Navigation/ProfileButton';
import { FaRegComment } from "react-icons/fa";
// import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
// import NavBar from '../NavSideBar/NavBar';
// import SideBar from '../NavSideBar/SideBar';
import { FaRegShareSquare } from "react-icons/fa";






export default function CommentSection({post}){
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const userInfo = useSelector(state => state.session.user)
    const posts = useSelector(state => state.post.post);
  
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
  
    // New state for the confirmation modal
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
        setModalData({ id, type: 'post' }); 
      };
      const isLiked = likedPosts.has(post.id);
      const isFollowed = followStatus.has(post.user_id);
    return (
        <>
        <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message="Confirm Deletion"
      />
      
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
                            <button onClick={(e) => setText('')}>Clear</button>{' '}
                            <button onClick={() => toggleComments(post.id)}>Close</button>{' '}
                            <button type="submit">Send</button>
                          </form>
                          <br></br>
                          {post.comments?.map(comment => (
                            <div className='comment-details-container' key={comment.id}>
                              <span style={{ fontSize: 'small' }}>{comment.user?.username}</span>{' '}<span style={{ fontSize: 'small' }}>{comment.created_at}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
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
                          <FaRegShareSquare className='react-icon' title='Reblog' onClick={() => handleReblog(post.id)} />
                          {/* {post.user_id !== userId &&    */}
                          <span
                            style={{ cursor: 'pointer' }}
                            className="like-button"
                            onClick={() => toggleLike(post.id)}
                          >
                            {isLiked ? (
                              <BiSolidLike className='react-icon' title='Unlike' style={{ color: 'red' }} />
                            ) : (
                              <BiLike className='react-icon' title='Like' />
                            )}
                          </span>
                          {/* }  */}


                        </div>
                      </span>
                    </div>
        </>
    )
}