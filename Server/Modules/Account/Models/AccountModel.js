const mongoose = require('mongoose')
const uuid4 = require('uuid').v4
const AccountSchema = new mongoose.Schema({
    id :{
        type : String,
        default : () => uuid4().replace(/\-/g,""),
        index : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    face_embeddings : {
        type : [Number],
        required : true,
    },
},{
    timestamps : true,
    collection: "Accounts",
})
AccountSchema.statics.getFacialEmbedding = async function (username){
    try {
        const facialEmbeddings = await this.findOne({username:username}).then(res => {
            if(res == null){
                return {message : "USER_NOT_FOUND"}
            }else{
                return {facialEmbeddings : res['face_embeddings'],message : "DONE"}
            }
        })
        return facialEmbeddings ;
    }catch(e){

    }
}
AccountSchema.statics.createAccount = async function (username,face_embeddings){
    try {
        const temp = {
            username : username ,
            face_embeddings : face_embeddings,
        }
        const created = await this.create(temp) ;
        return {created : true,Account : created} ;
    }catch(error){
        console.log(error)
        return {created : false}
    }
}
AccountSchema.statics.UsernameChecker = async function (username){
    try {
        const user = await this.findOne({username : username})
        if(user == null){
            return false
        }
        return true
    }catch(err){
        console.log(err)
        return false
    }
}
module.exports = mongoose.model("Account",AccountSchema)