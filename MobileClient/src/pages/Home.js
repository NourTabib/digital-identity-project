import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SVGImage from 'react-native-svg-image';


const Home = ({ navigation }) => {
    /*
    // A FUNCTION THAT REQUEST A REGISTRATION ID
    // ONCE THE ID IS AVAILABLE, PROVIDING THE REGISTRATION FORM ID TO THE NAVIGATOR
    // THEN NAVIGATE TO REGISTRATION PAGE
    // THE FORM ID IS A REFERENCE TO THE FOLDER WHERE  THE PICTURES SHOULD BE STORED IN THE SERVER
    const RegistreHandler = () => {
    }
    */
    return (
        <View style={styles.root} >
            <Text>Welcome</Text>
            <Image style={{ height: 110, width: 110 }} source={require('../../assets/facescan.png')} />
            <View style={styles.buttonContainer} >
                <Button title='Authentification'
                onPress={() => { navigation.navigate('Authentification') }}
                />
            </View>
            <View style={styles.buttonContainer} >
                <Button title='         Registre         '
                onPress={() => { navigation.navigate('Register')}}                
                />
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 30
    }
})