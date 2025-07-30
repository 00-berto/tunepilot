import { MinusIcon, SearchIcon, SquareIcon, XIcon } from "lucide-react";
import { setSearch } from "@renderer/lib/slices/tuneSlice";
import { useDispatch } from "react-redux";

export default function TitleBar() {
  const dispatch = useDispatch();

  return (
    <div
      className={"flex flex-row items-center justify-between relative h-1/16"}
    >
      <div className="text-xl text-dominant-dynamic/60 font-bold w-full flex flex-row items-center justify-start">
        tunepilot
      </div>

      <div className="w-full titlebar flex items-center justify-center h-full">
        <div className="no-titlebar relative w-full backdrop-blur-xl rounded-md h-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-dominant-foreground">
            <SearchIcon className={"size-6 stroke-2"} aria-hidden="true" />
          </div>
          <input
            type={"text"}
            name={"search"}
            id={"search"}
            autoComplete={"off"}
            onChange={(e) => {
              dispatch(setSearch(e.target.value));
            }}
            placeholder={"Search anything..."}
            className={
              "outline outline-hidden w-full h-full rounded-md p-2 px-10 text-dominant-foreground placeholder:text-dominant-foreground/80 bg-dominant-background/40 focus-visible:ring-[3px] ring-ring/50 flex flex-row gap-1 items-center justify-start transition-all ease-out duration-100"
            }
          />
          {/*<AnimatePresence mode={"wait"} initial={false}>*/}
          {/*  {showClearButton && (*/}
          {/*    <motion.button*/}
          {/*      variants={variants}*/}
          {/*      initial={"open"}*/}
          {/*      animate={"open"}*/}
          {/*      exit={"closed"}*/}
          {/*      type="button"*/}
          {/*      onClick={clearInput}*/}
          {/*      className="absolute inset-y-0 right-0 flex items-center pr-2 origin-center"*/}
          {/*    >*/}
          {/*      <XIcon*/}
          {/*        className="size-6 text-black/50 dark:text-white/50 stroke-2 p-0.5 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-all ease-out duration-100"*/}
          {/*        aria-hidden="true"*/}
          {/*      />*/}
          {/*    </motion.button>*/}
          {/*  )}*/}
          {/*</AnimatePresence>*/}
        </div>
      </div>

      <div className="w-full h-full titlebar flex items-center justify-end">
        <div className="flex flex-row rounded-md bg-dominant-background/40 text-dominant-foreground overflow-hidden h-full no-titlebar">
          <button
            onClick={() => window.api.minimize()}
            className={
              "hover:bg-dominant-background/40 w-auto p-2 transition-all ease-out duration-75"
            }
          >
            <MinusIcon className={"size-full"} />
          </button>

          <button
            onClick={() => window.api.maximize()}
            className={
              "hover:bg-dominant-background/40 p-2.5 transition-all ease-out duration-75"
            }
          >
            <SquareIcon className={"size-full"} />
          </button>

          <button
            onClick={() => window.api.close()}
            className={
              "hover:bg-red-500 p-2 transition-all ease-out duration-75"
            }
          >
            <XIcon className={"size-full"} />
          </button>
        </div>
      </div>
    </div>
  );
}
