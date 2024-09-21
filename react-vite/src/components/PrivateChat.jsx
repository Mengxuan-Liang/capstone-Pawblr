import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavSideBar/NavBar';
import './ChatMessage.css';
import UserProfileModal from './Profile/UserProfileModal';

const SOCKET_SERVER_URL = import.meta.env.MODE == 'production'
  ? 'https://capstone-dumblr.onrender.com'
  : 'http://localhost:8000';

const PrivateChatComponent = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const location = useLocation();
  const { clickedUser } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const currentUser = useSelector((state) => state.session.user?.username);
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [sortedDm, setSortedDm] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch existing messages on component mount
  useEffect(() => {
    if (currentUser) {
      fetch(`/api/messages/${currentUser}`)
        .then((response) => {
          // Check if the response is actually JSON
          if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json();
          } else {
            throw new Error('Expected JSON, but received HTML or another format');
          }
        })
        .then((data) => {
          setConversations(data.messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [currentUser]);

  // Establish socket connection and join room when a conversation starts
  useEffect(() => {
    if (!clickedUser || !currentUser) return;
    
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });
    setSocket(newSocket);
    const chatRoom = [currentUser, clickedUser.username].sort().join('-');
    setRoom(chatRoom);
    newSocket.emit('join_private_room', { room: chatRoom });

    newSocket.on('private_message', (data) => {
      const newMessage = {
        sender: data.username,
        content: data.message,
        room: data.recipient_room
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.emit('leave_private_room', { room: chatRoom });
      newSocket.disconnect();
    };
  }, [clickedUser, currentUser]); // Dependencies ensure this runs only when needed

  // Handle sending messages
  const sendMessage = () => {
    if (socket && message.trim()) {
      const newMessage = {
        sender: currentUser,
        content: message,
        room: room
      };
      socket.emit('private_message', {
        recipient_room: room,
        message: message,
        username: currentUser,
        recipient: clickedUser.username,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  // Filter messages for the current chat room and sort them
  useEffect(() => {
    const matchedDm = messages.filter(
      (el) => el.sender === clickedUser.username || (el.sender === currentUser && el.room === room)
    );
    const sortedArray = [...matchedDm].sort((a, b) => new Date(a.time) - new Date(b.time));
    setSortedDm(sortedArray);
  }, [messages, clickedUser, currentUser, room]); // Add all necessary dependencies

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users/');
      const data = await response.json();
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // Get profile image URL
  const getProfileImage = (username) => {
    const user = users?.find(user => user.username === username);
    return user ? user.profileImage : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1725296015/capstone/Blue_Dog_Coalition_dgsbdq.webp';
  };

  // Handle user click to open modal
  const handleUserClick = (username) => {
    const user = users?.find(user => user.username === username);
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
        <h1>Chat with {clickedUser?.username}</h1>
        <input
          className="fancy-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />{' '}
        <button className='fancy-button' onClick={sendMessage}>Send</button>{' '}
        <button onClick={() => navigate('/')} className="fancy-button">Leave</button>
        <hr />
        <div>
          <h3>Messages:</h3>
          <ul>
            {sortedDm.map((msg, index) => (
              <div className='message-item' key={msg.content + index}>
                {isModalOpen && selectedUser && <UserProfileModal user={selectedUser} onClose={closeModal} />}
                <img
                  onClick={() => handleUserClick(msg.sender)}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  src={getProfileImage(msg.sender)}
                  alt={`${msg.sender}'s profile`}
                  className="profile-image"
                />
                <li>{msg.sender}: {msg.content}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export { PrivateChatComponent };
