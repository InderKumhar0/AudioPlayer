import React, { createContext, useState, useEffect, useRef } from "react";

export const AudioContext = createContext({
  handleFileChange: () => {},
  playlist: [],
  playAudio: () => {},
});

export const AudioProvider = ({ children }) => {
  const [nowPlayingIndex, setNowPlayingIndex] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const dbRef = useRef(null);

  if(nowPlayingIndex !== null) {
    localStorage.setItem('lastIndex', nowPlayingIndex);
  }

  useEffect(() => {
    const request = window.indexedDB.open("AudioDataBase", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      db.createObjectStore("audioFile", { autoIncrement: true });
    };

    request.onsuccess = (event) => {
      dbRef.current = event.target.result;
      fetchPlaylist();
    };

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.error);
    };
  }, []);

  const fetchPlaylist = () => {
    if (!dbRef.current) return;
    const transaction = dbRef.current.transaction(["audioFile"], "readonly");
    const objectStore = transaction.objectStore("audioFile");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = () => {
      setPlaylist(getAllRequest.result);
    };
  };

  console.log(playlist);

  const handleFileChange = (audioInputRef) => {
    const audioInput = audioInputRef.current;

    if (audioInput.files.length > 0) {
      const audioFile = audioInput.files[0];

      if (dbRef.current) {
        const transaction = dbRef.current.transaction(
          ["audioFile"],
          "readwrite"
        );
        const objectStore = transaction.objectStore("audioFile");

        const addRequest = objectStore.add({
          data: audioFile,
        });

        addRequest.onsuccess = () => {
          fetchPlaylist();
        };

        addRequest.onerror = (event) => {
          console.error("Error adding file to IndexedDB:", event.target.error);
        };
      }
      audioInput.value = null;
    }
  };

  const value = {
    playlist,
    handleFileChange,
    nowPlayingIndex,
    setNowPlayingIndex,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
