import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RegistrationDetails = ({route , navigation}) => {
  const registrationDetails = JSON.parse(route.params)
  return (
    <View>
      <Text>RegistrationDetails</Text>
    </View>
  )
}

export default RegistrationDetails

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    alignItems : 'center',
    justifyContent : 'center'
  }
})