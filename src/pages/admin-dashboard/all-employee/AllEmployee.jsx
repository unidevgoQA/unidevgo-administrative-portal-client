import React from "react";
import { Link } from "react-router-dom";
import employeeImg from "../../../assets/employee.jpg";
import './all-employee.scss';

const AllEmployee = () => {
  const employees = [
    {
      id: 1,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 2,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 3,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 4,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 6,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 7,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 8,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 9,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 10,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 11,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
    {
      id: 12,
      img: employeeImg,
      name: "Sarah Smith",
      designation: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
      address: "Dhanmondi , Dhaka",
      joiningDate: "01-06-22",
    },
  ];
  return (
    <div className="table-wrapper-content">
      {/* <div className="container"> */}
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>
                <span>All Employee</span>{" "}
                <i class="fa-solid fa-people-group"></i>{" "}
              </h2>
            </div>
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Desgination</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Joining Date</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr>
                    <td>
                      <img
                        className="employee-img"
                        src={employee?.img}
                        alt="employee"
                      />
                    </td>
                    <td>{employee?.name}</td>
                    <td>{employee?.designation}</td>
                    <td>{employee?.mobile}</td>
                    <td>{employee?.email}</td>
                    <td>{employee?.address}</td>
                    <td>{employee?.joiningDate}</td>

                    <td>
                      <Link to={`update-employee/${employee.id}`}>
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
      {/* </div> */}
    </div>
  );
};

export default AllEmployee;
