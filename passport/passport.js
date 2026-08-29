
const GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

const User             = require('../models/user.js');
const session          = require('express-session');
const jwt              = require('jsonwebtoken');
const secret           = 'Pankaj'; 

module.exports = function(app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
      name: 'rescuemeals_session_id',
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 3600000 }
    }));

    passport.serializeUser(function(user, done) {
        
        token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/oauth2callback',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    }, function(accessToken, refreshToken, profile, done) {
        if (profile.emails && profile.emails.length > 0) {
            User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function(err, user) {
                if (err) { done(err); }
                if (user && user != null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
        } else {
            done(new Error("No email found from Google"));
        }
    }));

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/_oauth/facebook', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/facebook/' + token);
    });

    
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/oauth2callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/google/' + token);
    });

    
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/_oauth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
        
        res.redirect('/twitter/' + token);
    });

    return passport;
};
