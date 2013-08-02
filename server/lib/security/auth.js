"use strict";

var path = require('path'),
    passport = require('passport'),
    acc = require('./services').accounting,
    xsrf = require('./xsrf');


function setupTokenAuth(headerPrefix) {
    var TokenStrategy = require('./token-auth');
    passport.use('token', new TokenStrategy(headerPrefix));
}

function setupFormAuth(app, loginHtmlPath, successRedirect) {
    passport.serializeUser(function (session, done) {
        done(null, session.id);
    });
    passport.deserializeUser(function (sessionId, done) {
        acc.getSession(sessionId).
        then(function (session) {
            if (!session)
            // we will check this at authenticationRequired and tokenRequired
            // so we don't need an error here
                return done(null, {});

            return done(null, session);
        });
    });
    var LocalStrategy = require('passport-local').Strategy;
    passport.use('form', new LocalStrategy(function (username, password, done) {
        acc.authenticateUser(username, password).
        then(function (session) {
            done(null, session);
        }, function (err) {
            done(null, false, {
                message: err
            });
        });
    }));
    app.get('/login', function (req, res) {
        res.sendfile(loginHtmlPath);
    });
    app.post('/login', function (req, res, next) {
        function afterAuth(err, user, info) {
            if (err) return next(err);
            if (!user) return res.redirect('/login');
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect(successRedirect);
            });
        }
        return passport.authenticate('form', afterAuth)(req, res, next);
    });

    app.get('/logout', function (req, res, next) {
        if ('id' in req.user)
            acc.destroySession(req.user.id);
        req.logout();
        res.redirect(successRedirect);
    });
}

exports.setup = function (app, loginHtmlPath, successRedirect, tokenAuthHeaderPrefix) {
    console.log("Setting up auth");
    app.use(passport.initialize()); // Initialize PassportJS
    app.use(passport.session());
    //app.use(xsrf); // still don't get how it should work
    setupFormAuth(app, loginHtmlPath, successRedirect);
    setupTokenAuth(tokenAuthHeaderPrefix);
}

function checkSessionExistence(req) {
    // check if session does not exist and 
    // was deserialized to an empty object
    if (req.isAuthenticated() && !('id' in req.user))
        req.logout();
}

exports.authenticationRequired = function (req, res, next) {
    checkSessionExistence(req);

    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

exports.tokenRequired = function (req, res, next) {
    var afterAuth = function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.json(401, {
                error: info
            });
        // set the user object in request in order to make it accessible for api
        req.user = user;
        return next();
    };

    // check session authentication first
    checkSessionExistence(req);
    if (req.isAuthenticated()) {
        next();
    } else {
        passport.authenticate('token', {
            session: false
        }, afterAuth)(req, res, next);
    }
}