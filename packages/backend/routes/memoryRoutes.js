const express = require('express');
const { saveGameData, getGameHistory } = require('../controllers/memoryController');
const { validateSaveGameData, validateGetGameHistory } = require('../validators/memoryValidator');
const router = express.Router();

// Route to save game data
router.post('/save', validateSaveGameData, saveGameData);
router.get('/history', validateGetGameHistory, getGameHistory);

module.exports = router;

