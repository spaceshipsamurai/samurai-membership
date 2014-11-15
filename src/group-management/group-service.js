var Group = require('./group-model'),
    Promise = require('bluebird'),
    Members = require('./group-membership-service');

exports.create = function(group) {
    return new Promise(function(resolve, reject) {

        var newGroup = new Group(group);

        newGroup.save(function(err, savedGroup) {

            if(err)
            {
                if(err.name == 'ValidationError')
                {
                    return reject(err.errors);
                }
                else
                {
                    return reject(err);
                }
            }

            return resolve(savedGroup.toObject());

        });
    });
};

exports.remove = function(groupId) {
    return new Promise(function(resolve, reject) {
        Group.find({_id: groupId}).remove(function (err) {
            if (err) reject(err);

            Members.removeAllFromGroup(groupId).then(function(){
                resolve();
            }).error(function(err){
                reject(err);
            });
        });
    });
};