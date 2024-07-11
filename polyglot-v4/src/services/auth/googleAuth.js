import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const googleConfig = {
  clientId: '449374999300-bc3panlbcp9h3sl1elahb6bnuifld90t.apps.googleusercontent.com',
};
