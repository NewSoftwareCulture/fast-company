import axios from "axios";
import httpService from "./http.service";
import { getRefreshToken } from "./localStorage.service";

export const httpAuth = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: {
      key: process.env.REACT_APP_FIREBASE_KEY
  }
});

export const httpSecure = axios.create({
  baseURL: "https://securetoken.googleapis.com/v1/",
  params: {
      key: process.env.REACT_APP_FIREBASE_KEY
  }
});

export const authService = {
  register: async ({ email, password }) => {
    const route = `accounts:signUp`;
    const { data } = await httpAuth.post(route, {
        email,
        password,
        returnSecureToken: true
    });
    return data;
  },
  login: async ({ email, password }) => {
    const route = `accounts:signInWithPassword`;
    const { data } = await httpAuth.post(route, {
        email,
        password,
        returnSecureToken: true
    });
    return data;
  },
  update: async (payload) => {
    const route = `user/${payload._id}`;
    const { data } = await httpService.put(route, payload);
    return data;
  },
  refresh: async () => {
    const refreshToken = getRefreshToken();

    const { data } = await httpSecure.post("token", {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    });
    return data;
  }
};

export default authService;
