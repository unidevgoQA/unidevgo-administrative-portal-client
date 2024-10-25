import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultImg from "../../../assets/default.png";
import GoBack from "../../../components/go-back/GoBack";
import SwitchButton from "../../../components/switch-button/SwitchButton";
import {
  useDeleteProfileMutation,
  useGetProfileByEmailQuery,
  useGetProfilesQuery,
  useUpdateAppointmentPermissionMutation,
  useUpdateProfileEditPermissionMutation,
} from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const AllEmployee = () => {
  //User
  const { user } = useContext(AuthContext);

  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);

  const registerUser = userData?.data;

  const [
    updateProfileEditPermission,
    { isSuccess: permissionUpdateSuccess, isLoading: permissionUpdateLoading },
  ] = useUpdateProfileEditPermissionMutation();
  const [
    updateAppointmentPermission,
    {
      isSuccess: AppointmentPermissionUpdateSuccess,
      isLoading: AppointmentPermissionUpdateLoading,
    },
  ] = useUpdateAppointmentPermissionMutation();

  //Api
  const { data } = useGetProfilesQuery();
  const [deleteProfile, { isSuccess, isLoading }] = useDeleteProfileMutation();

  //set data
  const allProfiles = data?.data;
  //Filter Employees
  const employees = allProfiles?.filter(
    (profile) => profile?.role === "employee"
  );
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

  //handle update profile edit permission
  const handleEditProfilePermissionChange = (id, editPermisson) => {
    const updatedPermission = editPermisson === "true" ? "false" : "true";
    const updateProfileEdit = {
      profileEditPermission: updatedPermission,
    };
    updateProfileEditPermission({ id: id, data: updateProfileEdit });
  };

  //update profile edit permission effects
  //handle update profile edit permission
  const handleAppointmentPermissionChange = (id, editPermisson) => {
    const updatedPermission = editPermisson === "true" ? "false" : "true";
    const updatedAppointment = {
      appointmentPermission: updatedPermission,
    };
    updateAppointmentPermission({ id: id, data: updatedAppointment });
  };

  //update profile edit permission effects
  useEffect(() => {
    if (permissionUpdateSuccess) {
      toast.success("Permission updated", {
        id: "update-edit-profile-permission",
      });
    }
    if (permissionUpdateLoading) {
      toast.loading("Loading", { id: "update-edit-profile-permission" });
    }
  }, [permissionUpdateSuccess, permissionUpdateLoading]);

  //update appointment permission effects
  useEffect(() => {
    if (AppointmentPermissionUpdateSuccess) {
      toast.success("Permission updated", {
        id: "update-appointment-permission",
      });
    }
    if (AppointmentPermissionUpdateLoading) {
      toast.loading("Loading", { id: "update-appointment-permission" });
    }
  }, [AppointmentPermissionUpdateSuccess, AppointmentPermissionUpdateLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>All Employee</span> <i class="fa-solid fa-people-group"></i>{" "}
            </h2>
          </div>
          <div className="table-responsive">
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Joining Date</th>
                  {registerUser?.role === "super admin" && (
                    <>
                      {" "}
                      <th>Appointment</th>
                      <th>Profile Edit</th>
                    </>
                  )}
                  <th>Details</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees?.map((employee) => (
                  <tr key={employee?._id}>
                    <td>
                      <img
                        className="employee-img"
                        src={employee?.img ? employee?.img : defaultImg}
                        alt="employee"
                      />
                    </td>
                    <td>{employee?.name}</td>
                    <td>{employee?.designation}</td>
                    <td>{employee?.mobile}</td>
                    <td>{employee?.role}</td>
                    <td style={{ textTransform: "lowercase" }}>
                      {employee?.email}
                    </td>
                    <td>{employee?.address}</td>
                    <td>
                      {employee?.joiningDate?.split("-").reverse().join("-")}
                    </td>
                    {registerUser?.role === "super admin" && (
                      <>
                        {" "}
                        <td>
                          <SwitchButton
                            isChecked={
                              employee?.appointmentPermission === "true"
                            }
                            onChange={() =>
                              handleAppointmentPermissionChange(
                                employee?._id,
                                employee?.appointmentPermission
                              )
                            }
                          />
                        </td>
                        <td>
                          {/* <button
                    title="Profile Edit Permission"
                    onClick={() =>
                      handleEditProfilePermissionChange(
                        employee?._id,
                        employee?.profileEditPermission
                      )
                    }
                    className={
                      employee?.profileEditPermission == "true"
                        ? "update-btn text-white bg-success"
                        : "update-btn text-white bg-danger"
                    }
                  >
                    {employee?.profileEditPermission == "true"
                      ? "Yes"
                      : "No"}
                  </button> */}

                          <SwitchButton
                            isChecked={
                              employee?.profileEditPermission === "true"
                            }
                            onChange={() =>
                              handleEditProfilePermissionChange(
                                employee?._id,
                                employee?.profileEditPermission
                              )
                            }
                          />
                        </td>
                      </>
                    )}
                    <td>
                      <Link to={`/dashboard/employee-details/${employee?._id}`}>
                        <button className="update-btn">Details</button>
                      </Link>
                    </td>

                    <td>
                      <button
                        onClick={() => handleDelete(employee?._id)}
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
      <GoBack />
    </div>
  );
};

export default AllEmployee;
