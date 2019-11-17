const express = require('express'),
  User        = require('../models/UserModel'),
  passport    = require('passport'),
  fileUpload  = require('./fileUpload'),
  router      = express.Router();

function redirectIfLoggedIn(req, res, next) {
  if (req.user) return res.redirect('/users/account');

  return next();
}

module.exports = (params) => {
  const { avatarService } = params;

  /**
   * Get User Registration Form
   */
  router.get('/registration', redirectIfLoggedIn, (req, res) => res.render('users/registration', {
    page: 'User Registration', 
    success: req.query.success
  }));

  /**
   * Post Request to Registar User
   */
  router.post('/registration',
    fileUpload.upload.single('avatar'),
    fileUpload.handleAvatar(avatarService),
    async (req, res, next) => {
      try {
        const user = new User({
          userName: req.body.userName,
          email   : req.body.email,
          password: req.body.password,
        });

        if (req.file && req.file.storedFilename) {
          user.avatar = req.file.storedFilename;
        }
        
        const savedUser = await user.save();

        if (savedUser){
          return res.redirect('/users/registration?success=true');
        } else {
          return next(new Error('Failed to save user for unknown reasons'));
        }
      } catch (error) {
        if (req.file && req.file.storedFilename) {
          await avatars.delete(req.file.storedFilename);
        }

        return next(error);
      }
  });

  /**
   * Get User Login Form
   */
  router.get('/login', redirectIfLoggedIn, (req, res) => res.render('users/login', {
    page: 'User Login',
    error: req.query.error
  }));

  /**
   * Post Request for User Login
   */
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login?error=true',
  }));

  /**
   * Logout User
   */
  router.get('/logout', (req, res) => {
    req.logout();

    return res.redirect('/');
  });

  /**
   * Get User Account
   */
  router.get('/account',
    (req, res, next) => {
      if (req.user) return next();
      return res.status(401).end();
    },
    (req, res) => res.render('users/account', {
      user: req.user
    })
  );

  /**
   * Get Avatar
   */
  router.get('/avatar/:filename', (req, res) => {
    res.type('png');

    return res.sendFile(avatars.filepath(req.params.filename));
  });

  router.get('/avatartn/:filename', async (req, res) => {
    res.type('png');

    const tn = await avatars.thumbnail(req.params.filename);
    
    return res.end(tn, 'binary');
  });

  // If We Don't Return Router, It Will Return Error
  return router;
};
