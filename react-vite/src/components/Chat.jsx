import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import NavBar from './NavSideBar/NavBar';

const SOCKET_SERVER_URL = "http://localhost:8000";

const ChatComponent = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    //Load messages from sessionStorage on page load
    //localStorage vs. sessionStorage: If you want the messages to persist only during the user's session (i.e., until the browser tab is closed), use sessionStorage instead of localStorage.
    //localStorage and sessionStorage are part of the Web Storage API provided by web browsers. This API allows websites to store data locally within the user's browser. 
    const storedMessages = sessionStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [socket, setSocket] = useState(null);

  const currentUser = useSelector(state => state?.session?.user?.username);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for 'chat_message' events from the server
    newSocket.on('chat_message', (data) => {
      console.log('Received message in chat room:', data);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        // Save messages in sessionStorage so they persist after refresh
        sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      newSocket.disconnect();
      // Optionally, clear sessionStorage on disconnection if needed
      // sessionStorage.removeItem('chatMessages');
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      // Emit a 'message' event with message and username
      socket.emit('message', { message, username: currentUser });
      setMessage('');
    }
  };
console.log('chat map', messages)
const chatMsg = messages?.filter(el => !el.room)
console.log('chatMas', chatMsg)
  return (
    <>
    <NavBar />
    <div style={{ margin: "10px" }}>
      <h1 style={{ color: 'white' }}>Hello {currentUser}</h1>
      <h2 style={{ color: 'white' }}>Welcome to Pawblr Chat Room</h2>
      <br></br>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      {' '}
      <button onClick={sendMessage}>Send</button> {' '}
      <button onClick={() => navigate('/')}>Leave</button>

      <div>
        <h3>Messages:</h3>
        <ul>
          {chatMsg.map((msg, index) => (
            <li key={index} style={{ color: 'white' }}>
              {msg.username} : {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default ChatComponent;
