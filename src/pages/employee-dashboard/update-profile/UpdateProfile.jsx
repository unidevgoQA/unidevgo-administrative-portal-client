import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useUpdateProfileMutation } from "../../../features/profile/profileApi";

const UpdateProfile = () => {
  const [appleProfileUpdate, { isLoading, isSuccess }] =
    useUpdateProfileMutation();

  // state
  const [updateProfile, setUpdateProfile] = useState({});

  //Get id
  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}profile/${id}`;

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setUpdateProfile(data?.data));
  }, [id]);

  //update profile
  const handleNameChange = (e) => {
    const updatedName = e.target.value;
    // Create a shallow copy of the object using the spread operator
    const updatedProfile = { ...updateProfile ,  };

    // Update the specific field
    updateProfile.name = updatedName;

    // Set the updated object in the state
    setUpdateProfile(updatedProfile);
  };
  // const handleDesignationChange = (e) => {
  //   const updatedDesignation = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     desgination: updatedDesignation,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };
  // const handleGenderChange = (e) => {
  //   const updatedGender = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     gender: updatedGender,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };
  // const handleJoiningDateChange = (e) => {
  //   const updatedJoiningDate = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     joiningDate: updatedJoiningDate,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };
  // const handleMobileChange = (e) => {
  //   const updatedMobile = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     mobile: updatedMobile,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };

  // const handleAddressChange = (e) => {
  //   const updatedAddress = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     address: updatedAddress,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };

  // const handleRoleChange = (e) => {
  //   const updatedRole = e.target.value;
  //   const updatedProfile = {
  //     ...updateProfile,
  //     role: updatedRole,
  //   };
  //   setUpdateProfile(updatedProfile);
  // };

  //Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log(updateProfile);
    // appleProfileUpdate({ id: id, data: { updateProfile } });
  };

  // Update effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Updated Successfully", { id: "update-profile" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "update-profile" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Update Profile</span> <i class="fa-solid fa-file-pen"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleProfileUpdate}>
              <div className="row">
                <div className="col-md-6">
                  <label>Name</label>
                  <input
                    onChange={handleNameChange}
                    value={updateProfile?.name}
                    type="text"
                    name="name"
                  />
                </div>
                <div className="col-md-6">
                  <label>Designation</label>
                  <input
                    // onChange={handleDesignationChange}
                    value={updateProfile?.desgination}
                    type="text"
                    name="designation"
                  />
                </div>
                <div className="col-md-6">
                  <label>Address</label>
                  <input
                    // onChange={handleAddressChange}
                    value={updateProfile?.address}
                    type="text"
                    name="address"
                  />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input
                    // onChange={handleMobileChange}
                    value={updateProfile?.mobile}
                    type="text"
                    name="mobile"
                  />
                </div>
                <div className="col-md-4">
                  <label>Joining Date</label>
                  <input
                    // onChange={handleJoiningDateChange}
                    value={updateProfile?.joiningDate}
                    type="date"
                    name="date"
                    id=""
                  />
                </div>

                <div className="col-md-4">
                  <label for="gender">Gender</label>
                  <select
                    // onChange={handleGenderChange}
                    value={updateProfile?.gender}
                    name="gender"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label for="role">Role</label>
                  <select
                    // onChange={handleRoleChange}
                    value={updateProfile?.role}
                    name="role"
                  >
                    <option value="super admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <button className="submit-btn">Update Profile</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
