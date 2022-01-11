import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NavProfile = () => {
  const { currentUser } = useAuth();
  const [isOpen, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (<div className="dropdown" onClick={toggleMenu}>
    <button type="button" className="btn dropdown-toggle d-flex align-items-center">
      <div className="me-2">{currentUser.name}</div>
      <img
        src={currentUser.image}
        alt="avatar"
        height="40"
        className="img-responsive rounded-circle" />
    </button>
    <ul className={`w-100 dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`} data-bs-popper="static">
      <li><Link to={`/users/${currentUser._id}`} className="dropdown-item">Profile</Link></li>
      <li><hr className="dropdown-divider"/></li>
      <li><Link to="/logout" className="dropdown-item">Logout</Link></li>
    </ul>
  </div>);
};

export default NavProfile;
