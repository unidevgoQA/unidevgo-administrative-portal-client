import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProviders = ({ children }) => {
  //User
  const [user, setUser] = useState({});
  const [registerUser, setRegisterUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  //User with google

  //Create user google
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  //Login
  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  //logout
  const logoutUser = () => {
    return signOut(auth);
  };

  //Observer
  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubsribe();
    };
  }, []);

  const authInfo = {
    user,
    registerUser,
    loading,
    createUser,
    isOpen,
    setIsOpen,
    loginUser,
    logoutUser,
    loginWithGoogle,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
