import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './dashboard.scss';
const dashboard = () => {
  return (
    <div className='dashboard overflow-x-hidden'>
        <div className="row">
            <div className="col-md-2">
                <Sidebar/>
            </div>
            <div className="col-md-10">   
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default dashboard