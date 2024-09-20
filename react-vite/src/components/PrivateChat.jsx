import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/HomePage/HomePage'
import NavBar from './NavSideBar/NavBar';

const SOCKET_SERVER_URL = "http://localhost:8000";

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
        // Sort the usernames alphabetically to ensure both users join the same room
        const chatRoom = [currentUser, clickedUser.username].sort().join('-');
        console.log("Joining room:", chatRoom);
        setRoom(chatRoom);
        // Join the private room
        newSocket.emit('join_private_room', { room: chatRoom });
        // Listen for incoming private messages and update state for real-time re-render
        newSocket.on('private_message', (data) => {
            // console.log('^^^^^^^^^^^^^^^^^^^^^^Received message:', data);
            const newMessage = {
                sender: data.username,
                content: data.message,
                room: data.recipient_room
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        <>
            <NavBar />
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
        </>
    );
};

export { PrivateChatComponent }
