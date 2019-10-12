// Include Express to Our Web App
const express = require('express');
const router = express.Router();

// Export Feedback Route
module.exports = () => {
    router.get('/', (req, res, next) => {
        res.render('feedback', {
            page: 'Feedback'
        });
    });

    router.post('/', (req, res, next) => {
        res.send('Feedback Posted!');
    });

    // If We Don't Return Router, It Will Return Error
    return router;
};