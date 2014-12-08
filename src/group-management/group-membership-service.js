var Member = require('./member-model'),
    Promise = require('bluebird');

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
            group: groupId,
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
                    if (members[x].characters[c].status === 'Pending' && overallStatus != 'Member') {
                        overallStatus = 'Pending';
                    }
                    else if (members[x].characters[c].status === 'Member') {
                        if (group.owner && group.owner.id === members[x].characters[c].id) {
                            overallStatus = 'Owner';
                            break;
                        }
                        else if(managers.length > 0 && managers.indexOf(members[x].characters[c].id) > -1)
                            overallStatus = 'Manager';
                        else if (overallStatus != 'Member')
                            overallStatus = 'Member';
                    }
                }

                groups[members[x].group.name].memberStatus = overallStatus;

            }

            resolve(groups);
        });
    });
};

exports.getByGroup = function(groupId) {

    return new Promise(function(resolve, reject){

        Member.find({ group: groupId }, function(err, members){

            if(err) return reject(err);

            return resolve(members);

        });

    });

};

exports.acceptMember = function(params) {

    return new Promise(function(resolve, reject){

        if(!params.groupId) return reject('Missing groupId');
        if(!params.characterId) return reject('Missing characterId');
        if(!params.approvedBy) return rejct('Missing approvedBy');

        var characterId;

        try{
            characterId = Number(params.characterId);
        }catch(e){
            return reject('Invalid character ID');
        }

        Member.findOne({'characters.id': characterId, group: params.groupId }, function(err, member){

            if(err) return reject(err);
            if(!member) return reject('Unable to find membership for CID: ' + characterId + ' and GID ' + params.groupId);

            for(var c = 0; c < member.characters.length; c++)
            {
                if(member.characters[c].id === characterId) {
                    member.characters[c].status = 'Member';
                    member.characters[c].approvedDate = new Date();
                    member.characters[c].approvedBy = params.approvedBy;
                    break;
                }
            }

            member.save(function(err){
                if(err) return reject(err);
                resolve();
            });

        });

    });
};
