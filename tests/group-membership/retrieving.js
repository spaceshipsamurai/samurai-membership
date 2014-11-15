var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('getting groups by userId', function(){

    it('should return an object has of the users groups');
    it('should have a list of the user\'s characters for each group');
    it('should ignore characters that belong to invalid keys');

    describe('when user is a group owner', function(){
        it('should have a status of \'Owner\'');
    });

    describe('when user is a group manager', function(){
        it('should have a status of \'Manager\'');
    });


});
