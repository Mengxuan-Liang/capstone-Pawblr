import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import ModelButton from './ModelButton';
import '../../../public/logo.png'
import '../../../public/anidog.gif'
import './MainPage.css'
import '../HomePage/HomePage.jsx'
// import '../HomePage/HomePage.css'


export default function MainPage() {
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return (
        <div className='wrapper'>
            <header className="header">
                <img src='logo.png' style={{ width: '3.4%' }} />
                <h3>Join the Pack or Paw In!</h3>
                <div className="running-dog-container">
                    <img src="anidog.gif" alt="Running Dog" className="running-dog" />
                <ModelButton />
                </div>
            </header>

            <footer className="sign-in-footer">
                <span>Terms</span>{' '}
                <span>Privacy</span>{' '}
                <span>Support</span>{' '}
                <span>About</span>{' '}
            </footer>
        </div>
    );
}
