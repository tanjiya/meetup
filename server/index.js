// Include Express to Our Web App
const express = require('express');
// Include Path form Express, as It's default in Express 
const path = require('path');
// Include Http-Error
const httpError = require('http-error');
// Include Config File
const configFile = require('./config');
// Include Speaker Service
const SpeakerService = require('./services/SpeakerService');

const app = express();

//Get Configuration: Development or Production
const config = configFile[app.get('env')];

// Create The Instance for SpeakerService
const speakerService = new SpeakerService(config.data.speakers);// Passed The Data File via Config

// Set View Engine
app.set('view engine', 'pug');

// Pretify HTML in Browser for Development Stage
if (app.get('env') === 'development')
{
    app.locals.pretty = true;
}

// Set Path to Our Views Folder
const pathDirectory = path.join(__dirname + '/views');
app.set('views', pathDirectory);

// Get All Static File
const staticFile = express.static('public');

// Use All Static File
app.use(staticFile);

// Prevent Express to Search FavIcon
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

// Set The Site Name: Title of Website
app.locals.title = config.sitename;

// Test Render Time
// app.use((req, res, next) => {
//     res.locals.rendertime = new Date();
//     return next();
// });

// Middleware to Use The Async Data from Speakers DataFile
app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames();
        console.log(names);
        res.locals.speakerNames = names;
        return next();
    } catch(err) {  
        return next(err);
    }
});

// Include Routes File
const routes = require('./routes');

// Use Main Route File: routes/index.js
app.use('/', routes({
    speakerService: speakerService
}));
// If No Route Match, Shows 404 Error Page
app.use((req, res, next) => {
    return next(httpError(404, 'File Not Found'));
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const errorStatus = err.status || 500;
    res.locals.status = errorStatus;
    res.locals.errorStatus = res.app.get('env') === 'development' ? err : {};
    res.status(errorStatus);

    return res.render('./errors/404');
});

// Listening to Port to Serve The Web App
const server_port = process.env.PORT || 3000;
app.listen(server_port, (err) => {
    if(!err)
    {
        console.log("Server Has Started");
    } else {
        console.log(`Error: ${err}`);
    }
});

// Export Main App File
module.export = app;