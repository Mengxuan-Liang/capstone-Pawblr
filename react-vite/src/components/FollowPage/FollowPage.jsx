import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../HomePage/HomePage';
import NavBar from '../NavSideBar/NavBar';
import SideBar from '../NavSideBar/SideBar';
import RightColumn from '../RightColumn/RightColumn';
import UserProfileModal from '../Profile/UserProfileModal';

export default function Follow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.session.user);
  const userId = userInfo?.id;
  const [followStatus, setFollowStatus] = useState(new Set());
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
  // Clickable user image & username
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  return (
    <div className='page-container'>
      <header className="header">
        <NavBar />
      </header>

      <div className="main-content">
        <aside className="sidebar">
          {/* <div className="fixed-menu"> */}
          <SideBar />
          {/* </div> */}
        </aside>

        <section className="feed">
          <div>
            {following?.length > 0 ? (
              <article className='post'>
                {isModalOpen && selectedUser && (
                  <UserProfileModal user={selectedUser} onClose={closeModal} />
                )}
                <h2>Users You Follow</h2>
                <ul>
                  {following.map(user => {
                    const isFollowed = followStatus.has(user.id);
                    return (
                      <li key={user.id} className='following-page-user-container post-header' style={{display:'flex',justifyContent:'center'}}>
                        <img onClick={() => handleUserClick(user)} src={user.profileImage} alt={user.username}  />
                        <p onClick={() => handleUserClick(user)} style={{color: 'black'}}>{user.username}</p>
                        <button style={{ position: 'relative', backgroundColor: 'rgba(254, 212, 4, 255)', marginLeft: '0px' }} className='follow-button' onClick={() => handleFollow(user.id)}>
                          {isFollowed ? 'Following' : 'Follow'}
                        </button>
                        <br></br>
                        <br></br>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ) : (
              <article className='post'>You have not followed any users yet</article>
            )}
          </div>
        </section>

        <aside className="right-column">
          <RightColumn />
        </aside>
      </div>
      <footer className="sign-in-footer" >
        <span className='footer-about-button' onClick={() => navigate('/about')}>About</span>{' '}
        <span>Terms</span>{' '}
        <span>Privacy</span>{' '}
        <span>Support</span>{' '}
      </footer>
    </div>
  );
}
