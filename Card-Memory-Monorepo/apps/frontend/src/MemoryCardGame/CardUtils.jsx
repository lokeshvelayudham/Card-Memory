// // Utility functions for card games
// export const CardUtils = {
//     /**
//      * Shuffles an array of cards
//      * @param {Array} array - Array of cards to shuffle
//      * @returns {Array} Shuffled array
//      */
//     shuffleArray: (array) => {
//       const shuffledArray = [...array];
//       for (let i = shuffledArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//       }
//       return shuffledArray;
//     },
  
//     /**
//      * Initializes card images for different difficulty levels
//      * @param {string} difficulty - 'Easy', 'Medium', 'Hard'
//      * @returns {Array} Array of card objects
//      */
//     getCardImages: (difficulty) => {
//       const baseCards = [
//         { id: 1, image: '/images/earth.png' },
//         { id: 2, image: '/images/jupiter.png' },
//         { id: 3, image: '/images/mars.png' },
//         { id: 4, image: '/images/mercury.png' },
//         { id: 5, image: '/images/neptune.png' },
//         { id: 6, image: '/images/saturn.png' },
//         { id: 7, image: '/images/meteor.png' },
//         { id: 8, image: '/images/comet.png' }
//       ];
  
//       switch(difficulty) {
//         case 'Easy':
//           return [
//             ...baseCards.slice(0, 2).flatMap(card => [card, {...card, id: card.id + 10}]),
//             ...baseCards.slice(2, 4).flatMap(card => [card, {...card, id: card.id + 10}])
//           ];
//         case 'Medium':
//           return [
//             ...baseCards.slice(0, 4).flatMap(card => [card, {...card, id: card.id + 10}]),
//             ...baseCards.slice(4, 6).flatMap(card => [card, {...card, id: card.id + 10}])
//           ];
//         case 'Hard':
//         default:
//           return baseCards.flatMap(card => [card, {...card, id: card.id + 10}]);
//       }
//     },
  
//     /**
//      * Checks if two flipped cards match
//      * @param {Array} flippedCards - Array of currently flipped cards
//      * @returns {boolean} True if cards match
//      */
//     checkForMatch: (flippedCards) => {
//       if (flippedCards.length !== 2) return false;
//       return flippedCards[0].image === flippedCards[1].image;
//     },
  
//     /**
//      * Generates initial game state
//      * @param {string} difficulty - Game difficulty level
//      * @returns {Object} Initial game state
//      */
//     initializeGameState: (difficulty) => {
//       const cardImages = CardUtils.getCardImages(difficulty);
//       return {
//         cards: CardUtils.shuffleArray(cardImages),
//         flippedCards: [],
//         matchedCards: [],
//         failedAttempts: 0,
//         timer: 0,
//         timerActive: false,
//         initialReveal: true
//       };
//     },
  
//     /**
//      * Handles card click logic
//      * @param {Object} card - Clicked card
//      * @param {Object} gameState - Current game state
//      * @param {Function} setGameState - State setter function
//      */
//     handleCardClick: (card, gameState, setGameState) => {
//       const { flippedCards, matchedCards } = gameState;
      
//       if (
//         matchedCards.includes(card.id) || 
//         flippedCards.some(c => c.id === card.id) ||
//         flippedCards.length >= 2
//       ) {
//         return;
//       }
      
//       setGameState(prev => ({
//         ...prev,
//         flippedCards: [...prev.flippedCards, card]
//       }));
//     }
//   };
  
//   // Audio utilities
//   export const AudioUtils = {
//     /**
//      * Preloads audio files
//      * @param {Array} audioFiles - Array of audio file paths
//      * @returns {Object} Audio cache object
//      */
//     preloadAudio: (audioFiles) => {
//       const cache = {};
//       audioFiles.forEach(file => {
//         cache[file] = new Audio(file);
//       });
//       return cache;
//     },
  
//     /**
//      * Plays a sound from the audio cache
//      * @param {string} file - Audio file path
//      * @param {Object} audioCache - Preloaded audio cache
//      * @param {number} volume - Volume level (0-1)
//      */
//     playSound: (file, audioCache, volume = 0.5) => {
//       if (audioCache[file]) {
//         const audio = audioCache[file];
//         audio.volume = volume;
//         audio.currentTime = 0;
//         audio.play().catch(e => console.error("Audio play error:", e));
//       }
//     }
//   };