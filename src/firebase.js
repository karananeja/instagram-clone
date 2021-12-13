import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBkTDIGScPjutXtHmL9mlJLRb0Xt7cheOQ',
  authDomain: 'instagram-clone-3eccd.firebaseapp.com',
  projectId: 'instagram-clone-3eccd',
  storageBucket: 'instagram-clone-3eccd.appspot.com',
  messagingSenderId: '508378124119',
  appId: '1:508378124119:web:07c84515a23952b4be3812',
  measurementId: '${config.measurementId}',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
export default db;
