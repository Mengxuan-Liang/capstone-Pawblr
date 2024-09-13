import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_SERVER_URL = "http://localhost:8000";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const currentUser = useSelector(state => state.session.user.username);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for 'chat_message' events from the server
    newSocket.on('chat_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      // Emit a 'message' event with message and username
      socket.emit('message', { message, username: currentUser });
      setMessage('');
    }
  };

  return (
    <div style={{margin:"10px"}}>
      <h1 style={{color:'white'}}>Welcome to Pawblr Chat</h1>
      <br></br>
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
              {msg.username} : {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
