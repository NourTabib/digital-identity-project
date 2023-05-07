import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center"}}>
			<ActivityIndicator
             size="large" 
             color="#00ff00" />
             <Text style={styles.text}>Loading</Text>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    text : {
        textAlign:'center',
        top : 50,
        fontSize:30,
        color : 'white'
    }
})