import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const SOCKET_SERVER_URL = "http://localhost:8000";

const Message = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { state } = useLocation();
  const recipient = state.clickedUser;  // Get the recipient user info
  const currentUser = useSelector(state => state.session.user.username);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join a room specific to the chat between the current user and the recipient
    newSocket.emit('join_room', { room: `${currentUser}_${recipient}` });

    // Listen for 'private_message' events from the server
    newSocket.on('private_message', (data) => {
        console.log('!!!!!Received message data:', data);
      // Ensure data is correctly formatted before updating state
      if (data && data.username && data.message) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      newSocket.emit('leave_room', { room: `${currentUser}_${recipient}` });
      newSocket.disconnect();
    };
  }, [currentUser, recipient]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      // Emit a 'private_message' event with message and recipient
      socket.emit('private_message', { 
        recipient_room: `${currentUser}_${recipient}`, 
        message, 
        username: currentUser 
      });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Private Chat with {recipient}</h2>
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
          {messages.map((msg, index) => (
            <li key={index} style={{ color: 'white' }}>
              {msg.username ? `${msg.username}: ` : ''}{msg.message ? msg.message : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Message;
