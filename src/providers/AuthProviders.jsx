import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);


const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [registerUser, setRegisterUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  
  //User persistance 
  useEffect(() => {
    const storedUser = localStorage.getItem('profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  //Login profile handler
  const loginUser = async (email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/login`,{ email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('profile', JSON.stringify(response.data.profile));
    setUser(response.data.profile);
    setRegisterUser(response.data.profile);
    return response;
  };
  //Logout profile
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setUser(null);
  };

  const authInfo = {
    user,
    registerUser,
    loading,
    isOpen,
    setIsOpen,
    logoutUser,
    loginUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProviders;
