import { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import CreateBlogModal from "./CreateBlogModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import ModalPage from "./ModelPage";
import HomePage from "../HomePage/HomePage";




export default function ModelButton() {
  // const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  // const toggleMenu = (e) => {
  //   e.stopPropagation();
  //   setShowMenu(!showMenu);
  // };

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

  return (

    <nav id="container-user-navigation" style={{ position: "relative" }}>
      {user ? (
        <>
        <HomePage/>
          {/* <button style={{ border: "none", backgroundColor: "transparent" }}>
            <OpenModalMenuItem
              itemText="Sign up or Log in"
              onItemClick={closeMenu}
              modalComponent={<ModalPage />}
            />
          </button> */}
        </>
      ) : (
        <>
          <button style={{ border: "none", backgroundColor: "transparent" }}>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </button>
          <button style={{ border: "none", backgroundColor: "transparent" }}>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </button>
        </>
      )}
    </nav>
  );
}


