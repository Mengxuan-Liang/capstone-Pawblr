import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModelButton from './ModelButton';
import '../../../public/logo.png'
import '../../../public/anidog.gif'
import './MainPage.css'
import '../HomePage/HomePage.jsx'
import '../../../public/walkingdog.gif'
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
                <img src='logo2.png' style={{ width: '3.5%' }} />
                <img src='logo4.png' style={{ width: '10%' }} />
                <h3>Join the Pack or Paw In!</h3>
                <div className="running-dog-container">
                    <img src="anidog.gif" alt="Running Dog" className="running-dog" />
                <ModelButton />
                </div>
            </header>
            <img src='walkingdog.gif' className='walking-dog'></img>
            <footer className="sign-in-footer">
                <span className='footer-about-button' onClick={() => navigate('/about')}>About</span>{' '}
                <span>Terms</span>{' '}
                <span>Privacy</span>{' '}
                <span>Support</span>{' '}
            </footer>
        </div>
    );
}
