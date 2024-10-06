import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { thunkGetTags } from "../../redux/tagReducer";
import './RightColumn.css'
import UserProfileModal from "../Profile/UserProfileModal";
import ChatWithAI from "../ChatWithAI";

export default function RightColumn() {

    const [search, setSearch] = useState('')
    // console.log('search', search)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const func = async () => await dispatch(thunkGetTags())
        func()
    }, [dispatch])
    const allTags = useSelector(state => state.tag.tag)
    // console.log('all tags', allTags)
    const matchedTags = allTags?.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
    // console.log('matched tags', matchedTags)

    // MATCHED USER
    const [users, setUsers] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/users/')
            const resData = await res.json()
            setUsers(resData)
            console.log('res all users', resData)
        }
        fetchData()
    }, [])
    const allUsers = users?.users;
    const matchedUsers = allUsers?.filter(user => user.username.toLowerCase().includes(search.toLowerCase()))

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user) => {
        setSelectedUser(user); // Set the selected user
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Close the modal
        setSelectedUser(null);  // Reset the selected user
    };

    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);  // Set focus state to true
    };

    const handleBlur = () => {
        setIsFocused(false); // Set focus state to false
        setSearch('');       // Clear the search input on blur
    };
    return (
        <div className="search-bar">
            <img src='https://res.cloudinary.com/dhukvbcqm/image/upload/v1728150847/Screenshot_2024-10-05_at_1.50.25_PM-modified_lnu1zf.png'  className='logo-right-col' style={{ width: '40%' }} onClick={()=>navigate('/home')} />
            {isModalOpen && selectedUser && (
                <UserProfileModal user={selectedUser} onClose={closeModal} />
            )}
            <div className="search-input">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text" placeholder="Search Pawblr" />
            </div>
            <div className="search-posts-container">
                {/* <div>TAGS</div> */}
                {search && matchedTags?.map(tag => (
                    <div key={tag.id}>
                        <div onClick={() => {
                            navigate('/tagged', { state: { tag } });
                            setSearch('')
                        }
                        }># {tag.name}</div>
                    </div>
                ))}
                <br></br>
                {/* <div>USERS</div> */}
                {search && matchedUsers?.map(user => (
                    <div key={user.id}>
                        <div onClick={() => {
                            handleUserClick(user);
                            setSearch('')
                        }
                        }
                        >@ {user.username}</div>
                    </div>
                ))}
            </div>
            {/* <div>
                <ChatWithAI onClick={()=> navigate('/chat')} />
            </div> */}
        </div>
    )
}