import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useDeleteProfileMutation,
  useGetProfilesQuery,
} from "../../../features/profile/profileApi";
import "./all-employee.scss";

const AllEmployee = () => {
  //Api
  const { data } = useGetProfilesQuery();
  const [deleteProfile, { isSuccess, isLoading }] = useDeleteProfileMutation();

  //set data
  const employees = data?.data;

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteProfile(id);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-profile" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-profile" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>All Employee</span> <i class="fa-solid fa-people-group"></i>{" "}
            </h2>
          </div>
          <table class="table-modify table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Designation</th>
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
                  <td>{employee?.desgination}</td>
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
                      onClick={() => handleDelete(employee._id)}
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
