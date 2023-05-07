const express = require('express')
const cors = require('cors')
const multer = require('multer')
const randomUUID = require('crypto')
const AccountRoutes = require('./Modules/Account/AccountRoutes.js')
const EncryptionRoutes = require('./Modules/Encryption/EncryptionRoutes')
const DataBase = require('./config/Mongo')
const nacl = require('tweetnacl');
const util = require('tweetnacl-util');

const port = 5000;
const app = express();

app.use(cors());
app.set('port',port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/Account',AccountRoutes)
app.use('/Encryption',EncryptionRoutes)
const ServerKeyPair = nacl.box.keyPair();
console.log("pub: " + util.encodeBase64(ServerKeyPair.publicKey))
console.log("private: " + util.encodeBase64(ServerKeyPair.secretKey))
app.listen(port,()=>console.log("listening on port 5000"))