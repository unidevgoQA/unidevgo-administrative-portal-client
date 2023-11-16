import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './dashboard.scss';
const dashboard = () => {
  return (
    <div className='dashboard overflow-x-hidden'>
        <div className="row g-0">
            <div className="col-lg-2 col-md-2 col-sm-3">
                <Sidebar/>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-9">   
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default dashboard