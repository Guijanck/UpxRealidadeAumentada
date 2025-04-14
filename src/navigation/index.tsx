// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const Routes = () => (
  <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default Routes;
