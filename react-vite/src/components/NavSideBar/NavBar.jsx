import { NavLink } from "react-router-dom"
// import '../HomePage/HomePage.css'
import './NavBar.css'


export default function NavBar() {
    return (
        <>
            <img src='logo.png' style={{ width: '2.5%' }} />
            <nav className="navigation" style={{ color: "rgba(254, 212, 4, 255)" }}>
                {/* <NavLink to={'/home'}  className={({ isActive }) => (isActive ? "active-tab" : "")}>For you</NavLink> */}
                <NavLink to={'/follow'}  className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink>
                <NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Your tags</NavLink>
            </nav>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
        </>
    )
}