// Include Express to Our Web App
const express = require('express');
const router = express.Router();

// Get Speaker Route
const speakersRoute = require('./speakers');

// Get Feedback Route
const feedbackRoute = require('./feedback');

// Export Route
module.exports = (param) => {
    // Put The Param in The Speaker Service
    const { speakerService } = param;

    router.get('/', async(req, res, next) => {
        const speakersList = await speakerService.getListShort();
        
        res.render('index', {
            page: 'Home',
            speakersList
        });
    });

    // Use Speaker Route
    router.use('/speakers', speakersRoute(param));
    // Use Feedback Route
    router.use('/feedback', feedbackRoute(param));

    // If We Don't Return Router, It Will Return Error
    return router;
};