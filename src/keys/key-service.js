var neow,
    Key = require('./key-model'),
    Promise = require('bluebird')

module.exports = function(eveApi){

    if(!neow)
    {
        neow = eveApi || require('neow');
    }

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

                if(access != 268435455) reject('Invalid access mask');
                if(!keyData.type || keyData.type != 'Account') reject('Invalid key type');

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
                    if(err) reject(err);

                    resolve(key);
                });
            });

        });
    };

    return {
        create: create
    }

};

