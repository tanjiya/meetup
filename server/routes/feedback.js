const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { feedbackService } = param;

    router.get('/', async (req, res, next) => {
        try {
            const list = await feedbackService.getList();

            return res.render('feedback', {
                page: 'Feedback',
                list: list,
                success: req.query.success,
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const fbName  = req.body.fbName.trim(),
                fbTitle   = req.body.fbTitle.trim(),
                fbMessage = req.body.fbMessage.trim();

            const list = await feedbackService.getList();

            if(!fbName || !fbTitle || !fbMessage) {
                return res.render('feedback', {
                    page: 'Feedback',
                    error: true,
                    fbName,
                    fbMessage,
                    fbTitle,
                    list,
                });
            }
            await feedbackService.addEntry(fbName, fbTitle, fbMessage);

            return res.redirect('/feedback?success=true');
        } catch(err) {
            return next(err);
        }
        
    });

    return router;
};
