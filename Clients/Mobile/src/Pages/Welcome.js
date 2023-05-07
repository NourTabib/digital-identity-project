import { StyleSheet, Text, View , Image ,Button } from 'react-native'
import React from 'react'




const Welcome = ({navigation}) => {
  return (
    <View style={styles.root}>
          <Text style={styles.text}>Identifiny</Text>
            <Image style={{ height: 110, width: 110 }} source={require('../../assets/facescan.png')} />
            <View style={styles.buttonContainer} >
                <Button title='Authentification'
                onPress={() => { navigation.navigate('Login') }}
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

export default Welcome

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonContainer: {
    marginTop: 30
},
text : {
  marginBottom: 30,
  textDecorationColor : "red"

}
})