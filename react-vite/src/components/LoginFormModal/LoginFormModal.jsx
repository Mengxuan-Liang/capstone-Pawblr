import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import '../NewLoginSignupPage/LogSign.css'
import NavBar from "../NavSideBar/NavBar";

function LoginFormModal() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate('/home')
      closeModal();
    }
  };

  return (
    <div className="modal-container container">
      <header className="header">
      <img src='https://res.cloudinary.com/dhukvbcqm/image/upload/v1728150847/Screenshot_2024-10-05_at_1.50.25_PM-modified_lnu1zf.png' style={{ width: '6%',paddingTop:'10px'}} />
      </header>
      <span></span>
        <span></span>
        <span></span>
      <form className="form" id='signinForm' onSubmit={handleSubmit}>
        <label className="form-label" style={{color:"#0f4274"}}>
          Email
          <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="form-error">{errors.email}</p>}
        <label className="form-label" style={{color:"#0f4274"}}>
          Password
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && (
          <p className="form-error">{errors.password}</p>
        )}
        <button className="form-button new-style-button"  type="submit" style={{color:'#fc8d6c'}}>
          Paw In
        </button>
        <br></br>
        <button
         className='new-style-button'
        style={{color:'#fc8d6c'}}
          onClick={()=> {
            setEmail('demo@aa.io')
            setPassword('password')
          }}
        >Demo user</button>
        <button style={{color:'#fc8d6c'}}  className='new-style-button' onClick={()=>navigate('/signup')}>Sign Up</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
