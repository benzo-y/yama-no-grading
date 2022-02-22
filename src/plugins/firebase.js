import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"

// Initialize Firebase
const firebaseConfig  = {
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
};

export default initializeApp(firebaseConfig);
export const db = getFirestore();