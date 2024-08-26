import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreatePost, thunkGetPosts } from "../../redux/postReducer";
import { useNavigate } from "react-router-dom";
import { thunkGetComments } from "../../redux/commentReducer";
import { createImage } from "../../redux/imageReducer";

export default function CreateBlogModal() {

    const userId = useSelector(state => state.session.user.id)

    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [tag, setTag] = useState('')
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
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
                text,
                img: imageURL
            })
        );


        if (!serverResponse.errors) {
            // setIsloaded(!isloaded)
            closeModal();
            navigate('/home');
        } else {
            setErrors(serverResponse);
        }
    };
    // ---------------aws------preview
    const maxFileError = "Selected image exceeds the maximum file size of 5Mb";
    const [optional, setOptional] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('')

    const fileWrap = (e) => {
        e.stopPropagation();

        const tempFile = e.target.files[0];

        // Check for max image size of 5Mb
        if (tempFile?.size > 5000000) {
            setFilename(maxFileError); // "Selected image exceeds the maximum file size of 5Mb"
            return
        }

        const newImageURL = URL.createObjectURL(tempFile); // Generate a local URL to render the image file inside of the <img> tag.
        setImageURL(newImageURL);
        setFile(tempFile);
        setFilename(tempFile.name);
        setOptional("");
    }
    // --------------aws----posting
    const handleSubmitImg = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        // console.log('IMG', image)
        // console.log('FORMDATA', formData)

        setImageLoading(true);
        await dispatch(createImage(formData));

    }
    return (
        <div id="container-create-blog-modal">
            <h2>Create Blog</h2>
            <p style={{ color: 'grey', fontSize: "15px" }}>Upload image(optional)</p>
            <div className="file-inputs-container">
                <div><img src={imageURL} style={{ width: "70px" }} className="thumbnails"></img></div>
                <div className="file-inputs-filename" style={{ color: filename === maxFileError ? "red" : "#B7BBBF" }}>{filename}</div>
                <input type="file" accept="image/png, image/jpeg, image/jpg" id="post-image-input" onChange={fileWrap}></input>
                <div className="file-inputs-optional">{optional}</div>
                {/* <label htmlFor="post-image-input" className="file-input-labels">Choose File</label> */}
            </div>



            {/* <p style={{ color: 'grey', fontSize: "15px" }}>Choose your profile image(optional)</p>
      {(imageLoading) && <img style={{ width: '20%' }} src={imageURL}></img>} */}
            <div >
                <form
                    onSubmit={handleSubmitImg}
                    encType="multipart/form-data"
                >
                    {/* <input
         style={{visibility:'hidden'}}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        /> */}
                    <button type="submit">Confirm</button>
                </form>


                {errors.server && <p>{errors.server}</p>}
            </div>
            <br></br>

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
                <label style={{ color: 'grey' }}>
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


