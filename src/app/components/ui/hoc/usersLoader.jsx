import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getUsersLoadingStatus, loadUsers } from "../../../store/users";

const UsersLoader = ({ children }) => {
  const isLoading = useSelector(getUsersLoadingStatus());
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) dispatch(loadUsers());
  }, []);

  if (isLoading) return "Loading";
  return children;
};

UsersLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default UsersLoader;
