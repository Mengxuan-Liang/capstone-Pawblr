import { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import CreateBlogModal from "./CreateBlogModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
// import ModalPage from "./ModelPage";
// import HomePage from "../HomePage/HomePage";
// import MainPage from "./MainPage.css";
import './ModalButton.css'



export default function ModelButton() {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

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
          <HomePage />
        </>
      ) : (
        <div id="sign-log-button-container">
          <button id="tumblr-button">
            <OpenModalMenuItem
              itemText="Paw In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </button>
          <button id="tumblr-button">
            <OpenModalMenuItem
              itemText="Sign Up & Wag On"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </button>
        </div>
      )}
    </nav>
  );
}



