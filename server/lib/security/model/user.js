var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    hosts: Array,
    networks: Array
});

userSchema.methods.validPassword = function (pswd) {
    return this.password == pswd;
}

module.exports = mongoose.model("User", userSchema);