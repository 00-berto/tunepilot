import { createSlice } from "@reduxjs/toolkit";

export const tuneSlice = createSlice({
  name: "tune",
  initialState: {
    file: "",
    songDetails: {
      name: "",
      artist: "",
      album: {
        name: "",
        cover: "",
      },
      duration: 0,
      progress: 0,
    },
    playing: false,
    search: "",
  },
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setCover: (state, action) => {
      state.songDetails.album.cover = action.payload;
    },
    setDuration: (state, action) => {
      state.songDetails.duration = action.payload;
    },
    setProgress: (state, action) => {
      state.songDetails.progress = action.payload;
    },
    setSongDetails: (state, action) => {
      state.songDetails = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const {
  setFile,
  setIsPlaying,
  setCover,
  setDuration,
  setProgress,
  setSongDetails,
  setSearch,
} = tuneSlice.actions;

export default tuneSlice.reducer;
