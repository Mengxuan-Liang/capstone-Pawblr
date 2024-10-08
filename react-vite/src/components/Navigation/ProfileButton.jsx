import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgUserlane } from "react-icons/cg";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import '../HomePage/HomePage.css'

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  console.log(user)
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      {/* <button onClick={toggleMenu}> */}
      {/* <CgUserlane onClick={toggleMenu} style={{fontSize:'50px'}} className="react-icon" title="Profile"/> */}
      <img style={{borderRadius:'50%'}} src={user?.profileImage? user.profileImage:'logo2.png'} onClick={toggleMenu} className="react-icon paw" title="Profile"/>
      {/* </button> */}
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <li style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px',color:'#fc8d6c' }}>{user.username}</li>
              <li style={{ color: '#fc8d6c', marginBottom: '10px' }}>{user.email}</li>
              <li>
                <button onClick={logout}
                 style={{
                  backgroundColor: '#fc8d6c',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                >Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
