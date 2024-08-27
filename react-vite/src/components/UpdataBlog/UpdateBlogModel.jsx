import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdatePost } from "../../redux/postReducer";
import { useNavigate } from "react-router-dom";
import { createImage } from "../../redux/imageReducer";


export default function UpdateBlogModal({ el }) {
    const userId = useSelector(state => state.session.user.id)
    // console.log('who is el?', el)


    const dispatch = useDispatch();
    const [text, setText] = useState(el?.text);
    const [img, setImg] = useState(el?.img)
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const navigate = useNavigate()



    const handleSubmit = async (e) => {
        e.preventDefault();

        const serverResponse = await dispatch(
            thunkUpdatePost({
                user_id: userId,
                post_id: el.id,
                text,
                img: imageURL
            })
        );

        if (!serverResponse.errors) {
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
    const [imageLoading, setImageLoading] = useState(false);

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
    const response = await dispatch(createImage(formData));
    // console.log('response', response)
    if (response) {
      // const data = await response.json();
      // console.log('data', data)
      const awsImageUrl = response.image.image;  // Assuming the URL is returned in the response
      // console.log('aws images!!!!!!!', awsImageUrl)
      setImageURL(awsImageUrl);  // Use the actual AWS URL here
    }

    setImageLoading(false);


    }

    return (
        <div id="container-signup-form-modal">
            <h1>Update</h1>
            {el.img && <img style={{ width: '150px' }} src={el.img} />}

            <p style={{ color: 'grey', fontSize: "15px" }}>Upload image(optional)</p>
            <div className="file-inputs-container">
                <div><img src={imageURL} style={{ width: "70px" }} className="thumbnails"></img></div>
                <div className="file-inputs-filename" style={{ color: filename === maxFileError ? "red" : "#B7BBBF" }}>{filename}</div>
                <input type="file" accept="image/png, image/jpeg, image/jpg" id="post-image-input" onChange={fileWrap}></input>
                <div className="file-inputs-optional">{optional}</div>
                {/* <label htmlFor="post-image-input" className="file-input-labels">Choose File</label> */}
            </div>

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
                {errors?.errors?.errors?.text && <p style={{ color: 'red' }}>{errors.errors.errors?.text}</p>}


                <button type="submit">Update</button>

            </form>
        </div>
    );
}


