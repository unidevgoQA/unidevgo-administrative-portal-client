import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
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
  //Update
  const resetPassword = (email) => {
    console.log(email)
    sendPasswordResetEmail(auth, email)
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    
      console.log(errorMessage)
    });
  };

  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(result => {
      console.log(result);
    })
  }

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
    resetPassword,
    verifyEmail,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
