import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdatePost } from "../../redux/postReducer";
import { useNavigate } from "react-router-dom";


export default function UpdateBlogModal({ el }) {
    const userId = useSelector(state => state.session.user.id)
    // console.log('who is el?', el)


    const dispatch = useDispatch();
    const [text, setText] = useState(el?.text);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const navigate = useNavigate()



    const handleSubmit = async (e) => {
        e.preventDefault();

        const serverResponse = await dispatch(
            thunkUpdatePost({
                user_id: userId,
                post_id: el.id,
               text
            })
        );

        if (!serverResponse.errors) {
            closeModal();
            navigate('/blog');
        } else {
            setErrors(serverResponse);
        }
    };

    return (
        <div id="container-signup-form-modal">
            <h1>Update</h1>

            <form id="container-signup-form"
                onSubmit={handleSubmit}
            >

                <label>
                    <textarea
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </label>
                {errors?.errors?.errors.text && <p style={{ color: 'red' }}>{errors.errors.errors.text}</p>}

               
                <button type="submit">Update</button>

            </form>
        </div>
    );
}


