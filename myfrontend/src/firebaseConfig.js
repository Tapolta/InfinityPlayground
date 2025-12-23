import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA63SzWKBWoWT5i8oQfiWzEPswiUCIvsIU",
  authDomain: "infinityplayground-aeb4a.firebaseapp.com",
  projectId: "infinityplayground-aeb4a",
  storageBucket: "infinityplayground-aeb4a.firebasestorage.app",
  messagingSenderId: "499571769712",
  appId: "1:499571769712:web:02a80154a7c6ff609e4fb5",
  measurementId: "G-VKLSMHH0SC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async () => {
  await signOut(auth);
};

export const getFirebaseToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

export default auth;
