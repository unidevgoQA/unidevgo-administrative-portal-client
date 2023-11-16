import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProviders';
import Sidebar from '../sidebar/Sidebar';
const dashboard = () => {
  const { isOpen, setIsOpen } = useContext(AuthContext);
  return (
    <div className='dashboard overflow-x-hidden'>
        <div className="row g-0">
            <div className={isOpen === true ? "col-lg-2 col-md-2 col-sm-0" : "col-lg-1 col-md-1- col-sm-1"}>
                <Sidebar/>
            </div>
            <div className={isOpen === true ? "col-lg-10 col-md-10 col-sm-12" : "col-lg-11 col-md-11- col-sm-11"}>   
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default dashboard