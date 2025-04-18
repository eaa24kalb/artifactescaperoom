import React, { useState, useEffect } from 'react';
import styles from './Room1.module.css';
import comb from '../assets/images/comb.jpeg';
import fireStriker from '../assets/images/fire-striker.png';
import urn from '../assets/images/urn.jpeg';
import fibula from '../assets/images/fibula.png';
import ambientSound from "../assets/audio/ambient.mp3";
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const artifacts = [
  {
    id: 'comb',
    name: 'Comb',
    description: 'Used for grooming hair.',
    fullDescription: 'A comb used in the Iron Age was often made of bone or wood and served not only as a grooming tool but also as a status symbol, signifying care for appearance and wealth.',
    meaning: 'Sign of personal care and status.',
    image: comb,
  },
  {
    id: 'fire-striker',
    name: 'Fire Striker',
    description: 'Used to start fires.',
    fullDescription: 'A fire striker typically consisted of a piece of iron used to create sparks when struck against steel, helping early civilizations light their fires.',
    meaning: 'Symbol of survival and warmth.',
    image: fireStriker,
  },
  {
    id: 'urn',
    name: 'Urn',
    description: 'Used as a burial container.',
    fullDescription: 'An urn in the Iron Age was made from clay or stone and used to store ashes of the dead, serving as a vessel for the departed in the afterlife.',
    meaning: 'Protection in the afterlife.',
    image: urn,
  },
  {
    id: 'fibula',
    name: 'Fibula',
    description: 'Used to fasten clothing.',
    fullDescription: 'A fibula was a clasp for fastening clothing, symbolizing wealth and fashion, often reflecting the owner’s status.',
    meaning: 'Sign of wealth and fashion.',
    image: fibula,
  },
];

export default function Room1() {
  const { playerName } = usePlayer();
  const [round, setRound] = useState(1);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState({});
  const [shake, setShake] = useState(false);
  const [time, setTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [carouselComplete, setCarouselComplete] = useState(false);
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
    const timeout = setTimeout(() => {
      setIntroVisible(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  const handleDrop = (e, artifactId) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    setMatches((prev) => ({ ...prev, [artifactId]: data }));
  };

  const handleDragStart = (e, data) => {
    e.dataTransfer.setData('text/plain', data);
  };

  const handleSubmit = () => {
    let allCorrect = true;
    const newFeedback = {};

    artifacts.forEach((artifact) => {
      const correct =
        (round === 1 && matches[artifact.id] === artifact.name) ||
        (round === 2 && matches[artifact.id] === artifact.meaning);
      if (!correct) {
        allCorrect = false;
      }
      newFeedback[artifact.id] = correct;
    });

    if (allCorrect) {
      setSubmitted(true);
      if (round === 1) {
        setTimeout(() => {
          setRound(2);
          setMatches({});
          setFeedback({});
          setSubmitted(false);
        }, 1000);
      } else if (round === 2) {
        setTimeout(() => {
          setShowCarousel(true);
        }, 1000);
      }
    } else {
      setFeedback(newFeedback);
      setShake(true);
      setTimeout(() => {
        setMatches({});
        setShake(false);
        setFeedback({});
        setSubmitted(false);
      }, 800);
    }
  };

  const handleNextCarousel = () => {
    const nextIndex = (carouselIndex + 1) % artifacts.length;
    if (nextIndex === 0 && carouselIndex === artifacts.length - 1) {
      setCarouselComplete(true);
    }
    setCarouselIndex(nextIndex);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((carouselIndex - 1 + artifacts.length) % artifacts.length);
  };

  const handleNextRoom = () => {
    navigate('/room2'); // Adjust to your actual route
  };

  const remainingTexts = artifacts
    .map((a) => (round === 1 ? a.name : a.meaning))
    .filter((text) => !Object.values(matches).includes(text));

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const getRoundText = () => {
    if (showCarousel) {
      return (
        <>
        Discover the story behind each artifact
        </>
      );
    }
  
    if (round === 1) {
      return (
        <>
          <strong>Artifact Identification</strong> <br />
          Old relics lie before you. Worn by time, but not forgotten <br />
          <br />
          Drag each artifact to its rightful name to reveal their secrets.
        </>
      );
    }
  
    if (round === 2) {
      return (
        <>
          <strong>Decoding the Burial Gifts</strong> <br />
          What do these items symbolize? <br />
          <br />
          Drag the correct description to each artifact.
        </>
      );
    }

    return '';
};

  return (
    <div className={`${styles.container} ${shake ? styles.shake : ''}`}>
      <div className={styles.header}>
        <div className={styles.playerInfo}>
          <strong>Player: {playerName}</strong> | Time: {formattedTime}
        </div>
        <h1 className={styles.title}>Iron Age: Grave Site</h1>
      </div>

      {introVisible ? (
        <div className={styles.introFade}>
          <p>
            Northern Europe, 500 BCE. <br /> 
            The wind howls across the moor.  
            Beneath your feet lies a burial site, long forgotten.  
            You feel a pull — as if the land itself wants you to listen...
          </p>
        </div>
      ) : (
        <p className={styles.intro}>{getRoundText()}</p>
      )}

      {!introVisible && (
        <>
          <div className={styles.burialScene}>
            {showCarousel ? (
              <div className={styles.carouselContainer}>
                <button className={styles.carouselButton} onClick={handlePrevCarousel}>Prev</button>
                <div className={styles.carouselItem}>
                  <img src={artifacts[carouselIndex].image} alt={artifacts[carouselIndex].name} className={styles.artifactImage} />
                  <div className={styles.carouselInfo}>
                    <h2>{artifacts[carouselIndex].name}</h2>
                    <p>{artifacts[carouselIndex].fullDescription}</p>
                  </div>
                </div>
                <button className={styles.carouselButton} onClick={handleNextCarousel}>Next</button>
              </div>
            ) : (
              artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className={`${styles.artifact} ${feedback[artifact.id] === false ? styles.shake : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, artifact.id)}
                >
                  <img src={artifact.image} alt={artifact.name} className={styles.artifactImage} />
                  <div className={styles.label}>
                    {matches[artifact.id] && <div className={styles.match}>{matches[artifact.id]}</div>}
                  </div>
                </div>
              ))
            )}
          </div>

          {!showCarousel && (
            <>
              <div className={styles.draggables}>
                {remainingTexts.map((text, i) => (
                  <div
                    key={i}
                    className={styles.draggable}
                    draggable
                    onDragStart={(e) => handleDragStart(e, text)}
                  >
                    {text}
                  </div>
                ))}
              </div>

              <button className={styles.button} onClick={handleSubmit}>
                {round === 2 ? 'Finish Puzzle' : 'Submit Answers'}
              </button>
            </>
          )}

          {submitted && !showCarousel && (
            <div className={styles.success}>
              Well done! You've completed the puzzle.
            </div>
          )}

          {carouselComplete && (
            <button className={styles.button} onClick={handleNextRoom}>
              Proceed to Next Room
            </button>
          )}
        </>
      )}
    </div>
  );
}
