import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModelButton from './ModelButton';
import '../../../public/logo.png'
import '../../../public/anidog.gif'
import './MainPage.css'
import '../../../public/walkingdog.gif'

export default function MainPage() {
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0); // 当前图片索引
    const images = ['https://res.cloudinary.com/dhukvbcqm/image/upload/v1727221049/capstone/Screenshot_2024-09-24_at_12.50.34_PM-removebg-preview_yepkah.png', 
        'https://res.cloudinary.com/dhukvbcqm/image/upload/v1727221048/capstone/Screenshot_2024-09-24_at_7.36.34_PM-removebg-preview_qpe5r9.png', 
        'https://res.cloudinary.com/dhukvbcqm/image/upload/v1727221048/capstone/pixlr-image-generator-54001c61-0555-44cc-bb5b-45395f9a76af-removebg-preview_d0hxoc.png', 
        'https://res.cloudinary.com/dhukvbcqm/image/upload/v1727221044/capstone/openart-image_KOQC7J4h_1727220658113_raw-removebg-preview_tixfyc.png',
        'https://res.cloudinary.com/dhukvbcqm/image/upload/v1727221044/capstone/openart-image_bI1zzjvi_1727220559715_raw-removebg-preview_g24ley.png'
    ]; // 图片数组
    const imageRef = useRef(null); // 用于滑动图片

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="wrapper">
            <header className="header">
                <img src='logo2.png' style={{ width: '3.5%' }} />
                <img src='logo4.png' style={{ width: '10%' }} />
                {/* <h3>Join the Pack or Paw In!</h3> */}
                <div className="running-dog-container">
                    {/* <img src="anidog.gif" alt="Running Dog" className="running-dog" /> */}
                    <ModelButton />
                </div>
            </header>
            <h1 style={{fontSize:"70px", color:'rgba(250, 241, 226, 255)'}}>Choose your companion</h1>
            <div className="carousel-container">
                <button className="arrow left-arrow" onClick={handlePrev}>←</button>
                <div className="image-slider" ref={imageRef}>
                    {images.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Slide ${index}`}
                            className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <button className="arrow right-arrow" onClick={handleNext}>→</button>
            </div>
{/* <img src='https://res.cloudinary.com/dhukvbcqm/image/upload/v1727208185/capstone/57943587a9df0a2928bf78d4a968c434dcafd1675c7c2-YC4ou8_fw658_qyl507.webp'/> */}
            <footer className="sign-in-footer">
                <span className='footer-about-button' onClick={() => navigate('/about')}>About</span>{' '}
                <span>Terms</span>{' '}
                <span>Privacy</span>{' '}
                <span>Support</span>{' '}
            </footer>
        </div>
    );
}
