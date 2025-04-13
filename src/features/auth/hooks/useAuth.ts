import { signIn as amplifySignIn, confirmSignIn } from 'aws-amplify/auth';
//import { getAmplifyUserAgent, getConfig} from '@aws-amplify/core';

export const useAuth = () => {
  const signIn = async ({ username, password }: { username: string; password: string }) => {
    try {
      console.log('Iniciou try-catch');
      console.log({ username, password });

      const response = await amplifySignIn({ username, password });

      const { isSignedIn, nextStep } = response;

      console.log('isSignedIn:', isSignedIn);
      console.log('nextStep:', nextStep);

      if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        await confirmSignIn({ challengeResponse: 'Senha#Escola12' });
      }

      if (
        nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
        nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' ||
        nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
      ) {
        // await confirmSignIn({ challengeResponse: '123456' });
      }

      if (nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION') {
        // await confirmSignIn({ challengeResponse: 'EMAIL' });
      }

      return { success: true, nextStep };

    } catch (error: any) {
      console.log('Erro no login:', error.message);
      return { success: false, error: error.message };
    }
  };

  const confirmCode = async (code: string) => {
    try {
      await confirmSignIn({ challengeResponse: code });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { signIn, confirmCode };
};