import NavBar from "../NavSideBar/NavBar";
import SideBar from "../NavSideBar/SideBar";
import RightColumn from "../RightColumn/RightColumn";
import '../HomePage/HomePage.css'
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Feed from "../HomePage/Feed";


export default function Tagged() {
    const location = useLocation()
    const { tag } = location.state || {}
    // console.log('tag in tagged', tag)
    const tagId = tag?.id

    const allPostsArr = useSelector(state => state.post?.post);
    const postHasTagArr = allPostsArr?.filter(post => post.labels && post.labels.length > 0)
    const filteredPosts = postHasTagArr?.map(post => {
        const filteredLabels = post?.labels?.filter(tag => tag?.id === tagId);
        return filteredLabels.length > 0 ? post : null
    }).filter(post => post !== null)
    console.log('filtered posts with matched tags', filteredPosts)

    return (
      <div >
        <Feed posts={filteredPosts}/>
      </div>
    )
}