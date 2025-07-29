import FilesList from "@renderer/components/FilesList";
import SongList from "@renderer/components/SongList";

export default function App() {
  return (
    <>
      <SongList />
      <div className="hidden">
        <FilesList />
      </div>
    </>
  );
}
