// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { environment } from './config/environments';
import { Amplify } from "aws-amplify";
import Routes from './navigation';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolWebClientId,
    }
  }
});

const App = () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default App;
