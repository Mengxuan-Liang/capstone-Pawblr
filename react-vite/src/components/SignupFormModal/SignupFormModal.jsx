import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { createImage } from "../../redux/imageReducer";
import './SignupForm.css'
import "../LoginFormModal/LoginForm.css";


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  // const [profileImg, setProfileImg] = useState('')
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
        profileImage: imageURL
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
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

  const stateImageUrl = useSelector(state => state.image?.img?.image?.image);
  // console.log('IMAGE', image)
  // console.log('state image', stateImageUrl)
  // console.log('FILE', file)
  // console.log('imageURL', imageURL)


  return (
    <div className="modal-container">
      <h1>Dumblr</h1>
      <div>Choose profile image(optional)</div>

      <div className="file-inputs-container" >
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
          <button type="submit">Confirm Profile Image</button>
        </form>


        {errors.server && <p>{errors.server}</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
