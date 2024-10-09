import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import './ChatWithAI.css'
import NavBar from "./NavSideBar/NavBar";
import { useSelector } from 'react-redux';
import { PiHandWavingFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProfileButton from "./Navigation/ProfileButton";


function ChatWithAI() {
  const navigate = useNavigate();
  const location = useLocation()
  const { currentIndex, curImg } = location.state || {};
  // console.log('current image', curImg)
  let temp;
  if (currentIndex == 0) {
    temp = 0.7
  } else if (currentIndex) {
    temp = currentIndex * 0.1
  } else {
    temp = 0.7
  }
  // console.log('current index', temp)
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(state => state.session?.user?.username)
  if(!currentUser){
    navigate('/')
  }
  // console.log('CURRENT USER', currentUser)

  const handleSubmit = async () => {
    if (!query) return;
    // console.log('query:', query)
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: query, temperature: temp }),
    });

    // console.log("Response status:", res.status); 
    const data = await res.json();
    // console.log("Response data:", data); 

    // Add both the query and response to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: "user", content: query },
      {
        type: "bot",
        content: data.choices
          ? data.choices[0].message.content
          : "No data received.",
      },
    ]);

    setQuery("");
    setLoading(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="ai-page-container">
      <header className="header" id='profile-button-top-right'>
        <div className="profile-button-container">
          <ProfileButton />
        </div>
      </header>
      <header className="header-ai">
        <img src='https://res.cloudinary.com/dhukvbcqm/image/upload/v1728150847/Screenshot_2024-10-05_at_1.50.25_PM-modified_lnu1zf.png' onClick={() => navigate('/home')} />
      </header>
      <span className="ai-comp-container">
        <button className="ai-comp-button" onClick={() => navigate('/companion')}>Choose your AI companion</button>
      </span>
      <div className="ai-container">
        <h2 onClick={toggleVisibility} style={{ cursor: "pointer" }}>
          <span>
            <FaWandMagicSparkles />
          </span>
          <span> Start to Chat</span>
        </h2>
        {isVisible && (
          <div className="ai-chat">
            <div style={{ position: 'relative', width: '20%' }}>
              <img
                src={curImg ? curImg : 'https://res.cloudinary.com/dhukvbcqm/image/upload/v1728150847/Screenshot_2024-10-05_at_1.50.25_PM-modified_lnu1zf.png'}
                alt="Second"
                style={{
                  width: '65%',
                  borderRadius: '50%',
                  position: 'absolute',
                  zIndex: 3,
                  left: '0px',
                  top: '0',
                }}
              />
            </div>
            <br></br>
            <br></br>
            <div style={{ color: 'grey', fontSize: 'xx-large' }}>Hi {currentUser} <PiHandWavingFill />
            </div>
            <div style={{ color: 'white', fontSize: 'xx-large' }}>How can we help?</div>
            <div className="chat-window">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${message.type === "user" ? "user-message" : "bot-message"
                    }`}
                >
                  <p>{message.content}</p>
                </div>
              ))}
              {loading && (
                <div className="chat-bubble bot-message">
                  <p>Loading...</p>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Chat with us'
              />
              <button onClick={handleSubmit}>
                {loading ? "Sending" : "Send"}
              </button>
            </div>
            <br></br>
            <div style={{ textAlign: "center", color: "gray" }}>Powered by OpenAI</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWithAI;
