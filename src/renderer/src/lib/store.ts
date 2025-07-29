import { configureStore } from "@reduxjs/toolkit";
import tuneReducer from "@renderer/lib/slices/tuneSlice";
import filesReducer from "@renderer/lib/slices/filesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tune: tuneReducer,
      files: filesReducer,
    },
  });
};
// Get the type of our store variable
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const store = makeStore();
