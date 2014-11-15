var Member = require('./member-model'),
    Promise = require('bluebird');

exports.removeAllFromGroup = function(groupId) {

    return new Promise(function(resolve, reject){

        Member.find({ groupId: groupId }).remove(function(err){

            if(err) reject(err);

            resolve();

        });

    });
};

exports.apply = function(groupId, application){

    return new Promise(function(resolve, reject){

        Member.create({
            groupId: groupId,
            userId: application.userId,
            characters: [{
                id: application.character.id,
                name: application.character.name,
                appliedDate: new Date(),
                status: 'Pending'
            }]
        }, function(err, member){

            if(err) reject(err);

            resolve(member);

        });

    });

};
