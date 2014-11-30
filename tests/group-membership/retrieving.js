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
            status: 'Accepted'
        }]
    };

    before(function(done){
        var promises = [];

        utils.collections.clearAll().then(function(){

            var groupPromise = utils.createModel('Group', group).then(function(savedGroup){
                group = savedGroup;
                member.group = group._id;

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
    });


    it('should return an object containing the users groups', function(done){
        Groups.getByUserId(userId).then(function(groups){
            expect(groups).to.exist;
            expect(groups['Test Group']).to.exist;
            expect(groups['Test Group']._id).to.eql(group._id);
            done();
        }).catch(function(err){
            done(new Error(err));
        });
    });

    it('should not include groups where the character is no longer in the alliance');
    it('should ')

    it('should have a list of the user\'s characters for each group');
    it('should ignore characters that belong to invalid keys');

    describe('when user is a group owner', function(){
        it('should have a status of \'Owner\'');
    });

    describe('when user is a group manager', function(){
        it('should have a status of \'Manager\'');
    });


});
