import React, { useState, useEffect } from 'react';
import styles from './Room2.module.css';
import mosaicImage from '../assets/images/mosaic.jpeg';
import ambientSound from "../assets/audio/ambient.mp3";
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const createShuffledPieces = (size) => {
  const pieces = Array.from({ length: size * size }, (_, i) => i);
  return pieces.sort(() => Math.random() - 0.5);
};

export default function Room2() {
  const { playerName } = usePlayer();
  const [round, setRound] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [pieces, setPieces] = useState(createShuffledPieces(3));
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [time, setTime] = useState(0);
  const [lockedRows, setLockedRows] = useState([]);
  const [showDescription, setShowDescription] = useState(false); // Add state for showing description
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const audio = new Audio(ambientSound);
    audio.loop = true;
    audio.volume = 0.4;
    audio.play();
    return () => audio.pause();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setIntroVisible(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (pieces.every((piece, i) => piece === i)) {
      setCompleted(true);
    }
  }, [pieces]);

  const isRowCorrect = (rowIndex) => {
    for (let col = 0; col < gridSize; col++) {
      const index = rowIndex * gridSize + col;
      const expected = index;

      const isLastRow = rowIndex === gridSize - 1;
      const isLastTile = col === gridSize - 1;
      const isEmptyTile = pieces[index] === gridSize * gridSize - 1;

      if (round === 2 && isLastRow && isLastTile && isEmptyTile) {
        continue;
      }

      if (pieces[index] !== expected) {
        return false;
      }
    }
    return true;
  };

  const handlePieceClick = (index) => {
    if (round === 1) {
      if (selected === null) {
        setSelected(index);
      } else {
        const newPieces = [...pieces];
        [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
        setPieces(newPieces);
        setSelected(null);
      }
    } else {
      const emptyIndex = pieces.indexOf(pieces.length - 1);

      const isAdjacent = (i1, i2) => {
        const row1 = Math.floor(i1 / gridSize), col1 = i1 % gridSize;
        const row2 = Math.floor(i2 / gridSize), col2 = i2 % gridSize;
        return (
          (row1 === row2 && Math.abs(col1 - col2) === 1) ||
          (col1 === col2 && Math.abs(row1 - row2) === 1)
        );
      };

      if (isAdjacent(index, emptyIndex)) {
        const newPieces = [...pieces];
        [newPieces[emptyIndex], newPieces[index]] = [newPieces[index], newPieces[emptyIndex]];
        setPieces(newPieces);
      }
    }
  };

  const startRoundTwo = () => {
    setRound(2);
    setGridSize(4);
    const newPieces = createShuffledPieces(4);
    if (newPieces[newPieces.length - 1] !== newPieces.length - 1) {
      const idx = newPieces.indexOf(newPieces.length - 1);
      [newPieces[idx], newPieces[newPieces.length - 1]] = [newPieces[newPieces.length - 1], newPieces[idx]];
    }
    setPieces(newPieces);
    setLockedRows([]);
    setCompleted(false);
  };

  const handleNextRoom = () => {
    navigate('/room3');
  };

  const handleGiveUp = () => {
    // Reset the state to the initial state of Round 2
    setRound(2);
    setGridSize(4);
    const newPieces = createShuffledPieces(4);
    if (newPieces[newPieces.length - 1] !== newPieces.length - 1) {
      const idx = newPieces.indexOf(newPieces.length - 1);
      [newPieces[idx], newPieces[newPieces.length - 1]] = [newPieces[newPieces.length - 1], newPieces[idx]];
    }
    setPieces(newPieces);
    setCompleted(false);
    setLockedRows([]);

    // Show description page
    setShowDescription(true);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const tileSize = round === 2 ? 120 : 160;
  const bgSize = round === 2 ? `${tileSize * 4}px ${tileSize * 4}px` : '480px 480px';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.playerInfo}>
          <strong>Player: {playerName}</strong> | Time: {formattedTime}
        </div>
        <h1 className={styles.title}>Roman Empire: Villa</h1>
      </div>

      {showDescription ? (
  <div className={styles.descriptionPage}>
    <div className={styles.text}>
      <h2>The Triad of Empire - Artist Unknown</h2> 
        <p>
        This mosaic once adorned the entryway of a magistrate's villa, capturing a powerful story through the figures of <span className={styles.highlight}>Hope</span>, <span className={styles.highlight}>Virtue</span>, and the <span className={styles.highlight}>Defeated</span>. The Romans believed such art had the power to guard a household, ensuring prosperity by maintaining balance - an optimistic future forged through strength, and protected by the ability to subdue chaos.
      </p>
      <p>
      The central figure, a woman holding a golden staff, symbolizes <span className={styles.highlight}>Hope</span>. To her left, a young woman with a golden symbol represents <span className={styles.highlight}>Virtue</span>, while an older man on the right, captured in motion, embodies <span className={styles.highlight}>the Defeated</span>.
      </p>
    </div>
    <div className={styles.image}>
      <img src={mosaicImage} alt="Full Mosaic" style={{ width: '100%', borderRadius: '10px' }} />
    </div>
  </div>
) : (
        <>
          {introVisible ? (
            <div className={styles.introFade}>
              <p>
                Italy, 100 CE. <br />
                You step into a lavish villa. <br />
                Fragments of a beautiful mosaic lie scattered across the floor.<br />
                Piece together history.
              </p>
            </div>
          ) : completed ? (
            round === 1 ? (
              <div className={styles.roundTransition}>
                <div className={styles.success}>You've restored the mosaic!</div>
                <button className={styles.button} onClick={startRoundTwo}>Continue</button>
              </div>
            ) : (
              <div className={styles.roundTransition}>
                <div className={styles.success}>You've completed the final challenge!</div>
                <button className={styles.button} onClick={handleNextRoom}>Continue to Room 3</button>
              </div>
            )
          ) : (
            <>
              <p className={styles.intro}>
                <strong>{round === 1 ? 'Reconstruct the Mosaic' : 'Sliding Puzzle Challenge'}</strong><br />
                {round === 1 ? 'Click two tiles to swap them. Restore the image to reveal the past.' : 'Slide the tiles to restore the image. The empty space can be used to move tiles. Rows snap into place when correct.'}
              </p>

              <div
                className={styles.mosaicGrid}
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
                  gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`
                }}
              >
                {pieces.map((piece, index) => {
                  const row = Math.floor(index / gridSize);
                  const isRowCompleted = isRowCorrect(row);
                  return (
                    <div
                      key={index}
                      className={`${styles.tile} ${round === 2 ? styles.small : ''} ${selected === index ? styles.selected : ''} ${isRowCompleted ? styles.completedRow : ''}`}
                      onClick={() => handlePieceClick(index)}
                      style={{
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                        visibility: piece === gridSize * gridSize - 1 && round === 2 ? 'hidden' : 'visible',
                        backgroundImage: `url(${mosaicImage})`,
                        backgroundSize: bgSize,
                        backgroundPosition: `${(piece % gridSize) * -tileSize}px ${(Math.floor(piece / gridSize)) * -tileSize}px`,
                      }}
                    />
                  );
                })}
              </div>

              {round === 2 && (
                <div className={styles.giveUpButtonContainer}>
                  <button className={styles.button} onClick={handleGiveUp}>Give Up</button>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Place the "Next Room" button outside the description page */}
      {showDescription && (
        <div className={styles.nextRoomButtonContainer}>
          <button className={styles.button} onClick={handleNextRoom}>Next room</button>
        </div>
      )}
    </div>
  );
}
