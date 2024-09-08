import { NavLink, useNavigate } from "react-router-dom"
import './NavBar.css'



export default function NavBar() {
    const navigate = useNavigate()
    return (
        <div id="nav-container">
            <div className="logo-container-header">
                <img src='logo2.png' style={{ width: '6%' }} onClick={()=>navigate('/home')}/>
                <img src='logo4.png' style={{ width: '20%' }} />
            </div>
            <nav className="navigation" style={{ color: "rgba(254, 212, 4, 255)" }}>
                {/* <NavLink to={'/home'}  className={({ isActive }) => (isActive ? "active-tab" : "")}>For you</NavLink> */}
                <NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink>
                {/* <NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Your tags</NavLink> */}
            </nav>

        </div>
    )
}