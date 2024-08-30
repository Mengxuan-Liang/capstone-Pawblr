import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeletePost, thunkGetPosts } from '../../redux/postReducer';
import { NavLink, useNavigate } from 'react-router-dom';
import CreateBlogButton from '../CreateBlog/CreateBlogButton';
import UpdateBlogButton from '../UpdataBlog/UpdateBlogButton';
import { thunkGetComments, thunkAddComments, thunkDeleteComment } from '../../redux/commentReducer';
import '../HomePage/HomePage';
import ProfileButton from '../Navigation/ProfileButton';
import { FaRegComment } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";

export default function Follow() {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFollowing() {
            try {
                const response = await fetch('/api/follow/status');

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFollowing(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFollowing();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (following.follows.length === 0 ) return <h2>You are not following anyone at the moment.</h2>;

    return (
        <div>
            {following?.follows?
                <>
                    <h2>Users You Follow</h2>
                    <ul>
                        {following?.follows?.map(user => (
                            <li key={user.id}>
                                <img src={user.profileImage} alt={user.username} style={{ width: '50px', borderRadius: '50%' }} />
                                <p>{user.username}</p>
                            </li>
                        ))}
                    </ul>
                </> : <h2>You are not following any user</h2>}
        </div>
    );
}
