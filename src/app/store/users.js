import authService from "../services/auth.service";
import localStorageService, { getUserId, getAccessToken, removeAuthData } from "../services/localStorage.service";
import userService from "../services/user.service";
import getRandomInt from "../utils/getRandomInt";
import history from "../utils/history";
import get from "lodash/get";
import generateAuthError from "../utils/generateAuthError";

const { createSlice, createAction } = require("@reduxjs/toolkit");

const initialState = getAccessToken() ? {
  entities: null,
  isLoading: true,
  isLoggedIn: true,
  error: null,
  auth: getUserId()
} : {
  entities: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
  auth: null
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
    },
    usersReceved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    },
    usersUpdated: (state) => {},
    usersUpdatedSuccess: (state, action) => {
      const users = state.entities.map(({ ...q }) => q);
      const i = state.entities.findIndex((u) => u._id === action.payload._id);
      users[i] = action.payload;
      state.entities = users;
    },
    usersUpdatedFailed: (state, action) => {
      state.error = action.payload;
    },
    authRequested: (state) => {
      state.error = null;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    userLoggedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
    }
  }
});

const { reducer, actions } = usersSlice;
const {
  usersRequested,
  usersReceved,
  usersRequestFailed,
  authRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userLoggedOut,
  usersUpdated,
  usersUpdatedSuccess,
  usersUpdatedFailed
} = actions;

const userCreateRequested = createAction("users/createRequested");
const userCreateFailed = createAction("users/userCreateFailed");

const createUser = (payload) => async (dispatch) => {
  dispatch(userCreateRequested());
  try {
    const { content } = await userService.create({
      rate: getRandomInt(1, 5),
      complitedMeetings: getRandomInt(0, 200),
      image: `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1).toString(36).substring(7)}.svg`,
      ...payload
    });
    dispatch(userCreated(content));
    history.push("/users");
    return content;
  } catch (error) {
    dispatch(userCreateFailed(error.message));
  }
};

export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
  try {
    dispatch(authRequested());
    const data = await authService.register({ email, password });
    const { localId: _id } = data;
    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));
    dispatch(createUser({
      _id,
      email,
      ...rest
  }));
  } catch (error) {
    dispatch(authRequestFailed(error.message));
  }
};

export const signIn = ({ email, password, ...rest }) => async (dispatch) => {
  try {
    dispatch(authRequested());
    const data = await authService.login({ email, password });

    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));

    history.push(get(history, "location.state.from.pathname", "/"));
  } catch (error) {
    const { message } = error.response.data.error;
    const errorMessage = generateAuthError(message);

    dispatch(authRequestFailed(errorMessage));
  }
};

export const update = (payload) => async (dispatch) => {
  dispatch(usersUpdated());
  try {
    await authService.update(payload);
    dispatch(usersUpdatedSuccess(payload));
  } catch (error) {
    dispatch(usersUpdatedFailed(error.message));
  }
};

export const logout = () => async (dispatch) => {
  removeAuthData();
  history.push("/");
  dispatch(userLoggedOut());
};

export const loadUsers = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.get();
    dispatch(usersReceved(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};

export const getUser = (id) => (state) => state.users.entities.find((u) => u._id === id);
export const getCurrentUser = () => (state) => get(state, "users.entities") ? state.users.entities.find((u) => u._id === state.users.auth.userId) : null;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getUsers = () => (state) => state.users.entities;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

export const getLoggedStatus = () => (state) => state.users.isLoggedIn;

export const getAuthErrors = () => (state) => state.users.error;

export default reducer;
