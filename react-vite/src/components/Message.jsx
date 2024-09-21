import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/HomePage/HomePage'
import NavBar from './NavSideBar/NavBar';
import './ChatMessage.css'
import UserProfileModal from './Profile/UserProfileModal';

const SOCKET_SERVER_URL = import.meta.env.MODE == 'production'
  ? 'https://capstone-dumblr.onrender.com'
  :  'http://localhost:8000';


const MessageComponent = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state) => state.session.user?.username);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users/');
      const data = await response.json();
      setUsers(data.users);  // Assuming data.users is the list of users
    };
    fetchUsers();
  }, []);

  // Fetch existing messages
  useEffect(() => {
    if (currentUser) {
      fetch(`/api/messages/${currentUser}`)
        .then((response) => response.json())
        .then((data) => {
          setConversations(data.messages);
        });
    }
  }, [currentUser]);

  // Establish socket connection and listen for real-time messages
  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('private_message', (data) => {
      setConversations((prevConversations) => [...prevConversations, data]);  // Auto-update conversations
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Handle reply button click
  const handleReplyClick = (msg, sender) => {
    navigate('/dm', { state: { clickedUser: { username: sender } } });
  };
  // Get latest message per sender
  const latestMessagesBySender = conversations.reduce((acc, msg) => {
    if (msg.sender !== currentUser) {  // Exclude current user
      acc[msg.sender] = msg;  // Overwrite to keep only the latest message
    }
    return acc;
  }, {});

  // Convert object to array
  const latestMessages = Object.values(latestMessagesBySender);

  // Get the profile image URL for each sender
  const getProfileImage = (username) => {
    const user = users?.find(user => user.username === username);
    return user ? user.profileImage : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1725296015/capstone/Blue_Dog_Coalition_dgsbdq.webp';
  };
  // Clickable user image to profile modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleUserClick = (username) => {
    const user = users?.find(user => user.username === username);
    // console.log('user', user)
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <NavBar />
      <div className='message' style={{ margin: "10px" }}>
        <h1>Messages</h1>
        <hr></hr>
        {latestMessages.length > 0 ? (
          latestMessages.map((msg, index) => (
            <ul key={index} className="message-item">
              {isModalOpen && msg.sender && (
                <UserProfileModal user={selectedUser} onClose={closeModal} />
              )}
              <img
                onClick={() => handleUserClick(msg.sender)}
                style={{ 
                  width: '45px',  // Ensure the width is a fixed value
                  height: '45px',  // Ensure the height is equal to the width for a perfect circle
                  borderRadius: '50%',  // Set border-radius to 50% for round shape
                  objectFit: 'cover'  // Ensures the image doesn't get distorted
              }}
                src={getProfileImage(msg.sender)}
                alt={`${msg.sender}'s profile`}
                className="profile-image"
              />
              <li>{msg.sender}: {msg.content} </li>
              <button className='fancy-button' onClick={() => handleReplyClick(msg, msg.sender)}>Reply</button>
            </ul>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>
    </>
  );
};



export { MessageComponent };
