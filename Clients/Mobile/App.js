import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Pages/Login'
import Register from './src/Pages/Register'
import Welcome from './src/Pages/Welcome'
import RegistrationDetails from './src/Pages/RegistrationDetails';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown : false}}>
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="RegistrationDetails" component={RegistrationDetails} />
      </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
    marginTop: 60,
    //marginBottom : 40
  },
  image: {
    flex: 1,
    //width : 400,
    //height : 300,

  },
  text: {
    marginTop: 60,
  },
  title: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '900',
    textDecorationStyle: 'solid',
  },
  imageContainer: {
    position: "absolute",
    top: 80
  }
});
