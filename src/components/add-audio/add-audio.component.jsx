import React, { useContext, useRef, useState } from "react";
import { AudioContext } from "../../context/audio-context";
import "./add-audio.component.css"; // Import your CSS file

const AddAudio = () => {

  
  const [isPopupVisible, setPopupVisible] = useState(false);
  const {handleFileChange} = useContext(AudioContext);

  const audioInputRef = useRef(null);

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const onhandleChange = () => {
    handleFileChange(audioInputRef);
  }


  return (
    <div className="app-container">
      <button className="btn" onClick={openPopup}>Add</button>

      {isPopupVisible && <div className="popup-form">
      <label htmlFor="audioFileInput">Choose an audio file:</label>
      <input
        type="file"
        id="audioFileInput"
        ref={audioInputRef}
        accept="audio/mp3"
        onChange={onhandleChange}
      />
      <button onClick={closePopup}>Close</button>
     </div>}
    </div>
  );
};

export default AddAudio;