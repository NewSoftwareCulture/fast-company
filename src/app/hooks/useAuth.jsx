import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import userService from "../services/user.service";
import { setTokens } from "../services/localStorage.service";

const AuthContext = React.createContext();

const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/"
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [, setCurrentUser] = useState({});

    async function createUser(data) {
        const { content } = await userService.create(data);
        setCurrentUser(content);
    }
    async function signUp({ email, password, ...rest }) {
        const route = `v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
        try {
            const { data } = await httpAuth.post(route, {
                email,
                password,
                returnSecureToken: true
            });
            const { localId: _id } = data;

            setTokens(data);
            await createUser({ _id, email, ...rest });
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
        const route = `v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;

        try {
            const { data } = await httpAuth.post(route, {
                email,
                password,
                returnSecureToken: true
            });

            setTokens(data);
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

    return (
        <AuthContext.Provider value={{ signUp, signIn }}>
            {children}
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
