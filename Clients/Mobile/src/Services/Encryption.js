
import AsyncStorage from '@react-native-async-storage/async-storage';
import nacl from 'tweet-nacl-react-native-expo'
const Encryption = {
    decodeStr : (str) => {
        return new Uint8Array(nacl.util.decodeUTF8(str))
    },
    encodeStr : (decodedStr) => {
        return nacl.util.encodeUTF8(decodedStr)
    },
    GenerateKeyPair :async () => {
        const keys = await nacl.box.keyPair()
        return {
            pubKey : nacl.util.encodeBase64(keys.publicKey),
            secKey : nacl.util.encodeBase64(keys.secretKey)
        }
    },
    encodeBase64 : (input) => {
        const encoded = nacl.util.encodeBase64(input)
        return encoded
    },
    decodeBase64 : (input) => {
        return nacl.util.decodeBase64(input)
    },
    GenerateSharedKey : (serverPubKey,clientPrivateKey) => {
        var uintPubKey = nacl.util.decodeBase64(serverPubKey)
        var uintPrivateKey = nacl.util.decodeBase64(clientPrivateKey)
        return nacl.util.encodeBase64(nacl.box.before(uintPubKey,uintPrivateKey))
    },
    EncryptMessage : (message,ClientSharedKey) => {

    },
    DecryptMessage : (message,nonce,SharedKey) => {
        const decodedSharedKeys = nacl.util.decodeBase64(SharedKey)
        const decodedNonce = nacl.util.decodeBase64(nonce)
        const decodedMessage = nacl.util.decodeBase64(message)
        const decryptedMessage = nacl.box.open.after(decodedMessage,decodedNonce,decodedSharedKeys)
        return nacl.util.encodeUTF8(decryptedMessage)
    },
    storeKeyPair : async (keyPaire) => {
        try {
            const jsonValue = JSON.stringify(keyPaire)
            await AsyncStorage.setItem("userKeys",jsonValue)
        }catch(e){

        }
    },
    getStoredKeyPair : async (keyPaire) => {
        const jsonValue = await AsyncStorage.getItem("keys")
        if(jsonValue != null){
            return JSON.parse(jsonValue)
        }
        else{
            return null
        }
    }
}

export default Encryption