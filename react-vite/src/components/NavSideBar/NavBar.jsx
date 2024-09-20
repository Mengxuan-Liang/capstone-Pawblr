import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // 需要安装 react-icons
import './NavBar.css';

export default function NavBar() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light-theme');

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme');
    };

    return (
        <div id="nav-container">
            <div className="logo-container-header">
                <img src='logo2.png' style={{ width: '6%' }} onClick={() => navigate('/home')} />
                <img src='logo4.png' style={{ width: '20%' }} onClick={() => navigate('/home')} />
            </div>
            <nav className="navigation" style={{ color: "rgba(254, 212, 4, 255)" }}>
                <NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light-theme' ? <FaMoon /> : <FaSun />}
            </button>
        </div>
    );
}
