const nacl = require('tweetnacl');
const util = require('tweetnacl-util');

const EncryptionDataAcces = require('./EncryptionDataAcces')

const EncryptionServiceUtilities = {
    encodeBase64 : (input) => {
        return util.encodeBase64(input)
    },
    decodeBase64 : (input) => {
        return util.decodeBase64(input)
    },
    decodeStr : (str) => {
        return  new Uint8Array(util.decodeUTF8(str))
    },
}
const EncryptionService = {
    generateSharedKeys : async (username,userPubKey) =>{
        const ServerKeyPair = nacl.box.keyPair();
        const ServerSharedKey = nacl.box.before(userPubKey,ServerKeyPair.secretKey);
        const Base64EncodedKey = EncryptionServiceUtilities.encodeBase64(ServerSharedKey)
        const transactionId = await EncryptionDataAcces.saveRegistrationSharedKeys(username,Base64EncodedKey).then(transactionID => {return transactionID})
        return({
            transactionId : transactionId,
            ServerPubKey : EncryptionServiceUtilities.encodeBase64(ServerKeyPair.publicKey)
        })
    },
    encryptMessage : async (transactionId,message) => {
        const decodedStr = EncryptionServiceUtilities.decodeStr(message);
        const nonce = nacl.randomBytes(24);
        const SharedKey = await EncryptionDataAcces.getRegistrationSharedKey(transactionId)
        const ServerEncryptedMsg = nacl.box.after(decodedStr, nonce, EncryptionServiceUtilities.decodeBase64(SharedKey))
        const base64EncodedStr = EncryptionServiceUtilities.encodeBase64(ServerEncryptedMsg)
        return {data : base64EncodedStr,nonce : EncryptionServiceUtilities.encodeBase64(nonce)} ;
    }
}
module.exports = {
    EncryptionService : EncryptionService,
    EncryptionServiceUtilities : EncryptionServiceUtilities
}