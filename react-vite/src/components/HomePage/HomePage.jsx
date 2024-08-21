import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetPosts } from "../../redux/postReducer"
import './HomePage.css'


export default function HomePage() {
    const dispatch = useDispatch()
    useEffect(() => {
        const func = async () => await dispatch(thunkGetPosts())
        func()
    }, [dispatch])
    const posts = useSelector(state => state.post)
    console.log(posts)
    return (
        <div>
      <header className="header">
        <div className="logo">Dumblr</div>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#">Explore</a>
          <a href="#">Inbox</a>
          <a href="#">Profile</a>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Following</a></li>
            <li><a href="#">Tags</a></li>
            <li><a href="#">Messages</a></li>
          </ul>
        </aside>

        <section className="feed">
          <article className="post">
            <div className="post-header">
              <h2>User Name</h2>
              <span>Posted on August 21, 2024</span>
            </div>
            <div className="post-content">
              <p>This is a sample post content for the Tumblr clone homepage.</p>
              <img src="https://via.placeholder.com/600x300" alt="Post" />
            </div>
          </article>

          <article className="post">
            <div className="post-header">
              <h2>Another User</h2>
              <span>Posted on August 21, 2024</span>
            </div>
            <div className="post-content">
              <p>This is another sample post for the Tumblr clone homepage.</p>
              <img src="https://via.placeholder.com/600x300" alt="Post" />
            </div>
          </article>
        </section>

        <aside className="right-column">
          <h3>Suggested Blogs</h3>
          <ul>
            <li><a href="#">Blog 1</a></li>
            <li><a href="#">Blog 2</a></li>
            <li><a href="#">Blog 3</a></li>
            <li><a href="#">Blog 4</a></li>
          </ul>
        </aside>
      </div>
    </div>
    )
}