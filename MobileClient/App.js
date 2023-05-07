import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Home from './src/pages/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentification from './src/pages/Authentification';
import Register from './src/pages/Register';



const Stack = createNativeStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'transparent',
  },
};

export default function App() {
  return (
    <ImageBackground resizeMode='cover' style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center' }} source={require('./assets/backGround.jpg')}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName='Home' screenOptions={{
          headerShown : false
        }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Authentification" component={Authentification} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
});
