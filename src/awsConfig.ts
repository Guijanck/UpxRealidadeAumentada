import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XXXXXXX',
    userPoolWebClientId: 'XXXXXXXXXXXX',
    authenticationFlowType: 'USER_SRP_AUTH',
  },
});