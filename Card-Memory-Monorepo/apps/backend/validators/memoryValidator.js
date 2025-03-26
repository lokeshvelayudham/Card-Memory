const { body, query } = require('express-validator');

exports.validateSaveGameData = [
    body('userID').notEmpty().isString(),
    body('gameDate').optional().isISO8601(),
    body('failed').isNumeric(),
    body('difficulty').isIn(['Easy', 'Normal', 'Hard']),
    body('completed').isNumeric(),
    body('timeTaken').isNumeric()
];

exports.validateGetGameHistory = [
    query('userID').notEmpty().isString()
];