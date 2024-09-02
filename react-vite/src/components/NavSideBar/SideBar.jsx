import ProfileButton from "../Navigation/ProfileButton"
import { NavLink } from "react-router-dom"
import CreateBlogButton from "../CreateBlog/CreateBlogButton"
import './SideBar.css'


export default function SideBar (){
    return (<>
    <div className="fixed-menu">
            <div className='profile-button'>
              < ProfileButton />
            </div>
            <ul className="home-blog-comment-like-container">
              <li><NavLink to={'/home'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Home</NavLink></li>
              <li><NavLink to={'/blog'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Blogs</NavLink></li>
              <li><NavLink to={'/comment'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Comments</NavLink></li>
              <li><NavLink to={'/like'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Likes</NavLink></li>
              {/* <li><NavLink to={'/follow'} className={({ isActive }) => (isActive ? "active-tab" : "")}>Following</NavLink></li> */}
              {/* <li><a href="#">Activity</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Settings</a></li> */}
            </ul>
            <div className='create-blog-button'><CreateBlogButton /></div>
          </div>
    </>)
}