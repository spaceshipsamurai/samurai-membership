var groups = require('./group-management');
var keys = require('./keys/key-service');

exports.Groups = groups;
exports.Keys = function(eveApi) {
    return keys(eveApi);
};