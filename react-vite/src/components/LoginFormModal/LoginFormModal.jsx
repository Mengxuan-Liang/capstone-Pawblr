import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
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
      closeModal();
    }
  };

  return (
    <div className="modal-container" style={{borderRadius:'7px'}}>
      <h1>Pawblr</h1>
      <br></br>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
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
        <label className="form-label">
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
        <button className="form-button" type="submit">
          Paw In
        </button>
        <br></br>
        <br></br>
        <button
          onClick={()=> {
            setEmail('demo@aa.io')
            setPassword('password')
          }}
        >Demo user</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
