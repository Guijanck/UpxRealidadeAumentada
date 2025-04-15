// useAuth.ts
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { environment } from '../../../config/environments';

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

      console.log("Entrou no método");

      const user = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      console.log("Instanciou o usuário");
      console.log(user);

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      console.log("Instanciou o authDetails");
      console.log(authDetails);

      user.authenticateUser(authDetails, {
        
        onSuccess: (result: { getAccessToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getIdToken: () => { (): any; new(): any; getJwtToken: { (): any; new(): any; }; }; getRefreshToken: () => { (): any; new(): any; getToken: { (): any; new(): any; }; }; }) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          console.log("Entrou no método de sucesso");
          
          console.log(accessToken);
          console.log(idToken);
          console.log(refreshToken);

          resolve({
            success: true,
            tokens: { accessToken, idToken, refreshToken },
          });
        },
        onFailure: (err: { message: any; }) => {
          console.log("Entrou no método de falha")
          console.log(err);
          console.log(err.message);

          reject({ success: false, error: err.message });
        },
        newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
          // Caso seja necessário trocar a senha
          resolve({
            success: false,
            challenge: 'NEW_PASSWORD_REQUIRED',
            user,
            userAttributes,
            requiredAttributes,
          });
        },
        mfaRequired: (challengeName: any, challengeParameters: any) => {
          // Caso o MFA esteja habilitado
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