import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreatePost, thunkGetPosts } from "../../redux/postReducer";
import { useNavigate } from "react-router-dom";
import { thunkGetComments } from "../../redux/commentReducer";

export default function CreateBlogModal() {
   
    const userId = useSelector(state => state.session.user.id)

    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [tag, setTag] = useState('')
    const [image, setImage] = useState("");
    // const [isloaded, setIsloaded] = useState(false)
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const navigate = useNavigate()
    // useEffect(() => {
    //     const fetchData = async () => {
    //       await dispatch(thunkGetPosts());
    //       await dispatch(thunkGetComments());
      
    //     };
    //     fetchData();
    //   }, [dispatch,isloaded]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const serverResponse = await dispatch(
            thunkCreatePost({
                user_id: userId,
                text
            })
        );

    
        if (!serverResponse.errors) {
            // setIsloaded(!isloaded)
            closeModal();
            navigate('/');
        } else {
            setErrors(serverResponse);
        }
    };
 
    return (
        <div id="container-create-blog-modal">
            <h2>Create Blog</h2>

            <form id="container-create-blog-form"
                onSubmit={handleSubmit}
            >
                <label>
                    <textarea
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Go ahead, put anything..."
                        required
                    />
                </label>
                {errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.text}</p>}
                <br></br>
                <label style={{color:'grey'}}>
                    #add tags to help people find your post
                </label>
                {errors?.errors?.tag && <p style={{ color: 'red' }}>{errors.errors.tag}</p>}
<br></br>
                <button type="submit">Create</button>
                <button
             
                    onClick={() => {
                        setText('new blog')
                    }}
                >Demo Blog</button>
            </form>
        </div>
    );
}


