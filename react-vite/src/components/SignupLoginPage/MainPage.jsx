import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
// import CreateBlogButton from '../CreateBlog/CreateBlogButton';
// import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
// import { thunkAddComments, thunkDeleteComment, thunkGetComments } from '../../redux/commentReducer';
import '../HomePage/HomePage.css'
// import SignupFormModal from '../SignupFormModal/SignupFormModal';
import ModelButton from './ModelButton';
// import LoginFormModal from '../LoginFormModal/LoginFormModal';
// import ProfileButton from '../Navigation/ProfileButton';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

export default function MainPage() {
    const dispatch = useDispatch();
   
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);
  
    const [isloaded, setIsloaded] = useState(false)
 
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(thunkGetPosts());
        };
        fetchData();
    }, [dispatch, isloaded]);

    const posts = useSelector(state => state.post.post);

    return (
        <div className='wrapper'>
            <header className="header">
                <div className="logo">Dumblr</div>
                <nav className="navigation">
                    <a href="#">Trending</a>
                    <a href="#">Staff Picks</a>
                </nav>
                <div className="search-bar">
                    <input type="text" placeholder="Search Tumblr" />
                </div>
            </header>

            <div className="main-content">
                <aside className="sidebar">
                    <div className="fixed-menu">
                        <ul>
                            <li><NavLink to={'/'}>Explore</NavLink></li>
                            <li><NavLink to={'/blog'}>Change palette</NavLink></li>

                        </ul>
                        <div className='model-button-sidebar'>
                        <ModelButton/>
                        </div>
                    </div>
                </aside>

                <section className="feed">
                    {posts?.map(post => {

                        return (
                            <article className="post" key={post.id}>
                                <div className="post-header">
                                <img style={{width:'50px'}}src={post.user?.profileImage}/>
                  <div>
                  <h3>{post.user?.username}{' '}</h3>
                  <span>{post.created_at}</span>

                  </div>
                                </div>
                                <div className="post-content">
                                {post?.img && <img src={post.img} alt="Post" style={{width:'40%'}}/> }
                                    <p style={{ marginTop: '20px' }}>{post.text}</p>
                                    <br />
                                    {post.labels?.map(label => (
                                        <span key={label.id} style={{ color: 'gray' }}>
                                            #{label.name} {' '}
                                        </span>
                                    ))}
                                </div>
                                <br />
                                {/* <hr style={{ color: 'grey' }} />
                                <div className='comment-like-reply-container'>
                                    <span className="comments-section">
                                        <h4 className='clickable-h4' onClick={() => handleClick()}>
                                            {post.comments ? post.comments?.length : 0} notes
                                        </h4>
                                    </span>
                                    <div className="reply-like-container">
                                        <span>reply</span>
                                        <span>like</span>
                                    </div>
                                </div> */}

                            </article>
                        );
                    })}
                </section>

                <aside className="right-column">
                    <h3>Trending Blogs</h3>
                    <ul>
                       {
                        posts?.map(el => {
                            return (
                            <div key={el.id}>
                                <span>{el.user.username}</span> {' '}
                                <NavLink>Follow</NavLink>
                            </div>

                            )
                        })
                       }
                    </ul>
                </aside>
            </div>
            <footer className="sticky-footer">
                <p>Join over 100 million dogs using Tumblr to find their communities and make friends.</p>
              {/* <button onClick={()=>handleClick()}>Sign up</button>
              {isModalOpen && <ModelButton />} */}
              <ModelButton/>
            </footer>
        </div>
    );
}
