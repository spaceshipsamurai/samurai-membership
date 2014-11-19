var util = require('../utils'),
    expect = require('chai').expect,
    eveApiMock = require('../eveApiMock'),
    Keys = require('../../src/index').Keys(eveApiMock),
    KeyModel = require('../../src/keys/key-model');

describe('retrieving characters by userId', function(){

    it('should return an object hash of characters from all keys');

    describe('when validOnly is true', function(){

        it('should return an object hash containing only characters from a valid key');

    });

});
