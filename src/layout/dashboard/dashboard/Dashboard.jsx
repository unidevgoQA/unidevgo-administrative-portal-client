import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'

const dashboard = () => {
  return (
    <div className='dashboard'>
        <div className="row">
            <div className="col-md-1">
                <Sidebar/>
            </div>
            <div className="col-md-11">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default dashboard