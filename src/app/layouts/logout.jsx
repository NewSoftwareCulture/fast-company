import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const Logout = () => {
  const { Logout } = useAuth();

  useEffect(Logout, []);
  return (<h1>Loading...</h1>);
};

export default Logout;
