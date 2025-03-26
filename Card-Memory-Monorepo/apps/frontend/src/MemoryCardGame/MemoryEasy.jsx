/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import background from "../assets/images/mode1.gif";
import bgMusic from "../assets/audio/memory-bg.mp3";
import axios from "axios";

const defaultDifficulty = "Easy";

// Card Images
const cardImages = [
  { id: 1, image: "/images/meteor.png" },
  { id: 2, image: "/images/meteor.png" },
  { id: 3, image: "/images/comet.png" },
  { id: 4, image: "/images/comet.png" },
];


// Audio files for matching and final congratulation
const matchAudioFiles = [
  "/audio/wonderful.mp3",

];
const congratsAudio = "/audio/congrats.mp3";

// Preload audio
const audioCache = {};
matchAudioFiles.forEach(file => {
  audioCache[file] = new Audio(file);
});
const congratsSound = new Audio(congratsAudio);

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const saveGameData = async (gameData) => {
  try {
    const response = await axios.post("http://localhost:3000/api/memory/save", gameData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Game data saved successfully", response.data);
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message);
  }
};

// Styled Components
const StyledGameContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mouseDisabled',
})(({ theme, mouseDisabled }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  pointerEvents: mouseDisabled ? "none" : "auto",
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const PixelBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "10%",
  left: "1%",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  marginBottom: "10px",
}));

const PixelTimerBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "5%",
  left: "1%",
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
}));

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "220px",
  height: "220px",
  transformStyle: "preserve-3d",
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.5s ease",
  willChange: "transform",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "80%",
  height: "80%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "90%",
  height: "90%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#2c2c54',
  border: '2px solid #00d9ff',
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
};

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '24px',
  color: '#fff',
  letterSpacing: '1px',
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,
}));

const PixelButtonModal = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Optimized Card Component
// eslint-disable-next-line react/display-name
const Card = React.memo(({ card, handleClick, flipped, matched, disabled }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { 
      tension: 250,
      friction: 20,
      precision: 0.01
    },
  });

  return (
    <CardContainer 
      onClick={() => !disabled && handleClick(card)}
      sx={{ 
        pointerEvents: disabled ? "none" : "auto",
        opacity: matched ? 0.5 : 1 // Visual indication for matched cards
      }}
    >
      <CardInner style={{ transform }}>
        <CardFront>
          <img 
            src={card.image} 
            alt="Card front" 
            style={{ 
              width: "140%", 
              height: "140%",
              userSelect: "none",
              pointerEvents: "none"
            }} 
          />
        </CardFront>
        <CardBack>
          <img 
            src="/images/Back2.png" 
            alt="Card back" 
            style={{ 
              width: "120%", 
              height: "120%",
              userSelect: "none",
              pointerEvents: "none"
            }} 
          />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
});

const MemoryEasy = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0);
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // Memoize shuffled cards
  const shuffledCards = useMemo(() => shuffleArray(cardImages), []);

  // Optimized card click handler
  const handleCardClick = useCallback((card) => {
    // Early returns for invalid cases
    if (
      mouseDisabled ||
      matchedCards.includes(card.id) || 
      flippedCards.some(c => c.id === card.id) || 
      flippedCards.length >= 2 
    ) {
      return;
    }
    
    setFlippedCards(prev => [...prev, card]);
  }, [flippedCards, matchedCards, mouseDisabled]);


  // Play match sound
  const playMatchSound = useCallback(() => {
    if (audioIndex < matchAudioFiles.length) {
      const audio = audioCache[matchAudioFiles[audioIndex]];
      audio.volume = sfxVolume / 100;
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play error:", e));
      setAudioIndex(prev => (prev + 1) % matchAudioFiles.length);
    }
  }, [audioIndex, sfxVolume]);

  const [cardsDisabled, setCardsDisabled] = useState(false);

  // Update checkForMatch to disable cards during flip animation
  const checkForMatch = useCallback(() => {
    if (flippedCards.length !== 2) return;
  
    setMouseDisabled(true); // Disable clicks during animation
  
    const [card1, card2] = flippedCards;
    const isMatch = card1.image === card2.image;
  
    setTimeout(() => {
      if (isMatch) {
        setMatchedCards(prev => [...prev, card1.id, card2.id]);
        playMatchSound();
      } else {
        setFailedAttempts(prev => prev + 1);
      }
      
      // Clear flipped cards and re-enable interaction
      setFlippedCards([]);
      setMouseDisabled(false);
    }, 800); // Match this with your flip animation duration
  }, [flippedCards, playMatchSound]);

  const handleSaveNewGame = () => {
    saveGameData({
      userID: localStorage.getItem("userID"),
      gameDate: new Date(),
      failed: failedAttempts,
      difficulty: defaultDifficulty,
      completed: 0,
      timeTaken: timer,
    });
  };

  useEffect(() => {
    checkForMatch();
  }, [flippedCards, checkForMatch]);

  const handleNewGame = () => {
    setCards(shuffledCards);
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);

    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
    }, 2000);

    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
    }, 1500);
  };

  const handleBackButton = () => {
    setOpenModal(true);
  };

  const handleModalYes = () => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  const handleModalNo = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current.play().catch((error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      console.log('Game completed - matched:', matchedCards);
    console.log('Total cards:', cards.length);

      congratsSound.volume = sfxVolume / 100;
      congratsSound.play();
      setTimerActive(false);

      const saveData = async () => {
        try {
          console.log('Saving game data...');
          await saveGameData({
            userID: localStorage.getItem("userID"),
            gameDate: new Date(),
            failed: failedAttempts,
            difficulty: defaultDifficulty,
            completed: 1,
            timeTaken: timer,
          });
          localStorage.setItem("gameCompleted", "true");
          console.log('Navigating to /congt-easy');

          navigate("/congt-easy");
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer]);

 
  // Update card rendering with disabled prop
  const renderCards = useMemo(() => (
    <Grid container spacing={6} justifyContent="center" sx={{ maxWidth: 600, marginTop: "-80px" }}>
      {cards.map((card) => (
        <Grid item xs={6} key={`card-${card.id}`}>
          <Card
            card={card}
            handleClick={handleCardClick}
            flipped={initialReveal || flippedCards.some(c => c.id === card.id)}
            matched={matchedCards.includes(card.id)}
            disabled={
              mouseDisabled || 
              (flippedCards.length >= 2 && !flippedCards.some(c => c.id === card.id))
            }
          />
        </Grid>
      ))}
    </Grid>
  ), [cards, flippedCards, matchedCards, initialReveal, handleCardClick, mouseDisabled]);

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton onClick={handleBackButton} sx={{ alignSelf: "flex-start", margin: 2 }}>
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      
      {renderCards}
      
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }} sx={{ mt: 2 }}>
          New Game
        </PixelButton>
      </Box>

      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal onClick={() => { handleSaveNewGame(); handleModalYes(); }} variant="contained" color="primary">
              Yes
            </PixelButtonModal>
            <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryEasy;