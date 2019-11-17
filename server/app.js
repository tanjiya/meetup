const express       = require('express'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    MongoStore      = require('connect-mongo')(session),
    mongoose        = require('mongoose'),
    path            = require('path'),
    bodyParser      = require('body-parser'),
    httpError       = require('http-errors'),
    configFile      = require('./config'),
    auth            = require('./lib/auth'),
    SpeakerService  = require('./services/SpeakerService'),
    FeedbackService = require('./services/FeedbackService'),
    AvatarService = require('./services/AvatarService');

const app = express();

/**
 * Get Configuration: Development or Production
 */
const config = configFile[app.get('env')];

/**
 * Create The Instance for Service
 */
const speakerService = new SpeakerService(config.data.speakers),
    feedbackService  = new FeedbackService(config.data.feedback),
    avatarService    = new AvatarService(config.data.feedback);

/**
 * Set View Engine
 */
app.set('view engine', 'pug');

/**
 * Pretify HTML in Browser for Development Stage
 */
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

/**
 * Set Path to Our Views Folder
 */
const pathDirectory = path.join(__dirname + '/views');
app.set('views', pathDirectory);

/**
 * Get All Static File
 */
const staticFile = express.static('public');
app.use(staticFile);

/**
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

/**
 * Prevent Express to Search FavIcon
 */
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

/**
 * Set The Site Name: Title of Website
 */
app.locals.title = config.sitename;

// Test Render Time
// app.use((req, res, next) => {
//     res.locals.rendertime = new Date();
//     return next();
// });

/**
 * Middleware to Use The Async Data from Speakers DataFile
 */
app.use(async (req, res, next) => {
    try {
        req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
        const names = await speakerService.getNames();
        
        res.locals.speakerNames = names;
        
        return next();
    } catch(err) {  
        return next(err);
    }
});

/**
 * Include Routes File
 */
const routes = require('./routes');

/**
 * Use Main Route File: routes/index.js
 */
app.use('/', routes({
    speakerService,
    feedbackService,
    avatarService,
}));

/**
 * If No Route Match, Shows 404 Error Page
 */
// app.use((req, res, next) => {
//     return next(httpError(404, 'File Not Found'));
// });
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const errorStatus = err.status || 500;
    res.locals.status = errorStatus;
    res.locals.errorStatus = res.app.get('env') === 'development' ? err : {};
    res.status(errorStatus);

    return res.render('./errors/404');
});

/**
 * Listening to Port to Serve The Web App
 */
const server_port = process.env.PORT || 8000;
app.listen(server_port, (err) => {
    if(!err) {
        console.log("Server Has Started");
    } else {
        console.log(`Error: ${err}`);
    }
});

/**
 * Export Main App File
 */
module.exports = app;
