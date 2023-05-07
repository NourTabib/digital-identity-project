const express = require('express')
const router = express.Router();
const EncryptionService = require('./EncryptionService').EncryptionService
const EncryptionServiceUtilities = require('./EncryptionService').EncryptionServiceUtilities
const nacl = require('tweetnacl')
const util = require('tweetnacl-util');
const AccountServices = require('../Account/AccountServices');


router.post('/generateRegistrationKeys', async (req,res)=>{
    console.log(req.body)
    const userName = req.body.username
    const userPublicKey = EncryptionServiceUtilities.decodeBase64(req.body.userPubKey)
    const EncryptionDetails = await EncryptionService.generateSharedKeys(userName,userPublicKey);
    res.send({
        transactionId : EncryptionDetails.transactionId,
        serverPubKey : EncryptionDetails.ServerPubKey,
    })

})

module.exports = router