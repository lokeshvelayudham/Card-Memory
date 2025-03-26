const Save = require('../models/save');


// Save game Data
exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
        const missingFields = [];
        if (!userID) missingFields.push('userID');
        if (!gameDate) missingFields.push('gameDate');
        if (difficulty === undefined) missingFields.push('difficulty');
        if (completed === undefined) missingFields.push('completed');
        if (timeTaken === undefined) missingFields.push('timeTaken');

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields',
                missingFields: missingFields 
            });
        }

        const newSave = new Save({
            userID,
            gameDate: gameDate || new Date(), 
            failed: failed || 0, 
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

// Get game data
exports.getGameHistory = async (req, res) => {
    const { userID } = req.query;

    try {
        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const gameHistory = await Save.find({ userID })
            .sort({ gameDate: -1 }) // Sort by most recent first - Limit to 10  entries
            .limit(10); 

        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Error fetching game history', error });
    }
};