import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { Link, NavLink, Form, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkGetComments, thunkAddComments, thunkDeleteComment } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import { createImage } from '../../redux/imageReducer';


export default function Blog() {
  const dispatch = useDispatch();
  // const username = useSelector(state => state.session.user.username)
  // const userId = useSelector(state => state.session.user.id)
  const userInfo = useSelector(state => state.session.user)
  const user = userInfo?.username;
  const userId = userInfo.id;
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
  }, [dispatch, isloaded]);

  const posts = useSelector(state => state.post.post?.filter(el => el.user_id == userId));
  // const posts = useSelector(state => state.post.post);
  // console.log('shake post', posts)



  const handleDeletePost = async (id) => {
    await dispatch(thunkDeletePost(id))
  }
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
      setIsloaded(!isloaded)
    }
  }

  const handleDelete = async (id) => {
    const res = await dispatch(thunkDeleteComment(id))
    if (res.errors) {
      setErrors(res.errors)
    } else {
      setIsloaded(!isloaded)
    }
    // console.log('delete error',errors)
  }


  const toggleComments = (event) => {
    const commentsSection = event.target.closest('.comments-section');
    const commentContainer = commentsSection.querySelector('.comment-container');
    const notesHeader = commentsSection.querySelector('.clickable-h4');

    if (!commentContainer || !notesHeader) return;

    const isHidden = commentContainer.classList.toggle('hidden');
    const commentCount = commentContainer.dataset.commentCount || '0';

    notesHeader.textContent = isHidden
      ? `${commentCount} notes`
      : 'close notes';
  };
  // --------------aws
  const navigate = useNavigate() // so that you can redirect after the image upload is successful
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  // const images = useSelector(state=> state.image?.img[0])


  const handleSubmitImg = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    console.log('FORMDATA',image)
    console.log('FORMDATA',formData)

    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setImageLoading(true);
    await dispatch(createImage(formData));
    navigate("/blog");
  }

const imageUrl = useSelector(state=> state.image?.img?.image?.image)


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



      <form
        onSubmit={handleSubmitImg}
        encType="multipart/form-data"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Submit</button>
        {(imageLoading) && <img style={{width:'10%'}}src={imageUrl}></img>}
      </form>
      




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
          {posts?.map(post => {

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
                <span className="comments-section">
                  <h4 className='clickable-h4' onClick={toggleComments}>
                    {post.comments ? post.comments?.length : 0} notes
                  </h4>
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

                    {post.comments?.map(comment => (
                      <div className='comment-details-container' key={comment.id}>
                        <span>{comment.user?.username}</span>{' '}<span>{comment.created_at}</span>
                        <div key={comment.id}>{comment.text}</div>
                        <button >reply</button>
                        {
                          userId === comment.user_id && <button onClick={() => handleDelete(comment.id)}>delete</button>
                        }
                      </div>
                    ))}
                  </ul>

                </span>

                <div className="comments-row-container">

                  <div className="reply-like-container">
                    <span>reply</span>
                    <span>like</span>
                    {
                      post.user_id === userId && <>
                        <span><UpdateBlogButton el={post} /></span>
                        <span><button onClick={() => handleDeletePost(post.id)}>delete</button></span>
                      </>
                    }

                  </div>
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