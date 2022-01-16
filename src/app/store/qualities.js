import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/qaulity.service";

const qualitiesSlice = createSlice({
  name: "qualities",
  initialState: {
    entities: null,
    fetchedAt: null,
    isLoading: true,
    error: null
  },
  reducers: {
    qualitiesRequested: (state) => {
      state.isLoading = true;
    },
    qualitiesReceved: (state, action) => {
      state.entities = action.payload;
      state.fetchedAt = Date.now();
      state.isLoading = false;
    },
    qualitiesRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

const { reducer, actions } = qualitiesSlice;
const { qualitiesRequested, qualitiesReceved, qualitiesRequestFailed } = actions;

export const loadQualities = () => async (dispatch, getState) => {
  const state = getState().qualities;
  if (state.fetchedAt > Date.now() + 1000 * 60 * 10) return;

  dispatch(qualitiesRequested());
  try {
    const { content } = await qualityService.fetchAll();
    dispatch(qualitiesReceved(content));
  } catch (error) {
    dispatch(qualitiesRequestFailed(error.message));
  }
};

export const getQuality = (id) => (state) => state.qualities.entities.find((q) => q._id === id);
export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesByIds = (ids) => (state) => state.qualities.entities.filter((q) => ids.includes(q._id));
export const getQualitiesLoadingStatus = () => (state) => state.qualities.isLoading;

export default reducer;
