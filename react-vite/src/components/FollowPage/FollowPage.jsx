import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import { thunkGetComments } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import ProfileButton from '../Navigation/ProfileButton';

export default function Follow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.session.user);
  const userId = userInfo?.id;
  const [isloaded, setIsloaded] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [followStatus, setFollowStatus] = useState(new Set());
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/follow/status`);
        const data = await response.json();
        const followedUsers = new Set(data?.follows?.map(follow => follow.id));
        setFollowStatus(followedUsers);
        setFollowing(data?.follows || []); // Save followed users to display in the UI
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, userId]);

  // Follow/Unfollow Toggle
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <header className="header">
        <div className="logo">Dumblr</div>
        <nav className="navigation"></nav>
        <div className="search-bar"></div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="fixed-menu">
            <div className='profile-button'>
              <ProfileButton />
            </div>
            <ul>
              <li><NavLink to={'/home'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Home</NavLink></li>
              <li><NavLink to={'/blog'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Blogs</NavLink></li>
              <li><NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Comments</NavLink></li>
              <li><NavLink to={'/like'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Likes</NavLink></li>
              <li><NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink></li>
            </ul>
            <div className='create-blog-button'><CreateBlogButton /></div>
          </div>
        </aside>

        <section className="feed">
          <div>
            {following?.length > 0 ? (
              <>
                <h2>Users You Follow</h2>
                <ul>
                  {following.map(user => {
                    const isFollowed = followStatus.has(user.id);

                    return (
                      <li key={user.id}>
                        <img src={user.profileImage} alt={user.username} style={{ width: '50px', borderRadius: '50%' }} />
                        <p>{user.username}</p>
                        <button style={{zIndex:"1",position:'relative'}}className='follow-button' onClick={() => handleFollow(user.id)}>
                          {isFollowed ? 'Following' : 'Follow'}
                        </button>
                        <br></br>
                        <br></br>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <h2>You haven't followed any users yet</h2>
            )}
          </div>
        </section>

        <aside className="right-column">
          <ul></ul>
        </aside>
      </div>
    </div>
  );
}
