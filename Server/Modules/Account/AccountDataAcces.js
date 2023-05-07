const AccountModel = require("./Models/AccountModel")

const AccountDataAcces = {
    createAccount : async (username,face_embeddings) => {
        try{
            const user = await AccountModel.createAccount(username,face_embeddings);
            if(user.created){
                return user ;
            }
            else{
                return false
            }
        }catch(error){
            return "error"
        }
    } ,
    GetFacialEmbedding : async (username) => {
        const facialEmbedding = await AccountModel.getFacialEmbedding(username).then(res => {
            if(res['message'] == "USER_NOT_FOUND"){
                return null ;
            }else{
                //TEKHDEM
                //console.log("res : " + res.facialEmbeddings)
                return res.facialEmbeddings ;
            }
        })
        return facialEmbedding;
    },
    UsernameCheck : async (username) => {
        try{
           const Check = await AccountModel.UsernameChecker(username)
           if(Check == true){
            return true
           }
           else if (Check == false){
            return false
           }
           else{
            return false;
           }
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = AccountDataAcces