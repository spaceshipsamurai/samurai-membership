var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('getting memberships by userId', function(){

    var userId = mongoose.Types.ObjectId();
    var group = {
        name: 'Test Group',
        createdDate: new Date(),
        createdBy: mongoose.Types.ObjectId()
    },
    key = {
        userId: userId,
        keyId: 1,
        vCode: '',
        accessMask: 123,
        keyType: 'Account',
        status: 'Valid',
        characters: [{
            name: 'Test Character',
            corporation: {
                id: 1,
                name: 'Test Corporation'
            },
            alliance: {
                id: 2,
                name: 'Test Alliance'
            },
            id: 1
        }]
    },
    member = {
        userId: userId,
        characters: [{
            id: 1,
            name: 'Test Character',
            approvedDate: new Date(),
            approvedBy: mongoose.Types.ObjectId(),
            appliedDate: new Date(),
            status: 'Member'
        }]
    };

    before(function(done){
        var promises = [];

        var groupPromise = utils.createModel('Group', group).then(function(savedGroup){
            group = savedGroup
            member.groupId = group._id;

            return utils.createModel('Member', member).then(function(savedMember){
                member = savedMember;
            });
        });

        var keyPromise = utils.createModel('Key', key);

        promises.push(groupPromise);
        promises.push(keyPromise);

        Promise.all(promises).then(function(){
            done();
        }).catch(function(err){
            done(new Error(err));
        });
    });


    it('should return an object containing the users groups');
    it('should have a list of the user\'s characters for each group');
    it('should ignore characters that belong to invalid keys');

    describe('when user is a group owner', function(){
        it('should have a status of \'Owner\'');
    });

    describe('when user is a group manager', function(){
        it('should have a status of \'Manager\'');
    });


});
