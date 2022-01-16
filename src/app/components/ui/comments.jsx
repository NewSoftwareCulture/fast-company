import React, { useEffect } from "react";
import { orderBy } from "lodash";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useDispatch, useSelector } from "react-redux";
import { createComment, getCommentLoadingStatus, getComments, loadComments, removeComment } from "../../store/comments";
import { useParams } from "react-router-dom";
import { getCurrentUserId } from "../../store/users";

const Comments = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());

    const comments = useSelector(getComments());
    const isLoading = useSelector(getCommentLoadingStatus());

    const handleSubmit = (data) => {
        const content = {
            ...data,
            pageId: userId,
            userId: currentUserId
        };
        dispatch(createComment(content));
    };
    const handleRemoveComment = (id) => {
        dispatch(removeComment(id));
    };

    useEffect(() => {
        dispatch(loadComments(userId));
    }, [userId]);

    const sortedComments = orderBy(comments, ["created_at"], ["desc"]);

    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {isLoading ? "Loading" : (<CommentsList
                            comments={sortedComments}
                            onRemove={handleRemoveComment}
                        />)}
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
