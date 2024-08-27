import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUpdatePost } from "../../redux/postReducer";
import { useNavigate } from "react-router-dom";
import { createImage } from "../../redux/imageReducer";
import { thunkGetTags } from "../../redux/tagReducer";


export default function UpdateBlogModal({ el }) {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userId = useSelector(state => state.session.user.id)
    const [text, setText] = useState(el?.text);
    const [img, setImg] = useState(el?.img);
    // const [tags, setTags] = useState(el?.labels)
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // TAGS
    const allTags = useSelector(state => state.tag)
    console.log('all tags', allTags)
    const [selectedTags, setSelectedTags] = useState(el?.labels?.map(tag => tag.id) || []);
    useEffect(() => {
        const func = async () => await dispatch(thunkGetTags())
        func()
    }, [dispatch,selectedTags])
    
    const handleTagClick = (tagId) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tagId)) {
                // Remove tag if it's already selected
                return prevTags.filter(tag => tag !== tagId);
            } else {
                // Add tag if it's not selected
                return [...prevTags, tagId];
            }
        });
    };
    const unselectedTags = allTags?.tag?.filter(tag => !selectedTags.includes(tag.id));
    console.log('SELECTED TAGS!!!!!!', selectedTags)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serverResponse = await dispatch(
            thunkUpdatePost({
                user_id: userId,
                post_id: el.id,
                text,
                img,
                tags: selectedTags
            })
        );
        console.log('server response!!!!!', serverResponse)
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
        if (tempFile?.size > 5000000) {
            setFilename(maxFileError);
            return
        }
        const newImageURL = URL.createObjectURL(tempFile);
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
            setImg(awsImageUrl)
        }
        setImageLoading(false);
    }
    const stateImageUrl = useSelector(state => state.image?.img?.image?.image);

    return (
        <div id="container-signup-form-modal">
            <h1>Update</h1>
            <p>Your image</p>
            {el.img && <img style={{ width: '150px' }} src={el.img} />}

            <p style={{ color: 'grey', fontSize: "15px" }}>Upload new image</p>
            <div className="file-inputs-container">
                <div><img src={imageURL} style={{ width: "150px" }} className="thumbnails"></img></div>
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
            <br></br>
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
                <br></br>
                <p>Edit your tags</p>
                {selectedTags?.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        style={{
                            backgroundColor: selectedTags.includes(tag) ? 'lightblue' : 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '5px 10px',
                            margin: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {allTags?.tag?.find(el => el?.id == tag)?.name}
                    </button>
                ))}
                <br></br>
                <label style={{ color: 'grey' }}>
                    # Add more tags to help people find your post
                </label>
                <div>
                    {unselectedTags?.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagClick(tag.id)}
                            style={{
                                backgroundColor: selectedTags.includes(tag.id) ? 'lightblue' : 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                margin: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {tag.name}
                        </button>
                    ))}
                    {/* <button type="button" onClick={handleAddTag}>Add Tag</button> */}
                </div>
                {/* <div>
                    {tags.map((tag, index) => (
                        <span key={index} style={{ marginRight: '10px' }}>
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)}>Remove</button>
                        </span>
                    ))}
                </div> */}
                {errors?.errors?.tags && <p style={{ color: 'red' }}>{errors?.errors?.tags}</p>}
                <br />

                <button type="submit">Update</button>

            </form>
        </div>
    );
}


