import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import ModelButton from './ModelButton';
import '../../../public/logo.png'
import '../../../public/anidog.gif'
import './MainPage.css'
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
                <div className="running-dog-container">
                    <img src="anidog.gif" alt="Running Dog" className="running-dog" />
                <ModelButton />
                </div>
                {/* <h3>Join over 100 million dogs using Dumblr to sniff out their pack and make new furry friends.</h3> */}
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
