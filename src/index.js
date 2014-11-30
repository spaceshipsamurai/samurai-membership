var groups = require('./group-management'),
    keys = require('./keys/key-service'),
    mongoose = require('mongoose');

exports.Groups = groups;
exports.Keys = keys;

exports.connect = function(connectionString) {
    mongoose.connect(connectionString);
};