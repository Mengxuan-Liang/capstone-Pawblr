import { useSelector } from 'react-redux';
import Feed from '../HomePage/Feed';
import './UserProfileModal.css'
import FeedMid from '../HomePage/FeedMid';

export default function UserProfileModal({ user, onClose }) {
    const allPostsArr = useSelector(state => state.post?.post);

    const postsByUser = allPostsArr.filter(post => post.user_id === user.id)
    return (
        <div className="modal-background">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">X</button>
                <h2>@ {user.username}</h2>
                <p>Email: {user.email}</p>
               <FeedMid posts={postsByUser} />
            </div>
        </div>
    );
}