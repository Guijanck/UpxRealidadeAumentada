// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const Routes = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export default Routes;
