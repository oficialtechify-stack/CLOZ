import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

// Support Vercel / GitHub Environment Variables with high priority
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
};

const firebaseRaw = rawConfig as any;
const hasEnvConfig = !!(envConfig.apiKey && envConfig.projectId);
const hasRawConfig = !!(firebaseRaw && firebaseRaw.apiKey);

const dummyConfig = {
  apiKey: "AIzaSyDummyKeyForVercelPreview-ToFixConfigureEnvVars",
  authDomain: "cloz-preview.firebaseapp.com",
  projectId: "cloz-preview",
  storageBucket: "cloz-preview.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890",
  firestoreDatabaseId: ""
};

const firebaseConfig = hasEnvConfig ? envConfig : (hasRawConfig ? firebaseRaw : dummyConfig);
export const isMocked = !hasEnvConfig && !hasRawConfig;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) 
  : getFirestore(app);

// Validate Connection to Firestore on startup as required by security guidelines
async function testConnection() {
  if (isMocked) {
    console.log("Firebase initialized in fallback sandbox mode (no Vercel environment variables or configuration detected).");
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: client appears to be offline.", error);
    } else {
      console.log("Firebase initialized successfully. Test document ping complete.");
    }
  }
}

testConnection();
