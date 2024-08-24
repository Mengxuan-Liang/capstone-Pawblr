import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { createImage } from "../../redux/imageReducer";
import "../LoginFormModal/LoginForm.css"; // Adjusted path to your CSS file


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
        profileImage:imageUrl
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  // --------------aws
  const handleSubmitImg = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    console.log('IMG', image)
    console.log('FORMDATA', formData)

    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    setImageLoading(true);
    await dispatch(createImage(formData));
    // navigate("/blog");
  }

  const imageUrl = useSelector(state => state.image?.img?.image?.image);

  // const handleSetImg = ()=> {

  // }

  return (
    <div className="modal-container">
      <h1>Sign Up</h1>

      <p style={{ color: 'grey', fontSize: "15px" }}>Choose your profile image(optional)</p>
      {(imageLoading) && <img style={{ width: '20%' }} src={imageUrl}></img>}
      <form
        onSubmit={handleSubmitImg}
        encType="multipart/form-data"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Preview</button>
        {/* <button onClick={handleSetImg}>Set as profile image</button> */}

      </form>


      {errors.server && <p>{errors.server}</p>}
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
