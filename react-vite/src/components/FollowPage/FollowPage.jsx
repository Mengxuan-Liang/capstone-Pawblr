import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import { thunkGetComments } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import ProfileButton from '../Navigation/ProfileButton';
import NavBar from '../NavSideBar/NavBar';
import SideBar from '../NavSideBar/SideBar';

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

  // Function to fetch follow data
  const fetchFollowData = async () => {
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

  useEffect(() => {
    fetchFollowData();
  }, [dispatch, userId]);

  // Follow/Unfollow Toggle
  const handleFollow = async (followeeId) => {
    try {
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
          const newSet = new Set(pre);
          newSet.delete(followeeId);
          return newSet;
        });
      } else {
        const res = await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followee_id: followeeId }),
        });
        if (!res.ok) {
          throw new Error('Failed to follow this user');
        }
        setFollowStatus(prev => new Set(prev).add(followeeId));
      }
      // Refetch follow data after action
      fetchFollowData();
    } catch (error) {
      console.error("Error handling follow action:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <header className="header">
        <NavBar/>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="fixed-menu">
            <SideBar/>
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
                        <button style={{zIndex:"1",position:'relative',backgroundColor:'rgba(254, 212, 4, 255)'}}className='follow-button' onClick={() => handleFollow(user.id)}>
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
      <footer className="sign-in-footer" >
        <span>Terms</span>{' '}
        <span>Privacy</span>{' '}
        <span>Support</span>{' '}
        <span>About</span>{' '}
      </footer>
    </div>
  );
}
