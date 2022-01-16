import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedStatus, getUsersLoadingStatus, loadUsers } from "../../../store/users";
import { loadQualities } from "../../../store/qualities";
import { loadProfessions } from "../../../store/professions";

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(getLoggedStatus());
  const usersLoading = useSelector(getUsersLoadingStatus());

  useEffect(() => {
    dispatch(loadQualities());
    dispatch(loadProfessions());
    if (isLoggedIn) dispatch(loadUsers());
  }, [isLoggedIn]);

  if (usersLoading) return "Loading";
  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default AppLoader;
