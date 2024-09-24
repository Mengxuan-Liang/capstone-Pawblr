import ProfileButton from "../Navigation/ProfileButton"
import { NavLink } from "react-router-dom"
import CreateBlogButton from "../CreateBlog/CreateBlogButton"
import './SideBar.css'
import ChatWithAI from "../ChatWithAI"
import { FaWandMagicSparkles } from "react-icons/fa6";


export default function SideBar() {
  return (
    <div className="side-bar-container">
      <div className="fixed-menu">
        <div className='profile-button'>
          < ProfileButton />
        </div>
        <br></br>
        <ul className="home-blog-comment-like-container">
          {/* <iframe
            src="https://www.chatbase.co/chatbot-iframe/kAUhl8HU1AjkaM9_jnohU"
            width="100%"
            style={{ height: '100%', minHeight: '700px' }}
            frameBorder="0"
          ></iframe> */}
          <li><NavLink to={'/home'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Home</NavLink></li>
          <li><NavLink to={'/blog'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Blogs</NavLink></li>
          <li><NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Comments</NavLink></li>
          <li><NavLink to={'/like'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Likes</NavLink></li>
          <li style={{color:"black"}}><NavLink to={'/chat'} className={({ isActive }) => (isActive ? "active-tab" : "")}><span>
          <FaWandMagicSparkles />
        </span>{' '}AI Chat</NavLink></li>
          {/* <li><NavLink to={'https://www.chatbase.co/chatbot-iframe/kAUhl8HU1AjkaM9_jnohU'} className={({ isActive }) => (isActive ? "active-tab" : "")}>ChatAI</NavLink></li> */}
          {/* <li><NavLink to={'/message'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Message</NavLink></li> */}
          {/* <li><NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink></li> */}
          {/* <li><a href="#">Activity</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li> */}
        </ul>
        <div id='side-bar-create' className='create-blog-button'><CreateBlogButton /></div>
      </div>
    </div>
  )
}