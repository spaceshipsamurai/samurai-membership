var Member = require('./member-model'),
    Promise = require('bluebird'),
    Keys = require('../keys/key-service');

exports.removeAllFromGroup = function(groupId) {

    return new Promise(function(resolve, reject){

        Member.find({ group: groupId }).remove(function(err){

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

exports.getByUserId = function(userId) {

    return new Promise(function(resolve, reject){

        Keys.getCharacters({ userId: userId, validOnly: true }).then(function(characters){

            var cids = [];

            for(var x = 0; x < characters.length; x++)
                cids.push(characters[x].id);

            Member.find({ 'characters.id': { $in: cids }}).populate('group').exec(function(err, members){

                if(err) reject(err);

                var groups = {};

                console.log('MEMBERS: ' + members);

                for(var x = 0; x < members.length; x++)
                {
                    groups[members[x].group.name] = members[x].group;
                }

                resolve(groups);

            });

        });

    });

};
