import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProviders = ({ children }) => {
  //User
  const [user, setUser] = useState({});
  //Create user
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
      console.log("auth state", currentUser);
      setUser(currentUser);
    });

    return () => {
      unsubsribe();
    };
  }, []);

  const authInfo = {
    user,
    createUser,
    loginUser,
    logoutUser,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
