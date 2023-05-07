import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'


const Register = () => {
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const onSubmit = (data) => {
        alert(data)
    }
    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    onChangeText={(username) => { setUsername(username) }}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    textContentType='password'
                    onChangeText={(Password) => { setPassword(Password) }}
                />
            </View>
            <View >
                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginText} >Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    styles: {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',

        },
        loginBtn:
        {
            width: "80%",
            borderRadius: 25,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            backgroundColor: "#FF1493",
        }
        ,
        inputView: {
            backgroundColor: "#FFC0CB",
            borderRadius: 30,
            width: "70%",
            height: 45,
            marginBottom: 20,
            alignItems: "center",

        },
        textInput: {
            height: 50,
            flex: 1,
            padding: 10,
            marginLeft: 20,
            marginTop: 300
        }
    }
})