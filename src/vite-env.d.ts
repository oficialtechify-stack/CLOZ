/// <reference types="vite/client" />

declare module '../../firebase-applet-config.json' {
  const content: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
    firestoreDatabaseId?: string;
  };
  export default content;
}
