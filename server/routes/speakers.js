// Include Express to Our Web App
const express = require('express');
const router = express.Router();

// Export Speaker Route
module.exports = (param) => {
    // Put The Param in The Speaker Service
    const { speakerService } = param;

    router.get('/', async(req, res, next) => {
        const speakersList = await speakerService.getList();
        
        res.render('speakers', {
            page: 'All Speakers',
            speakersList
        });
    });

    router.get('/:name', (req, res, next) => {
        res.render('speakers/detail', {
            page: req.params.name
        });
    });

    // If We Don't Return Router, It Will Return Error
    return router;
};