import React from 'react';
import { Link } from 'react-router-dom';
import employeeImg from "../../../assets/employee.jpg";
import { useGetAllLeavesQuery } from '../../../features/leave-management/leaveManagementApi';
const LeaveManagement = () => {

  const {data} = useGetAllLeavesQuery();

  const allLeaveManagements = data?.data;
  console.log(allLeaveManagements)

  const allLeaveManagement = [
    { 
      id:1,

      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:2,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:3,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:4,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:5,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:6,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:7,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:8,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:9,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:10,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    { 
      id:11,
      image : employeeImg,
      name : 'Sarah Smith',
      applyDate : "10-09-23",
      status : "Approved",
      leaveFrom : "18-09-23",
      leaveTo : "22-09-23",
      leaveType : "Sick",
    },
    
    
  ]
  return (
    <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>
                <span>Leave Management</span>{" "}
                <i class="fa-solid fa-list-check"></i>
              </h2>
            </div>
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Apply Date</th>
                  <th>Status</th>
                  <th>Leave From</th>
                  <th>Leave To</th>
                  <th>Leave Type</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {allLeaveManagements?.map((leave) => (
                  <tr>
                    <td>
                      <img
                        className="employee-img"
                        src={leave?.employeeImg}
                        alt="employee"
                      />
                    </td>
                    <td>{leave?.employeeName}</td>
                    <td>{leave?.leaveApply}</td>
                    <td>{leave?.status}</td>
                    <td>{leave?.leaveFrom}</td>
                    <td>{leave?.leaveTo}</td>
                    <td>{leave?.type}</td>

                    <td>
                      <Link to={`update-leave-status/${leave.id}`}>
                        <button className="update-btn">
                          {" "}
                          <i className="far fa-edit"></i>
                        </button>
                      </Link>

                      <button
                        // onClick={() => handleDelete(employee.id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default LeaveManagement