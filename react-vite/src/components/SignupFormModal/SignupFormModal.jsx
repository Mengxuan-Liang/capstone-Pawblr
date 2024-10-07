import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { createImage } from "../../redux/imageReducer";
import './SignupForm.css'
import "../LoginFormModal/LoginForm.css";
import { useNavigate } from "react-router-dom";


function SignupFormModal() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  // const [profileImg, setProfileImg] = useState('')
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (username.length < 2) {
      newErrors.username = "Username must be at least 2 characters long.";
    }
    if (password.length < 2) {
      newErrors.password = "Password must be at least 2 characters long.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
if(file){
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
      const awsImageUrl = response?.image?.image;
      // console.log('aws images real in sign up!!!!!!!', awsImageUrl)
      setImageURL(awsImageUrl);  // Use the actual AWS URL here
      return response;
    }

    setImageLoading(false);

  }
  const imgRes = await handleSubmitImg(e)
  const imageInUse = imgRes?.succss?.image?.image;
  const serverResponse = await dispatch(
    thunkSignup({
      email,
      username,
      password,
      profileImage: imageInUse
    })
  );

  if (serverResponse) {
    setErrors(serverResponse);
  } else {
    navigate('/home')
    closeModal();
  }
}else {
  const serverResponse = await dispatch(
    thunkSignup({
      email,
      username,
      password
    })
  );

  if (serverResponse) {
    setErrors(serverResponse);
  } else {
    navigate('/home')
    closeModal();
  }
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
  // const handleSubmitImg = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   // console.log('IMG', image)
  //   // console.log('FORMDATA', formData)

  //   setImageLoading(true);
  //   const response = await dispatch(createImage(formData));
  //   // console.log('response', response)
  //   if (response) {
  //     // const data = await response.json();
  //     // console.log('data', data)
  //     const awsImageUrl = response?.image?.image;
  //     console.log('aws images real in sign up!!!!!!!', awsImageUrl)
  //     setImageURL(awsImageUrl);  // Use the actual AWS URL here
  //     return response;
  //   }

  //   setImageLoading(false);

  // }

  const stateImageUrl = useSelector(state => state.image?.img?.image?.image);
  // console.log('IMAGE', image)
  // console.log('state image', stateImageUrl)
  // console.log('FILE', file)
  // console.log('imageURL', imageURL)


  return (
    <div className="modal-container container">
      <header className="header">
      <img src='https://res.cloudinary.com/dhukvbcqm/image/upload/v1728150847/Screenshot_2024-10-05_at_1.50.25_PM-modified_lnu1zf.png' className='new-logo' style={{ width: '5%',paddingTop:"5px" }} onClick={()=>navigate('/')} />
      </header>
      <span></span>
        <span></span>
        <span></span>
        <div id='signinForm'>
      <div style={{color:"#0f4274", fontSize:"15px"}}>Profile image(optional)</div>

      <div className="file-inputs-container" >
        <div><img src={imageURL} style={{ width: "70px" }} className="thumbnails"></img></div>
        <div className="file-inputs-filename" style={{ color: filename === maxFileError ? "red" : "#B7BBBF" }}>{filename}</div>
        <input type="file" accept="image/png, image/jpeg, image/jpg" id="post-image-input" onChange={fileWrap}></input>
        <div className="file-inputs-optional">{optional}</div>
        {/* <label htmlFor="post-image-input" className="file-input-labels">Choose File</label> */}
      </div>



      {/* <p style={{ color: 'grey', fontSize: "15px" }}>Choose your profile image(optional)</p>
      {(imageLoading) && <img style={{ width: '20%' }} src={imageURL}></img>} */}
      {/* <div >
        <form
          onSubmit={handleSubmitImg}
          encType="multipart/form-data"
        >
          <input
         style={{visibility:'hidden'}}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
          <button type="submit">Confirm Profile Image</button>
        </form>

        {errors?.server && <p>{errors.server}</p>}
      </div> */}
      <form onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label style={{color:"#0f4274"}}>
          Email
          <input
            type="text"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              // Validate email format and clear error if valid
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: emailRegex.test(value) ? null : prevErrors.email,
              }));
            }}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label style={{color:"#0f4274"}}>
          Username
          <input
            type="text"
            value={username}
            // onChange={(e) => setUsername(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);

              // Clear error if text is greater than 2 characters
              setErrors((prevErrors) => ({
                ...prevErrors,
                username: value.length >= 2 ? null : prevErrors.username,
              }));
            }}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label style={{color:'#fc8d6c'}}>
          Password
          <input
            type="password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);

              // Clear error if the password is valid
              setErrors((prevErrors) => ({
                ...prevErrors,
                password: value.length >= 2 ? null : prevErrors.password,
              }));
            }}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label style={{color:'#fc8d6c'}}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);

              // Clear error if passwords match
              setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: value === password ? null : prevErrors.confirmPassword,
              }));
            }}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button  className='new-style-button' type="submit" style={{color:'#fc8d6c'}}>Sign Up</button>
      </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
