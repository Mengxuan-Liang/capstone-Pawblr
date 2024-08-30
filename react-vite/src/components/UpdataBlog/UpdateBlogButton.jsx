import { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import CreateAlbumFormModal from "./UpdateAlbumFormModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import '../Navigation/Navigation.css';
import UpdateBlogModal from "./UpdateBlogModel";
import { FaRegEdit } from "react-icons/fa";
import '../HomePage/HomePage.css'



export default function UpdateBlogButton({el}) {
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
          <button style={{ border: "none", backgroundColor: "transparent" }}>
            <OpenModalMenuItem
              // itemText="Update"
              itemText={<FaRegEdit className='react-icon' title="Update"/>}
              onItemClick={closeMenu}
              modalComponent={<UpdateBlogModal el={el} />}
            />
          </button>
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


