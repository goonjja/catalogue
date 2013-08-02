'use strict';

var config = require('../../config'),
    guid = require('../guid'),
    Q = require('q'),
    _ = require('underscore'),
    db = require('../model/db'),
    User = require('../model/user'),
    Token = require('../model/token');

function Accounting() {
    var sessions = {};
    //static constants
    this.NETWORKS = 'networks';
    this.HOSTS = 'hosts';

    this.userResources = function (userId, resourceType) {
        var deferred = Q.defer();
        User.findById(userId, function (err, user) {
            if (err) return deferred.reject(err);
            deferred.resolve(user[resourceType] || []);
        });
        return deferred.promise;
    }

    this.registerResource = function (userId, resourceType, resourceId) {
        var deferred = Q.defer();
        User.findById(userId, function (err, user) {
            if (err) return deferred.reject(err);
            if (!_.contains(user[resourceType], resourceId))
                user[resourceType].push(resourceId);
            user.save(function (err, u) {
                if (err) return deferred.reject(err);
                deferred.resolve();
            });
        });
        return deferred.promise;
    }

    this.removeResource = function (userId, resourceType, resourceId) {
        var deferred = Q.defer();
        User.findById(userId, function (err, user) {
            if (err) return deferred.reject(err);
            var i = _.indexOf(user[resourceType], resourceId);
            user[resourceType].splice(i, 1);
            user.save(function (err, u) {
                if (err) return deferred.reject(err);
                deferred.resolve();
            });
        });

        return deferred.promise;
    }

    this.accessGranted = function (userId, resourceType, resourceId) {
        var deferred = Q.defer();
        User.findById(userId, function (err, user) {
            if (err) return deferred.reject(err);
            deferred.resolve(_.contains(user[resourceType], resourceId));
        });
        return deferred.promise;
    }

    /* Authentication mechanics */
    this.getSession = function (sessionId) {
        var deferred = Q.defer();
        if (sessionId in sessions)
            deferred.resolve(sessions[sessionId]);
        else
            deferred.resolve(false);
        return deferred.promise;
    }

    this.authenticateUser = function (username, password) {
        var deferred = Q.defer();
        // should return session object with userId inside it
        User.findOne({
            name: username
        }, function (err, user) {
            if (err) return deferred.reject(err);
            if (!user) return deferred.reject(new Error('Invalid username'));
            if (!user.validPassword(password)) return deferred.reject(new Error('Invalid password'));
            var session = {
                id: guid.generate(),
                userId: user.id
            };
            sessions[session.id] = session;
            return deferred.resolve(session);
        });
        return deferred.promise;
    }

    this.destroySession = function (sessionId) {
        if (sessionId in sessions)
            delete sessions[sessionId];
    }

    this.getSecretKey = function (tokenId) {
        var deferred = Q.defer();
        Token.findOne({
            tokenId: tokenId
        }, function (err, token) {
            if (err) return deferred.reject(err);
            if (!token) return deferred.reject(new Error('Token ' + tokenId + ' not found'));

            deferred.resolve(token.secretKey);
        });
        return deferred.promise;
    }

    this.getUserByToken = function (tokenId) {
        var deferred = Q.defer();
        Token.findOne({
            tokenId: tokenId
        }, function (err, token) {
            if (err) return deferred.reject(err);
            if (!token) return deferred.reject(new Error('Token ' + tokenId + ' not found'));

            deferred.resolve(token.userId);
        });
        return deferred.promise;
    }

}

module.exports = new Accounting();