import "./audio-list.component.css";
import { AudioContext } from "../../context/audio-context";
import { useContext } from "react";

const AudioList = () => {
  const { playlist, setNowPlayingIndex } =
    useContext(AudioContext);

  return (
    <div className="list">
      {playlist.length > 0 ? (
        playlist.map((audio, index) => (
          <div className="audio" key={index}>
            <p onClick={() => setNowPlayingIndex(index)}>{audio.data.name}</p>
          </div>
        ))
      ) : (
        <div className="msg">
          <h3>No music! add some</h3>
        </div>
      )}
    </div>
  );
};

export default AudioList;
