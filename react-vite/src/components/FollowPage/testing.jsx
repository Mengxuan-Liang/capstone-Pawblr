import { useState, useEffect } from 'react';


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
