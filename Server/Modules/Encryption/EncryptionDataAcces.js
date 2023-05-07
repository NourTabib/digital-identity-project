const TransactionModel = require('./Models/transaction')

const EncryptionDataAcces = {
    saveRegistrationSharedKeys : async (userName,ServerSharedKeys) => {
        try {
            let created = await TransactionModel.saveTransaction(userName,ServerSharedKeys)
            return created
        }catch(err){
            console.log(err)
        }
    },
    getRegistrationSharedKey : async (registrationId) => {
        try {
            let SharedKeys = await TransactionModel.getSharedKeys(registrationId)
            return SharedKeys
        }catch(err){
            console.log(err)
        }
    },
}

module.exports = EncryptionDataAcces