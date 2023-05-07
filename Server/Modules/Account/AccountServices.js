const { Console } = require('node:console');
const { resolve } = require('node:path');
const { Worker } = require('node:worker_threads')
const fs = require('fs');
const { json } = require('body-parser');
const crypto = require('node:crypto')

const  AccountDataAcces = require('./AccountDataAcces')
const EncryptionService = require('../Encryption/EncryptionService')
// This Object contains methodes used in the Service Later
const AccountServiceUtilities = {
    getDataFromFile: async (file, refs) => {
        if (file.path.includes(refs.idCardFront)) {
            let FrontCardScanned = await AccountServiceUtilities.RunDocumentScanner(file, "front").then(res => { return res });
            let IdCardPicture = await AccountServiceUtilities.ExtractPicture(file).then(res => { return res })
            return {
                ref: "FrontIdCardInfo",
                IdCardFrontText: {
                    json: FrontCardScanned
                },
                IdCardPic: {
                    path: IdCardPicture
                }
            }
        }
        else if (file.path.includes(refs.idCardBack)) {
            let BackCardScanned = await AccountServiceUtilities.RunDocumentScanner(file, "back").then(res => { return res });
            return { json: BackCardScanned, ref: "BackIdCardInfo" }

        } else if (file.path.includes(refs.selfie)) {
            let CroppedSelfie = await AccountServiceUtilities.ExtractPicture(file).then(res => { return res })
            return { ref: "Selfie", path: CroppedSelfie }
        }
    },
    // @param file : The picture to Scan
    // @param ref : The nature of the scanned picture
    // @ return a Document Scanning Worker promise
    RunDocumentScanner: async (file, ref) => {
        switch (ref) {
            case "front":
                return await AccountServiceUtilities.DocumentScannerWorker(file.path, "FrontTemplate")
                break;
            case "back":
                return await AccountServiceUtilities.DocumentScannerWorker(file.path, "BackTemplate");
                break;
            default:
                break;
        }
    },
    //@param path : The relative path to the Picture
    //@param ref : Nature of the Scanned picture i.e Selfie, picture of the front of an identity card
    //@return a Promise of a Worker
    DocumentScannerWorker: async (path, ref) => {
        return await new Promise(
            (resolve, reject) => {
                var response = null; // Initializing the response variable in order to acces it in the event lister below
                const DocumentScannerWorker = new Worker('./Modules/Account/SubModules/DocumentScanWorker.js', { workerData: { file: path, ref: ref } });

                DocumentScannerWorker.on('online', () => {
                    console.log('DEBUT : Execution de la tâche intensive en parallèle')
                })

                DocumentScannerWorker.on('message', (msg) => {
                    response = msg; //Store the message sent by the worker
                    resolve(response) // Resolve the Promise
                });
                DocumentScannerWorker.on('error', (err) => {
                    console.log(err)
                    reject(err)
                })
                DocumentScannerWorker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`stopped with  ${code} exit code`))
                    } else {
                        resolve(response);
                    }
                })

            }
        );
    },
    ExtractPicture: async (IdCardFrontFile) => {
        return await AccountServiceUtilities.PictureExtractionWorker(IdCardFrontFile.path)
    },
    PictureExtractionWorker: async (IdCardFrontPath) => {
        return await new Promise(
            (resolve, reject) => {
                var response = null;
                const PictureExtractionWorker = new Worker('./Modules/Account/SubModules/PictureExtractionWorker.js', { workerData: { file: IdCardFrontPath } })

                PictureExtractionWorker.on("online", () => {
                    console.log("Extracting Picture")
                })

                PictureExtractionWorker.on('message', (msg) => {
                    response = msg
                    resolve(response)
                })

                PictureExtractionWorker.on('error', (err) => {
                    console.log(err)
                    reject(err)
                })

                PictureExtractionWorker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`stopped with  ${code} exit code`))
                    } else {
                        resolve(response);
                    }
                })
            }
        )
    },
    LoginFacialVerificationWorker : async (facialEmbedding,PicturePath) => {
        facialEmbedding = JSON.stringify(facialEmbedding).toString();
        return await new Promise((reject,resolve) => {
            var response = null
            const loginFacialVerificationWorker = new Worker('./Modules/Account/SubModules/LoginFacialVerificationWorker.js',{workerData : {facialEmbedding : facialEmbedding,picturePath : PicturePath}})
            console.log("bellow loginFacialVerificationWorker")
            loginFacialVerificationWorker.on("online", () => {
                console.log("Doing Facial Verification")
            })
            loginFacialVerificationWorker.on('message', (msg) => {
                response = msg;
                resolve(response)
            })
            
            loginFacialVerificationWorker.on('error', (err) => {
                //console.log("Error sdsqds: "+err)
                reject(err)
            })
            loginFacialVerificationWorker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`stopped with  ${code} exit code`))
                } else {
                    resolve(response);
                }
            })
        })
    },LoginFacialVerification : async (facialEmbedding,PicturePath) => {
        let verification = await AccountServiceUtilities.LoginFacialVerificationWorker(facialEmbedding,PicturePath)
        .then((response)=> {return response})
        //El error lahné
        // The Catch block is always activated , the problems is that inside LoginFacialVerificationWorker the msg is true
        .catch(err => {return err});
        return verification;
    },
    FacialVerificationWorker: async (face1, face2) => {
        return await new Promise((reject, resolve) => {
            var response = null;
            const facialVerificationWorker = new Worker('./Modules/Account/SubModules/FacialVerificationWorker.js', { workerData: { face1: face1, face2: face2 } })
            facialVerificationWorker.on("online", () => {
                console.log("Doing Facial Verification")
            })
            facialVerificationWorker.on('message', (msg) => {
                response = msg;
                //console.log(response)
                //console.log("message",response)
            })
            facialVerificationWorker.on('error', (err) => {
                reject(err)
            })
            facialVerificationWorker.on('exit', (code) => {
                if (code !== 0) {
                    console.log(code)
                    reject(new Error(`stopped with  ${code} exit code`))
                } else {
                    console.log("exit",response)
                    //console.log("code",code)
                    resolve(response);
                }
            })
        }
        )
    },
    FacialVerificaton: async (face1, face2) => {
        let Verification = await AccountServiceUtilities.FacialVerificationWorker(face1, face2).then(response => { console.log("Worker Response", response); return response }).catch(e => {
            return e });
        return Verification;
    },
    loadJson: async (path) => {
        let rawData = fs.readFileSync(path);
        let Json = JSON.parse(rawData);
        return Json ;
    }
}


const AccountServices = {
    CheckUsername : async (username)=>{
        try {
            const Checker =await AccountDataAcces.UsernameCheck(username) ;
            return Checker ;
        }catch(err){
            console.log(err);
        }
    },
    registerNewUser: async (body) => {
        const files = body.files;
        const username = body.username
        const ref = body.ref;
        let response = null;
        const IntenseWork = Promise.all(files.map(async file => {
            const data = AccountServiceUtilities.getDataFromFile(file, ref); return data;
        })).then(async (ProcessedData) => { 
            const selfiePic = ProcessedData.filter(el => el.ref == "Selfie")[0]
            const FrontCardDetails = ProcessedData.filter(el => el.ref == "FrontIdCardInfo")[0]
            const BackCardDetails = ProcessedData.filter(el => el.ref == "BackIdCardInfo")[0]
            //console.log('Front',FrontCardDetails)
            //console.log('Back',BackCardDetails)
            let facial_Verification = await AccountServiceUtilities.FacialVerificaton(selfiePic.path, FrontCardDetails.IdCardPic.path).then(msg => { return msg });
            if (facial_Verification['result'] == true) {
                try {
                    let account = await AccountDataAcces.createAccount(username,facial_Verification['face_encodings']) ;
                    if(account){
                        return {
                            isCreated : true,
                            Generatedfiles : {
                            image1 : FrontCardDetails.IdCardPic.path,
                            image2 : selfiePic.path,
                            json1 : FrontCardDetails.IdCardFrontText.json,
                            json2 : BackCardDetails.json,
                        }} ;
                    }else if(account == "error"){
                        return {isCreated : false} ;
                    }else{
                        return {isCreated : false}
                    }
                } catch (error) {
                    console.log(error)
                }
            } else if (facial_Verification['result'] == false) {
                return { Verification: "Unverified", message: "Faces doesn't match !" }
            } else {
                return { Verification: "Error" }
            }
        }).catch(err => {
            console.log(err)
        })
        return IntenseWork
    },
    login : async (username,picturePath)=> {
        const userFacialEmbedding = await AccountDataAcces.GetFacialEmbedding(username);
        //.then(facialEmb => {
        //    return facialEmb
        //;})
        if(userFacialEmbedding == undefined){
            return undefined
        }
        return await AccountServiceUtilities.LoginFacialVerification(userFacialEmbedding,picturePath).then(res => {
             return res}).catch(err => {console.log(err)})
        //here
    },
    encryptAccountData : async (message,transactionId) => {
        const encryptedMesssage = await EncryptionService.EncryptionService.encryptMessage(transactionId,message)
        return encryptedMesssage ;
    },LoadJsonFromFile : async (json1,json2) => {
        data1 = await AccountServiceUtilities.loadJson(json1)
        data2 = await AccountServiceUtilities.loadJson(json2)
        return {
            frontCardDetails : data1 ,
            backCardDetails : data2
        }
    }
}
module.exports = AccountServices;