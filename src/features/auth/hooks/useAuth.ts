// useAuth.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { environment } from '../../../config/environments';
import * as Keychain from 'react-native-keychain';

const poolData = {
  UserPoolId: environment.cognito.userPoolId, // Substitua pelo seu User Pool ID
  ClientId: environment.cognito.userPoolWebClientId, // Substitua pelo seu App Client ID
};

const userPool = new CognitoUserPool(poolData);

export const useAuth = () => {
  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return new Promise((resolve, reject) => {

      const user = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        
        onSuccess: async (result: { getAccessToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getIdToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getRefreshToken: () => { (): any; new(): any; getToken: { (): any; new(): any; }; }; }) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          await Keychain.setGenericPassword('idToken', idToken);

          resolve({
            success: true,
            tokens: { accessToken, idToken, refreshToken },
          });
        },
        onFailure: (err: { message: any; }) => {
          reject({ success: false, error: err.message });
        },
        newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
          resolve({
            success: false,
            challenge: 'NEW_PASSWORD_REQUIRED',
            user,
            userAttributes,
            requiredAttributes,
          });
        },
        mfaRequired: (challengeName: any, challengeParameters: any) => {
          resolve({
            success: false,
            challenge: 'MFA_REQUIRED',
            user,
            challengeName,
            challengeParameters,
          });
        },
      });
    });
  };

  const completeNewPassword = async (
    user: CognitoUser,
    newPassword: string,
    userAttributes: any
  ) => {
    return new Promise((resolve, reject) => {
      user.completeNewPasswordChallenge(newPassword, userAttributes, {
        onSuccess: (result: { getAccessToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getIdToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getRefreshToken: () => { (): any; new(): any; getToken: { (): any; new(): any; }; }; }) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          resolve({
            success: true,
            tokens: { accessToken, idToken, refreshToken },
          });
        },
        onFailure: (err: { message: any; }) => {
          reject({ success: false, error: err.message });
        },
      });
    });
  };

  return { signIn, completeNewPassword };
};