import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProviders';

const PrivateRoute = ({children}) => {

    const {user , loading} = useContext(AuthContext);
    if(loading){
        return <h2>Loading</h2>
    }

    if(user){
        return children;
    }
  return (
    <Navigate to={'/'} replace={true}></Navigate>
  )
}

export default PrivateRoute