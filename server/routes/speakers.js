// Include Express to Our Web App
const express = require('express');
const router = express.Router();

// Export Speaker Route
module.exports = (param) => {
    // Put The Param in The Speaker Service
    const { speakerService } = param;

    router.get('/', async(req, res, next) => {
        try {
            const [speakersList, artwork] = await Promise.all([
                speakerService.getList(),
                speakerService.getAllArtWork()
            ]);
            
            res.render('speakers', {
                page: 'All Speakers',
                speakersList: speakersList,
                artwork: artwork
            });
        } catch (error) {
            return next(error);
        }
    });

    router.get('/:name', async(req, res, next) => {
        try {
            const [speaker, artwork] = await Promise.all([
                speakerService.getSpeaker(req.params.name),
                speakerService.getArtworkForSpeaker(req.params.name)
            ]);

            if(!speaker) return next();

            res.render('speakers/detail', {
                page: req.params.name,
                speaker: speaker,
                artwork: artwork
            });
        } catch (error) {
            return next(error);
        }
    });
    
    // If We Don't Return Router, It Will Return Error
    return router;
};