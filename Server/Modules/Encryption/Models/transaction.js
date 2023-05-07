const mongoose = require('mongoose')
const uuid4 = require('uuid').v4

const TransactionSchema = new mongoose.Schema({
    id :{
        type : String,
        default : () => uuid4().replace(/\-/g,""),
        index : true
    },
    username : {
        type : String,
        required : true
    },
    serverSharedKeys : {
        type : String,
        required : true
    }},
    {
        timestamps : true,
        collection: "Transactions",
    }
)
TransactionSchema.statics.saveTransaction = async function(username,key){
    try {
        const transaction = await this.create({
            username : username,
            serverSharedKeys : key
        })
        return transaction['id'] ; 
    }catch(error){
        console.log(error)
    }
}
TransactionSchema.statics.getSharedKeys = async function(TransactionId) {
    try{
        const transaction = await this.findOne({id : TransactionId})
        return transaction['serverSharedKeys'] ;
    }catch(err) {
        console.log(err);
    }
}
module.exports = mongoose.model("Transaction",TransactionSchema);