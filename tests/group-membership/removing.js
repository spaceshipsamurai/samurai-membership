var utils = require('../utils'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Groups = require('../../src/index').Groups,
    MemberModel = require('../../src/group-management/member-model');

describe('removing a character from a group', function(){

    describe('when the user has multiple characters', function(){
        it('should remove only the given character');
    });

    describe('when character is the user\'s last character', function(){
        it('should remove the entire member record');
    });

    describe('when the character is a manager', function(){
        it('should be removed from the group\'s list of managers');
    });

    describe('when the character is an owner', function(){
        it('should set the owner to undefined');
    });

});
