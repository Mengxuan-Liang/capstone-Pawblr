import { useLocation } from "react-router-dom";

export default function Profile(){
    const location = useLocation()
    const { user} = location.state || {}
    return <h2>{user.username}</h2>
}