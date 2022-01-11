import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";

const CommentsContext = React.createContext();

export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
    const { userId } = useParams();
    const { currentUser } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    useEffect(() => {
      getAll();
    }, [userId]);

    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }

    async function getAll() {
        try {
            const { content } = await commentService.getAll(userId);
            setComments(content);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }

    async function createComment(data) {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: userId,
            userId: currentUser._id,
            created_at: Date.now()
        };
        try {
            const { content } = await commentService.create(comment);
            setComments((prev) => [...prev, content]);
        } catch (error) {
            errorCatcher(error);
        }
    }

    async function removeComment(id) {
        try {
            const { content } = await commentService.remove(id);

            if (content) return;
            setComments((prev) => prev.filter(({ _id }) => _id !== id));
        } catch (error) {
            errorCatcher(error);
        }
    }

    return (
        <CommentsContext.Provider
            value={{ isLoading, comments, createComment, removeComment }}
        >
            {children}
        </CommentsContext.Provider>
    );
};

CommentsProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
