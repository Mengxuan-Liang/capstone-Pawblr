import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/HomePage/HomePage'
import NavBar from './NavSideBar/NavBar';
import './ChatMessage.css'
import UserProfileModal from './Profile/UserProfileModal';

const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'https://capstone-dumblr.onrender.com'
  : process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:8000';


const PrivateChatComponent = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const location = useLocation();
    const { clickedUser } = location.state || {};
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(conversations || []);
    const [socket, setSocket] = useState(null);
    const currentUser = useSelector((state) => state.session.user?.username);
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);

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
        // console.log("Joining room:", chatRoom);
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
    // console.log('messages', messages)
    //Sort matchedDm based on time
    const [sortedDm, setSortedDm] = useState([]);
    useEffect(() => {
        // Sort the matchedDm array based on the time property
        const sortedArray = [...matchedDm].sort((a, b) => new Date(a.time) - new Date(b.time));
        setSortedDm(sortedArray);
    }, [matchedDm]);
    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users/');
            const data = await response.json();
            setUsers(data.users);  // Assuming data.users is the list of users
        };
        fetchUsers();
    }, []);
    // Get the profile image URL for each sender
    const getProfileImage = (username) => {
        const user = users.find(user => user.username === username);
        return user ? user.profileImage : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1725296015/capstone/Blue_Dog_Coalition_dgsbdq.webp';
    };
    // Clickable user image to profile modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleUserClick = (username) => {
        const user = users.find(user => user.username === username);
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
                <h1>Chat with {clickedUser?.username}</h1>
                <input
                    className="fancy-input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                {' '}
                <button className='fancy-button' onClick={sendMessage}>Send</button>{' '}
                <button onClick={() => navigate('/')} className="fancy-button">
                    Leave
                </button>
                <hr></hr>
                <div>
                    <h3>Messages:</h3>
                    <ul>
                        {sortedDm.map((msg, index) => (
                            <div className='message-item'>
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
                                <li key={index}>
                                    {msg.sender}: {msg.content}
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export { PrivateChatComponent }
