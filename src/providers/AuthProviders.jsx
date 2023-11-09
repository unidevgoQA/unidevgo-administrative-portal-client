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
  console.log(registerUser)
  const [loading, setLoading] = useState(true);

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

  // useEffect(()=>{
  //   fetch(`http://localhost:5000/profile/${user.email}`)
  //   .then(res=>res.json())
  //   .then(data => setRegisterUser(data.data))
  // },[user.email])

  const authInfo = {
    user,
    registerUser,
    loading,
    createUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
