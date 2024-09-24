import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import './ChatWithAI.css'
import NavBar from "./NavSideBar/NavBar";

function ChatWithAI() {
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query) return;
    console.log('query:', query)
    setLoading(true);

    const res = await fetch("/api/ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: query }),
    });

    console.log("Response status:", res.status); // 调试用
    const data = await res.json();
    console.log("Response data:", data); // 调试用

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
    <>
     <header className="header">
        <NavBar />
      </header>
    <div className="ai-container">
      <h2 onClick={toggleVisibility} style={{ cursor: "pointer" }}>
        <span>
          <FaWandMagicSparkles />
        </span>
        <span> Click & Start to Chat</span>
      </h2>
      {isVisible && (
        <div className="ai-chat">
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
              placeholder='Ask me anything"'
            />
            <button onClick={handleSubmit}>
              {loading ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ChatWithAI;
