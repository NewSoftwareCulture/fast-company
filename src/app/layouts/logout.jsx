import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/users";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => dispatch(logout()), []);
  return (<h1>Loading...</h1>);
};

export default Logout;
