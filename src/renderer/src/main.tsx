import "./assets/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "@renderer/lib/store";
import NowPlaying from "@renderer/components/NowPlaying";
import DynamicColorChanger from "@renderer/components/DynamicColorChanger";
import TitleBar from "@renderer/components/TitleBar";
import { Toaster } from "@renderer/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div
        className={
          "bg-dominant flex flex-col h-screen text-dominant-foreground p-3 gap-3 scrollbar-fix transition-all ease-out duration-500 tracking-tight leading-tight overflow-hidden"
        }
      >
        <TitleBar />
        <Toaster position={"bottom-right"} />

        <div className="flex h-full flex-row gap-3 overflow-hidden">
          <div className="flex h-full w-3/4 p-5 bg-dominant-background/40 rounded-lg overflow-auto scrollbar-fix">
            <App />
          </div>
          <div className="flex h-full w-1/4 p-5 bg-dominant-background/40 rounded-lg">
            <NowPlaying />
          </div>
        </div>
      </div>
      <div className="hidden">
        <DynamicColorChanger />
      </div>
    </Provider>
  </StrictMode>,
);
