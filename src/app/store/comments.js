import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    entities: null,
    isLoading: true,
    error: null
  },
  reducers: {
    commentsRequested: (state) => {
      state.isLoading = true;
    },
    commentsReceved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    commentsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    commentCreateRequested: (state) => {},
    commentCreateSuccess: (state, action) => {
      state.entities.push(action.payload);
    },
    commentCreateFailed: (state, action) => {
      state.error = action.payload;
    },
    commentRemoveRequested: (state) => {},
    commentRemoveSuccess: (state, action) => {
      state.entities = state.entities.filter(({ _id }) => _id !== action.payload);
    },
    commentRemoveFailed: (state, action) => {
      state.error = action.payload;
    }
  }
});

const { reducer, actions } = commentsSlice;
const {
  commentsRequested,
  commentsReceved,
  commentsRequestFailed,
  commentCreateRequested,
  commentCreateSuccess,
  commentCreateFailed,
  commentRemoveRequested,
  commentRemoveSuccess,
  commentRemoveFailed
} = actions;

export const createComment = (data) => async (dispatch) => {
  dispatch(commentCreateRequested());
  const comment = {
    _id: nanoid(),
    created_at: Date.now(),
    ...data
  };
  try {
    const { content } = await commentService.create(comment);
    dispatch(commentCreateSuccess(content));
  } catch (error) {
    dispatch(commentCreateFailed(error.message));
  }
};

export const removeComment = (id) => async (dispatch) => {
  dispatch(commentRemoveRequested());
  try {
    await commentService.remove(id);
    dispatch(commentRemoveSuccess(id));
  } catch (error) {
    dispatch(commentRemoveFailed(error.message));
  }
};

export const loadComments = (userId) => async (dispatch, getState) => {
  dispatch(commentsRequested());
  try {
    const { content } = await commentService.getAll(userId);
    dispatch(commentsReceved(content));
  } catch (error) {
    dispatch(commentsRequestFailed(error.message));
  }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentLoadingStatus = () => (state) => state.comments.isLoading;

export default reducer;
