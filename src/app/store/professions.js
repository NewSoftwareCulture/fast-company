import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
  name: "professions",
  initialState: {
    entities: null,
    fetchedAt: null,
    isLoading: true,
    error: null
  },
  reducers: {
    professionsRequested: (state) => {
      state.isLoading = true;
    },
    professionsReceved: (state, action) => {
      state.entities = action.payload;
      state.fetchedAt = Date.now();
      state.isLoading = false;
    },
    professionsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

const { reducer, actions } = professionsSlice;
const { professionsRequested, professionsReceved, professionsRequestFailed } = actions;

export const loadProfessions = () => async (dispatch, getState) => {
  const state = getState().professions;
  if (state.fetchedAt > Date.now() + 1000 * 60 * 10) return;

  dispatch(professionsRequested());
  try {
    const { content } = await professionService.get();
    dispatch(professionsReceved(content));
  } catch (error) {
    dispatch(professionsRequestFailed(error.message));
  }
};

export const getProfession = (id) => (state) => state.professions.entities.find((p) => p._id === id);
export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionLoadingStatus = () => (state) => state.professions.isLoading;

export default reducer;
