var Member = require('./member-model'),
    Promise = require('bluebird'),
    Keys = require('../keys/key-service');

exports.removeAllFromGroup = function (groupId) {

    return new Promise(function (resolve, reject) {

        Member.find({group: groupId}).remove(function (err) {

            if (err) reject(err);

            resolve();

        });

    });
};

exports.apply = function (groupId, application) {

    return new Promise(function (resolve, reject) {

        Member.create({
            groupId: groupId,
            userId: application.userId,
            characters: [{
                id: application.character.id,
                name: application.character.name,
                appliedDate: new Date(),
                status: 'Pending'
            }]
        }, function (err, member) {

            if (err) reject(err);

            resolve(member);

        });

    });

};

exports.getByUserId = function (userId) {

    return new Promise(function (resolve, reject) {

        Member.find({'userId': userId}).populate('group').exec(function (err, members) {

            if (err) reject(err);

            var groups = {};

            for (var x = 0; x < members.length; x++) {
                var group = members[x].group.toObject();
                var managers = [];

                if (group.managers) {
                    managers = group.managers.reduce(function (prev, curr) {
                        return prev.concat(curr.id);
                    }, []);
                }


                groups[members[x].group.name] = group;
                groups[members[x].group.name].characters = members[x].characters;

                var overallStatus = 'Inactive';

                for (var c = 0; c < members[x].characters.length; c++) {
                    if (members[x].characters[c].status === 'Pending' && overallStatus != 'Accepted') {
                        overallStatus = 'Pending';
                    }
                    else if (members[x].characters[c].status === 'Accepted') {
                        if (group.owner && group.owner.id === members[x].characters[c].id) {
                            overallStatus = 'Owner';
                            break;
                        }
                        else if(managers.length > 0 && managers.indexOf(members[x].characters[c].id) > -1)
                            overallStatus = 'Manager';
                        else if (overallStatus != 'Accepted')
                            overallStatus = 'Accepted';
                    }
                }

                groups[members[x].group.name].memberStatus = overallStatus;

            }

            resolve(groups);

        });


    });

};
