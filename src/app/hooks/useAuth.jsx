import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import userService from "../services/user.service";
import { setTokens, getAccessToken, removeAuthData } from "../services/localStorage.service";
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
});

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [isLoading, setLoading] = useState(true);

    const history = useHistory();

    async function createUser(data) {
        const { content } = await userService.create(data);
        setCurrentUser(content);
    }

    const getUserData = async () => {
        const { content } = await userService.getUser();
        setCurrentUser(content);
        setLoading(false);
    };

    async function signUp({ email, password, ...rest }) {
        const route = `accounts:signUp`;
        try {
            const { data } = await httpAuth.post(route, {
                email,
                password,
                returnSecureToken: true
            });
            const { localId: _id } = data;

            setTokens(data);
            await createUser({
                _id,
                email,
                rate: getRandomInt(1, 5),
                complitedMeetings: getRandomInt(0, 200),
                image: `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1).toString(36).substring(7)}.svg`,
                ...rest
            });
        } catch (error) {
            const { code, message } = error.response.data.error;
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const err = {
                        email: "Пользователь с таким email уже существует"
                    };
                    throw err;
                }
            }
        }
    };
    async function signIn({ email, password, ...rest }) {
        const route = `accounts:signInWithPassword`;

        try {
            const { data } = await httpAuth.post(route, {
                email,
                password,
                returnSecureToken: true
            });

            setTokens(data);
            await getUserData();
        } catch (error) {
            const { code, message } = error.response.data.error;

            if (code === 400) {
                if (message === "EMAIL_NOT_FOUND") {
                    const err = {
                        email: "Пользователь с таким email не найден"
                    };
                    throw err;
                }
                if (message === "INVALID_PASSWORD") {
                    const err = {
                        password: "Неверный пароль"
                    };
                    throw err;
                }
            }
        }
    };

    async function update(data) {
        createUser(data);
    }

    async function Logout() {
        removeAuthData();
        setCurrentUser(null);
        history.push("/");
    }

    useEffect(() => {
        if (getAccessToken()) getUserData();
        else setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ signUp, signIn, Logout, update, currentUser }}>
            {isLoading ? "Loading..." : children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AuthProvider;
