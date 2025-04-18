import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";
import ambientSound from "../assets/audio/ambient.mp3";
import styles from "./StartScreen.module.css";

export default function StartScreen() {
  const navigate = useNavigate();
  const { setPlayerName } = usePlayer();
  const [input, setInput] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    if (input.trim() !== "") {
      setPlayerName(input);
      navigate("/room1");
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const newState = !prev;
      if (newState) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return newState;
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src={ambientSound} loop />

      <div className={styles.glowOverlay}></div>

      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Artifact Escape Room</h1>
        </div>

        <p className={styles.description}>
          Step into the past and uncover lost secrets from the Iron age, the Roman Empire, and the Viking era.
        </p>

        <input
          type="text"
          placeholder="Enter your name, explorer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleStart} className={styles.button}>
          Start Your Journey
        </button>

<br />
<br />

        <button onClick={toggleAudio} className={styles.audioButton}>
          {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
      </div>
    </div>
  );
}
