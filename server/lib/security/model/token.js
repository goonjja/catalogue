var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    tokenId: String,
    secretKey: String,
    userId: String
});

module.exports = mongoose.model("Token", tokenSchema);