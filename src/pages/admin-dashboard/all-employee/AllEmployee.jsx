import React from "react";
import { Link } from "react-router-dom";
import { useGetProfilesQuery } from "../../../features/profile/profileApi";
import './all-employee.scss';

const AllEmployee = () => {

  const {data} = useGetProfilesQuery()

  const employees = data?.data;


  return (
    <div className="content-wrapper">

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
                {employees?.map((employee) => (
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
                      <Link to={`/dashboard/update-profile/${employee._id}`}>
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
  );
};

export default AllEmployee;
