import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/HomePage/HomePage'

const SOCKET_SERVER_URL = "http://localhost:8000";

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

    const newSocket = io(SOCKET_SERVER_URL);
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
    navigate('/dm', { state: { clickedUser: { username: sender }} });
  };

  // Get the profile image URL for each sender
  const getProfileImage = (username) => {
    const user = users.find(user => user.username === username);
    return user ? user.profileImage : 'default-profile-image-url';  // Replace with default image URL if not found
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

  return (
    <div className='message'>
      <h2>Messages</h2>
      {latestMessages.length > 0 ? (
        latestMessages.map((msg, index) => (
          <div key={index} className="message-item">
            <img
            style={{width:'5%'}}
              src={getProfileImage(msg.sender)}
              alt={`${msg.sender}'s profile`}
              className="profile-image"
            />
            <strong>{msg.sender}:</strong> {msg.content}
            <button onClick={() => handleReplyClick(msg, msg.sender)}>Reply</button>
          </div>
        ))
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

const PrivateChatComponent = () => {
  const [conversations, setConversations] = useState([]);
  const location = useLocation();
  const { clickedUser } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(conversations || []);
  const [socket, setSocket] = useState(null);
  const currentUser = useSelector((state) => state.session.user?.username);
  const [room, setRoom] = useState('');

  // Fetch existing messages on component mount
  useEffect(() => {
    if (currentUser) {
         fetch(`/api/messages/${currentUser}`)
        .then((response) => response.json())
        .then((data) => {
          setConversations(data.messages);
          setMessages(data.messages);
        });
    }
  }, [currentUser]);

  // Establish socket connection and join room when a conversation starts
  useEffect(() => {
    if (!clickedUser || !currentUser) return;

    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);

    const chatRoom = `${currentUser}-${clickedUser.username}`;
    setRoom(chatRoom);

    // Join the private room
    newSocket.emit('join_private_room', { room: chatRoom });

    // Listen for incoming private messages and update state for real-time re-render
    newSocket.on('private_message', (data) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup the socket connection when component unmounts
    return () => {
      newSocket.emit('leave_private_room', { room: chatRoom });
      newSocket.disconnect();
    };
  }, [clickedUser, currentUser]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const newMessage = {
        sender: currentUser,
        content: message,
        room: room
      };

      // Emit the message to the server
      socket.emit('private_message', {
        recipient_room: room,
        message: message,
        username: currentUser,
        recipient: clickedUser.username,
      });

      // Update the sender's UI immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Clear the input field after sending
    }
  };

  // Filter messages for the current chat room
  const matchedDm = messages.filter(
    (el) => el.sender === clickedUser.username || (el.sender === currentUser && el.room === room)
  );
console.log('messages', messages)
  return (
    <div className='message'>
      <h1>Chat with {clickedUser?.username}</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h3>Messages:</h3>
        <ul>
          {matchedDm.map((msg, index) => (
            <li key={index}>
              {msg.sender}: {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { MessageComponent, PrivateChatComponent };
