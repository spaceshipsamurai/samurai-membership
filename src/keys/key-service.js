var neow = require('neow'),
    Key = require('./key-model'),
    Promise = require('bluebird')

module.exports = function(){

    var use = function(api) {
        neow = api;
    };

    var create = function(params) {
        return new Promise(function(resolve, reject){

            if(!params.id || !params.vCode) reject('Key ID and Verification Code are required.');

            var eClient = new neow.EveClient({
                keyID: params.id,
                vCode: params.vCode
            });

            eClient.fetch('account:APIKeyInfo').then(function(result){

                var keyData = result.key;
                var access = keyData.accessMask | 1; //account balance
                access = access | 4096; //market orders
                access = access | 4194304; //Wallet Transactions

                if(access != 268435455) return reject('Invalid access mask');
                if(!keyData.type || keyData.type != 'Account') return reject('Invalid key type');

                var newKey = new Key({
                    keyId: params.id,
                    vCode: params.vCode,
                    userId: params.userId,
                    accessMask: keyData.accessMask,
                    keyType: keyData.type,
                    expires: keyData.expires,
                    status: 'Valid',
                    characters: [],
                    lastCheck: new Date()
                });

                for(var cid in keyData.characters)
                {
                    var character = result.key.characters[cid];

                    newKey.characters.push({
                        name: character.characterName,
                        isPrimary: false,
                        corporation: {
                            id: character.corporationID,
                            name: character.corporationName
                        },
                        alliance: {
                            id: character.allianceID,
                            name: character.allianceName
                        },
                        id: character.characterID
                    });
                }

                newKey.save(function(err, key){
                    if(err) return reject(err);

                    resolve(key);
                });
            });

        });
    };

    var getCharacters = function(options) {

        return new Promise(function(resolve, reject){

            if(!options.userId) return reject('Missing required parameter userId');
            if(options.validOnly === undefined) options.validOnly = true;

            var search = { userId: options.userId };
            if(options.validOnly) search.status = 'Valid';

            Key.find(search, function(err, keys){

                if(err) return reject(err);

                var characters = [];

                for(var x = 0; x < keys.length; x ++)
                {
                    for(var c = 0; c < keys[x].characters.length; c++)
                    {
                        characters.push(keys[x].characters[c]);
                    }
                }

                resolve(characters);

            });

        });

    };

    var getByUserId = function(userId) {

        return new Promise(function(resolve, reject){

            Key.find({userId: userId}, function(err, keys){
                if(err) return reject(err);
                resolve(keys);
            });

        });

    };

    var remove = function(keyId) {
        return new Promise(function(resolve, reject){
            Key.find({keyId: keyId }).remove(function(err){
                if(err) return reject(err);
                resolve();
            });
        });
    };

    return {
        create: create,
        getCharacters: getCharacters,
        use: use,
        getByUserId: getByUserId,
        remove: remove
    }

}();

