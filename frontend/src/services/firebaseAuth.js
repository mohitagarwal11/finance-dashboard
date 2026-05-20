import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase.js";

export const signupWithEmail = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  // console.log("Registered user:", userCred.user);
  await sendEmailVerification(userCred.user);
  // console.log("verification email sent to:", userCred.user.email);
  return userCred.user;
};

export const loginWithEmail = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  // console.log("Logged in user:", userCred.user);
  return userCred.user;
};

const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logoutFirebase = async () => {
  await signOut(auth);
};
