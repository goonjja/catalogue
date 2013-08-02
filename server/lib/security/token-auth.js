var passport = require('passport'),
    util = require('util'),
    crypto = require('crypto'),
    acc = require('./accounting');

/*
    Request should contain the Date header and the Authorization header of the following form:
    Authorization: CAT TOKENID:SIGNATURE
    
    Signature created by the following algorithm:
    var signData = req.method + '\n\n\n' + dateHeader + '\n' + req.path;
    var SIGNATURE = crypto.createHmac('sha1', secretKey).update(signData).digest('base64');
    
    Secret key is associated with TOKENID and it should NOT be exposed in the request.
    
    Example of signing request for clients:
    var date = moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ");
    var reqContents = req.method + '\n\n\n' + date + '\n' + req.path;
    var signature = crypto.createHmac('sha1', token.secretKey).update(reqContents).digest('base64');
    req._headers['date'] = date;
    req._headers['authorization'] = "CAT " + token.tokenId + ":" + signature;
*/


function Strategy(headerPrefix) {
    passport.Strategy.call(this);
    this.name = 'token';
    this.headerPrefix = headerPrefix;

    this.validateRequest = function (req, callback) {
        var authHeader = req.get('authorization');
        var dateHeader = req.get('date');

        if (!authHeader) return callback(new Error('Authorization header is missing'));
        if (!dateHeader) return callback(new Error('Date header is missing'));
        if (authHeader.indexOf(this.headerPrefix) != 0) return callback(new Error('Ivalid Authorization header'));
        var tokenId, signature;
        try {
            var split = authHeader.substr(this.headerPrefix.length + 1).split(':');
            tokenId = split[0];
            signature = split[1];
        } catch (err) {
            return callback(new Error('Error occured while parsing Authorization header', err));
        }
        acc.getSecretKey(tokenId).then(function (secretKey) {
            var signData = req.method + '\n\n\n' + dateHeader + '\n' + req.path;
            var validSignature = crypto.createHmac('sha1', secretKey).update(signData).digest('base64');
            if (signature != validSignature)
                return callback(new Error('Authentication failed'));
            acc.getUserByToken(tokenId).then(function (userId) {
                return callback(null, {
                    userId: userId
                });
            }, function (err) {
                return callback(err);
            });
        }, function (err) {
            callback(err);
        });
    }
}
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req, options) {
    var self = this;
    this.validateRequest(req, function (err, user) {
        if (err) return self.fail(err.message);
        self.success(user);
    });
}

module.exports = Strategy;