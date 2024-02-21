import "./audio-play.component.css";

import React, { useContext, useState, useRef, useEffect } from "react";
import { AudioContext } from "../../context/audio-context";

const AudioPlayer = () => {
  const { nowPlayingIndex, playlist, setNowPlayingIndex } =
    useContext(AudioContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      if (nowPlayingIndex !== null) {
        try {
          const audioFile = playlist[nowPlayingIndex].data;
          const src = URL.createObjectURL(audioFile);

          audioRef.current.src = src;
          await audioRef.current.play();
          setIsPlaying(true);
          audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
            setNowPlayingIndex((prevIndex) =>
              prevIndex < playlist.length - 1 ? prevIndex + 1 : 0
            );
            audioRef.current.src = null;
            setProgress(0);
          });
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      } else {
        setIsPlaying(false);
        audioRef.current.src = null;
        setProgress(0);
      }
    };

    playAudio();
  }, [nowPlayingIndex]);

  useEffect(() => {
    const updateProgress = () => {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progressPercentage = (current / duration) * 100;
      setProgress(progressPercentage);
    };

    const time = audioRef.current;

    time?.addEventListener("timeupdate", updateProgress);

    return () => {
      time?.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const playPauseHandler = async () => {
    if (playlist.length > 0) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await setNowPlayingIndex(localStorage.getItem("lastIndex") || 0);
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSongHandler = () => {
    if (playlist.length > 0) {
      setNowPlayingIndex((prevIndex) =>
        prevIndex < playlist.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const prevSongHandler = () => {
    if (playlist.length > 0) {
      setNowPlayingIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : playlist.length - 1
      );
    }
  };

  return (
    <div className="music-player">
      {
        <>
          <audio id="audiod" ref={audioRef} controls autoPlay />
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="controls">
            <button onClick={prevSongHandler}>&#9664;</button>
            <button onClick={playPauseHandler}>
              {isPlaying ? "\u275A\u275A" : "\u25B6"}
            </button>
            <button onClick={nextSongHandler}>&#9654;</button>
          </div>
        </>
      }
    </div>
  );
};

export default AudioPlayer;
