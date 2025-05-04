import React, { useState, useEffect } from 'react';
import styles from './Room3.module.css'; 
import runestoneNormal from '../assets/images/runestone.png'; 
import runestoneLit from '../assets/images/runestone_lit.png'; 
import ambientSound from '../assets/audio/ambient.mp3'; 
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const correctRunes = 'ᚨᚾᛁᚱᛁᛋᛏᛖᛋᛏᛖᚾᛏᚨᚾᛋᛁᚨᚠᛏᚨᛋᚲᛁᛚ'; // sample rune sentence

const runeKeyboard = [
  'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ',
  'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ',
  'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'
];

export default function Room3() {
  const { playerName } = usePlayer();
  const [stage, setStage] = useState(1);
  const [litStone, setLitStone] = useState(false);
  const [inputRunes, setInputRunes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setIntroVisible(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const audio = new Audio(ambientSound);
    audio.loop = true;
    audio.volume = 0.4;
    audio.play();
    return () => audio.pause();
  }, []);

  const handleStoneClick = () => {
    if (stage === 1) {
      setLitStone(true);
      setTimeout(() => setStage(2), 1500);
    }
  };

  const handleRuneClick = (rune) => {
    setInputRunes(prev => prev + rune);
  };

  const handleClear = () => {
    setInputRunes('');
  };

  const handleSubmit = () => {
    if (inputRunes.replace(/\s/g, '') === correctRunes) {
      setCompleted(true);
    }
  };

  const handleNextRoom = () => {
    navigate('/room4');
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.playerInfo}>
          <strong>Player: {playerName}</strong> | Time: {formattedTime}
        </div>
        <h1 className={styles.title}>Viking Rune Stone Puzzle</h1>
      </div>

      {introVisible && (
        <div className={styles.introFade}>
          <p>
            You have entered a dimly lit burial chamber, with runestones and artifacts surrounding you. <br />
            The challenge: Reveal the glowing stone and translate its runes.
          </p>
        </div>
      )}

      {completed ? (
        <div className={styles.completed}>
          <div className={styles.success}>You've translated the runes correctly!</div>
          <button className={styles.button} onClick={handleNextRoom}>Proceed to Next Room</button>
        </div>
      ) : (
        <>
          <div className={styles.instructions}>
            <p><strong>Stage {stage}:</strong> {stage === 1 ? 'Click the rune stone to reveal the hidden runes' : 'Translate the rune sentence'}</p>
          </div>

          <div className={styles.runestoneImage} onClick={handleStoneClick}>
            <img
              src={litStone ? runestoneLit : runestoneNormal}
              alt="Runestone"
              className={`${styles.image} ${litStone ? styles.fadeIn : ''}`}
            />
          </div>

          {stage === 2 && (
            <div className={styles.translationSection}>
              <p>Use the rune keyboard to type the sentence inscribed on the stone:</p>
              <div className={styles.inputBox}>{inputRunes}</div>

              <div className={styles.runeKeyboard}>
                {runeKeyboard.map((rune, index) => (
                  <button key={index} className={styles.runeKey} onClick={() => handleRuneClick(rune)}>
                    {rune}
                  </button>
                ))}
              </div>

              <div className={styles.controls}>
                <button className={styles.button} onClick={handleClear}>Clear</button>
                <button className={styles.button} onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
