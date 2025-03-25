const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
        // More detailed validation
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
            gameDate: gameDate || new Date(), // Default to current date if not provided
            failed: failed || 0, // Default to 0 if not provided
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


exports.getGameHistory = async (req, res) => {
    const { userID } = req.query;

    try {
        if (!userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        const gameHistory = await Save.find({ userID })
            .sort({ gameDate: -1 }) // Sort by most recent first
            .limit(10); // Limit to 10 most recent entries

        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Error fetching game history', error });
    }
};