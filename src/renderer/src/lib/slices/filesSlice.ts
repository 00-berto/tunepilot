import { createSlice } from "@reduxjs/toolkit";

export const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [
      {
        path: "",
        name: "",
        artist: "",
        album: {
          name: "",
          cover: "",
        },
      },
    ],
    loading: false,
    loadedFiles: 0,
    fileCount: 0,
  },
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFiles: (state, action) => {
      state.files.push(...action.payload);
    },
    removeEmptyFirstFile: (state) => {
      const first = state.files[0];
      if (
        first &&
        first.path === "" &&
        first.name === "" &&
        first.artist === "" &&
        first.album &&
        first.album.name === "" &&
        first.album.cover === ""
      ) {
        state.files.shift();
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoadedFileCount: (state, action) => {
      state.loadedFiles = action.payload;
    },
    setFileCount: (state, action) => {
      state.fileCount = action.payload;
    },
    incrementLoadedFileCount: (state) => {
      state.loadedFiles = state.loadedFiles + 1;
    },
  },
});

export const {
  setFiles,
  addFiles,
  removeEmptyFirstFile,
  setLoading,
  setLoadedFileCount,
  setFileCount,
  incrementLoadedFileCount,
} = filesSlice.actions;
export default filesSlice.reducer;
