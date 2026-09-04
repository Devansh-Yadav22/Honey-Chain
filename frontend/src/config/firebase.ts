import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDNWGE1-3jgQIi0zb56okwNRmMSf3Rmwng',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'honey-chain-f3563.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'honey-chain-f3563',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'honey-chain-f3563.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '201774746282',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:201774746282:web:5dac96fd114c44462a1ed3'
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  app, 
  auth, 
  signInWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
};
export type { FirebaseUser };
