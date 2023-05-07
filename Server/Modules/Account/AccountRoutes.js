const express = require('express')
const utils = require('./utils')

const AccountServices = require('./AccountServices')
const EncryptionServices = require('../Encryption/EncryptionService').EncryptionService
const router = express.Router();
const NaCl = require('tweetnacl')
const NaClUtil = require('tweetnacl-util')
const fs = require('fs')


router.post('/usernameValidity',async (req,res)=>{
    const username = req.body.username ;
    try {
        let UsernameExist = await AccountServices.CheckUsername(username)
        if(UsernameExist){
            res.send(true)
        }else if(!UsernameExist){
            res.send(false)
        }
    }catch(e){
        
    }
})

// Route called to Registre a new User
// THE REQUEST OBJECT 'req' CONTAINS files and a body
// THE files (req.files) Contains the pictures sent by the user
// The body (req.body) Contain whats the nature of each images 
router.post('/Registration',utils.uploadImages().array('files'), async (req,res,next)=>{
    if(!req.files){
        const error = new Error("Please upload a Picture");
        error.httpStatusCode = 400;
        return next(error);   
      }
    // Removing useless req attributes 
    const body = {
        files : utils.cleanRequestFiles(req.files),
        ref : {
            idCardFront : req.body.idCardFront,
            idCardBack : req.body.idCardBack ,
            selfie : req.body.selfie
        },
        username : req.body.username,
        transactionId : req.body.transactionId
    }
    let generatedFiles = null ;
    // Checking if the request contain files
    
    // Passing the body object to the next Layer
    try {
        let user = await  AccountServices.registerNewUser(body).then((createdUser) => {
        generatedFiles = createdUser.Generatedfiles ;
        return createdUser ;
    })
    if(user.isCreated){
        let RegistrationDetails = await AccountServices.LoadJsonFromFile(user.Generatedfiles.json1,user.Generatedfiles.json2).then(details => {return JSON.stringify(details)})
        let encryptedRegistrationDetails = await AccountServices.encryptAccountData(RegistrationDetails,body.transactionId)
        res.json(encryptedRegistrationDetails)
    }else if(!user.isCreated){
        res.json({data : "error",message : "Failed to create user"})
    }
}catch(error){
    console.log(error)
    res.json({data : "error" ,message : "Failed to Create a new User"})
}finally{
        // Delete files
        body.files.forEach(item => {
            fs.unlinkSync(item.path)
        })
        Object.keys(generatedFiles).forEach(key => {
            fs.unlinkSync(generatedFiles[key])
        })
        fs.unlinkSync(generatedFiles.image1)
        fs.unlinkSync(generatedFiles.image2)
        fs.unlinkSync(generatedFiles.json1)
        fs.unlinkSync(generatedFiles.json2)
    }
})
router.post("/Login",utils.uploadImages().array('files'), async (req,res) => {
    const username = req.body.username
    const picture = req.files[0].path
    await AccountServices.login(username,picture).then(validation =>{
        res.send(validation)
    })
})

module.exports = router