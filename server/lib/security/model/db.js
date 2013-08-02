var mongoose = require('mongoose'),
    config = require('../../config');

mongoose.connect(config.database.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connection is open");
});
module.exports = db;
//
//function User(login, password) {
//    this.login = login;
//    this.password = password;
//}
//
//function Vlan(name, ownerId) {
//    this.name = name;
//    this.owner = ownerId;
//    //this.flows = [];
//}
//
//function Host(name, vlanId) {
//    this.name = name;
//    this.vlan = vlanId;
//    //this.rules = [];
//}
//
//function Flow(vlanId, name, proto, port) {
//    this.name = name;
//    this.vlan = vlanId;
//    this.proto = proto;
//    this.port = port;
//    //this.rules = [];
//    // TODO describe flow model
//}
//
//function Rule(flowId, hostId, proto, port, destId, destPort) {
//    // rule owner
//    this.flow = flowId;
//    this.host = hostId;
//    this.proto = proto;
//    this.port = port;
//    // if undefined applies for all
//    this.from = undefined; //host
//    // if undefined blocks packet
//    this.to = destId; //host
//    this.toPort = destPort;
//}