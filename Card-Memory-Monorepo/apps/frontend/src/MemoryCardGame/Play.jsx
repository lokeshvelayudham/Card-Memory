import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import backgroundGif from "../assets/images/play.gif";
import calmBackground from "../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../assets/audio/background-music.mp3";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import buttonClickSound from "../assets/audio/button-click.mp3";
import { X } from "lucide-react";
import "./Play.css";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};



const Play = () => {
  const navigate = useNavigate();
  const [SettingsmodalIsOpen, setModalSettingIsOpen] = useState(false);
  const [PlaymodalIsOpen, setModalPlayIsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [isCalmMode, setIsCalmMode] = useState(false);

  const modalPlayStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      backgroundColor: isCalmMode ? "rgba(134, 161, 125, 0.9)" : "rgba(30, 30, 46, 0.95)",
      border: `2px solid ${isCalmMode ? "#8b8f80" : "#4a4e69"}`,
      borderRadius: "20px",
      padding: "40px",
      maxWidth: "600px",
      width: "90%",
      color: "#fff",
      textAlign: "center",
      position: "relative",
      boxShadow: `0 0 30px ${isCalmMode ? "rgba(139, 143, 128, 0.5)" : "rgba(74, 78, 105, 0.7)"}`,
      backdropFilter: "blur(5px)",
      animation: "modalEntrance 0.4s ease-out",
    },
  };

  const [bgVolume, setBgVolume] = useState(
    localStorage.getItem("bgVolume") !== null ? parseInt(localStorage.getItem("bgVolume"), 10) : 50
  );
  const [sfxVolume, setSfxVolume] = useState(
    localStorage.getItem("sfxVolume") !== null ? parseInt(localStorage.getItem("sfxVolume"), 10) : 50
  );

  const [mutedBg, setMutedBg] = useState(false);
  const [mutedSfx, setMutedSfx] = useState(false);

  const bgAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic);
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);

    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true;
    bgAudio.volume = bgVolume / 100;

    const startMusic = () => {
      bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
    };

    document.addEventListener("click", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume / 100;
    }
    localStorage.setItem("bgVolume", bgVolume);
  }, [bgVolume]);

  useEffect(() => {
    hoverAudioRef.current.volume = sfxVolume / 100;
    clickAudioRef.current.volume = sfxVolume / 100;
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

  const handleBgVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setBgVolume(newVolume);
    setMutedBg(newVolume === 0);
  };

  const handleSfxVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setSfxVolume(newVolume);
    setMutedSfx(newVolume === 0);
  };

  const toggleCalmMode = () => {
    setIsCalmMode((prev) => !prev);
    playClickSound();
  };

  const playHoverSound = () => {
    hoverAudioRef.current.currentTime = 0;
    hoverAudioRef.current.play().catch((error) =>
      console.error("Hover sound playback failed:", error)
    );
  };

  const playClickSound = () => {
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch((error) =>
      console.error("Click sound playback failed:", error)
    );
  };

  const SettingopenModal = () => {
    setModalSettingIsOpen(true);
    playClickSound();
  };

  const SettingcloseModal = () => {
    setModalSettingIsOpen(false);
    playClickSound();
  };

  const PlayopenModal = () => {
    playClickSound();
    setModalPlayIsOpen(true);
  };

  const PlaycloseModal = () => {
    playClickSound();
    setModalPlayIsOpen(false);
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
  };

  const handlePlay = () => {
    playClickSound();
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("UserID is missing. Please log in again.");
      return;
    }
    localStorage.setItem("gameStarted", "true");

    if (isCalmMode) {
      if (difficulty === "red") {
        navigate("/calm-hard");
      } else if (difficulty === "yellow") {
        navigate("/calm-medium");
      } else if (difficulty === "green") {
        navigate("/calm-easy");
      } else {
        alert(`Selected difficulty: ${difficulty}`);
      }
    } else {
      if (difficulty === "red") {
        navigate("/memory-card-game");
      } else if (difficulty === "yellow") {
        navigate("/medium");
      } else if (difficulty === "green") {
        navigate("/easy");
      } else {
        alert(`Selected difficulty: ${difficulty}`);
      }
    }
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
      }}
    >
      <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
        WonderCards
      </h1>

      <div className="button-container">

        {/* play  */}
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={PlayopenModal}
          onMouseEnter={playHoverSound}
        >
          Play
        </button>

        {/* Instructions page */}
        {/* <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            alert("Instructions coming soon!");
          }}
          onMouseEnter={playHoverSound}
        >
          Instructions
        </button> */}

          {/* Settings modal */}
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={SettingopenModal}
          onMouseEnter={playHoverSound}
        >
          Settings
        </button>

        {/* History page */}
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            navigate('/history');
          }}
          onMouseEnter={playHoverSound}
        >
          Game History
        </button>

          {/* logout */}
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            navigate('/logout');
          }}
          onMouseEnter={playHoverSound}
        >
          Logout
        </button>
      </div>
      <Modal
        isOpen={SettingsmodalIsOpen}
        onRequestClose={SettingcloseModal}
        style={{
          ...modalStyles,
          content: {
            ...modalStyles.content,
            backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
            color: isCalmMode ? "#ffffff" : "#fff",
          },
        }}
      >
        <button
          onClick={SettingcloseModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={24} />
        </button>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Background Music
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedBg ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={bgVolume}
            onChange={handleBgVolumeChange}
            className="volume-slider"
          />
        </div>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Sound Effects
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedSfx ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSfxVolumeChange}
            className="volume-slider"
          />
        </div>
      </Modal>

      <Modal
        isOpen={PlaymodalIsOpen}
        onRequestClose={PlaycloseModal}
        style={modalPlayStyles}
        ariaHideApp={false}
      >
        <button
          onClick={PlaycloseModal}
          className="modal-close-button"
          onMouseEnter={playHoverSound}
        >
          <X size={24} />
        </button>

        <h2 className="difficulty-title">
          {isCalmMode ? "Select Peaceful Mode" : "Select Cosmic Challenge"}
        </h2>

        <div className="difficulty-description">
          {isCalmMode
            ? "Choose your relaxation level"
            : "Choose your interstellar challenge level"}
        </div>

        <div className="difficulty-grid">
          <button
            onClick={() => {
              handleDifficultySelect("green");
              playClickSound();
            }}
            className={`difficulty-card ${difficulty === "green" ? "selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            <div className="difficulty-icon">
              {isCalmMode ? "🌿" : "🌌"}
            </div>
            <h3>Easy</h3>
            <p>{isCalmMode ? "Gentle pace" : "4x4 grid"}</p>
            <div className="difficulty-glow"></div>
          </button>

          <button
            onClick={() => {
              handleDifficultySelect("yellow");
              playClickSound();
            }}
            className={`difficulty-card ${difficulty === "yellow" ? "selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            <div className="difficulty-icon">
              {isCalmMode ? "🍃" : "✨"}
            </div>
            <h3>Medium</h3>
            <p>{isCalmMode ? "Balanced flow" : "6x6 grid"}</p>
            <div className="difficulty-glow"></div>
          </button>

          <button
            onClick={() => {
              handleDifficultySelect("red");
              playClickSound();
            }}
            className={`difficulty-card ${difficulty === "red" ? "selected" : ""}`}
            onMouseEnter={playHoverSound}
          >
            <div className="difficulty-icon">
              {isCalmMode ? "🌊" : "🌠"}
            </div>
            <h3>Hard</h3>
            <p>{isCalmMode ? "Engaging focus" : "8x8 grid"}</p>
            <div className="difficulty-glow"></div>
          </button>
        </div>

        <button
          onClick={handlePlay}
          className="accept-button"
          disabled={!difficulty}
          onMouseEnter={playHoverSound}
        >
          {difficulty ? "Launch Mission" : "Select Difficulty"}
        </button>
      </Modal>




    </div>
  );
};

export default Play;
