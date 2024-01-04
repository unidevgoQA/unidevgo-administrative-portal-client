import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import {
  useGetProfileByEmailQuery,
  useUpdateProfileMutation,
} from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const UpdateProfile = () => {
  //User
  const { user } = useContext(AuthContext);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);

  //Register User
  const registerUser = userData?.data;

  const [appleProfileUpdate, { isLoading, isSuccess }] =
    useUpdateProfileMutation();

  // state
  const [updateProfile, setUpdateProfile] = useState({});

  //Get id
  const { id } = useParams();

  const navigate = useNavigate();

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

    if (updatedName.length <= 30) {
      const updatedProfile = {
        name: updatedName,
        desgination: updateProfile.desgination,
        gender: updateProfile.gender,
        joiningDate: updateProfile.joiningDate,
        mobile: updateProfile.mobile,
        role: updateProfile.role,
        address: updateProfile.address,
        img: updateProfile.img,
        email: updateProfile.email,
      };
      setUpdateProfile(updatedProfile);
    } else {
      toast.error("Name cannot be more than 25 characters");
    }
  };

  const handleDesignationChange = (e) => {
    const updatedDesignation = e.target.value;
    const updatedProfile = {
      name: updateProfile.name,
      desgination: updatedDesignation,
      gender: updateProfile.gender,
      joiningDate: updateProfile.joiningDate,
      mobile: updateProfile.mobile,
      role: updateProfile.role,
      address: updateProfile.address,
      img: updateProfile.img,
      email: updateProfile.email,
    };

    setUpdateProfile(updatedProfile);
  };
  const handleGenderChange = (e) => {
    const updatedGender = e.target.value;
    const updatedProfile = {
      name: updateProfile.name,
      desgination: updateProfile.desgination,
      gender: updatedGender,
      joiningDate: updateProfile.joiningDate,
      mobile: updateProfile.mobile,
      role: updateProfile.role,
      address: updateProfile.address,
      img: updateProfile.img,
      email: updateProfile.email,
    };
    setUpdateProfile(updatedProfile);
  };
  const handleJoiningDateChange = (e) => {
    const updatedJoiningDate = e.target.value;
    const updatedProfile = {
      name: updateProfile.name,
      desgination: updateProfile.desgination,
      gender: updateProfile.gender,
      joiningDate: updatedJoiningDate,
      mobile: updateProfile.mobile,
      role: updateProfile.role,
      address: updateProfile.address,
      img: updateProfile.img,
      email: updateProfile.email,
    };
    setUpdateProfile(updatedProfile);
  };
  const handleMobileChange = (e) => {
    const updatedMobile = e.target.value;
    const updatedProfile = {
      name: updateProfile.name,
      desgination: updateProfile.desgination,
      gender: updateProfile.gender,
      joiningDate: updateProfile.joiningDate,
      mobile: updatedMobile,
      role: updateProfile.role,
      address: updateProfile.address,
      img: updateProfile.img,
      email: updateProfile.email,
    };
    setUpdateProfile(updatedProfile);
  };

  const handleAddressChange = (e) => {
    const updatedAddress = e.target.value;

    if (updatedAddress.length <= 50) {
      const updatedProfile = {
        name: updateProfile.name,
        desgination: updateProfile.desgination,
        gender: updateProfile.gender,
        joiningDate: updateProfile.joiningDate,
        mobile: updateProfile.mobile,
        role: updateProfile.role,
        address: updatedAddress,
        img: updateProfile.img,
        email: updateProfile.email,
      };
      setUpdateProfile(updatedProfile);
    } else {
      toast.error("Address cannot be more than 50 characters");
    }
  };

  const handleRoleChange = (e) => {
    const updatedRole = e.target.value;
    const updatedProfile = {
      name: updateProfile.name,
      desgination: updateProfile.desgination,
      gender: updateProfile.gender,
      joiningDate: updateProfile.joiningDate,
      mobile: updateProfile.mobile,
      role: updatedRole,
      address: updateProfile.address,
      img: updateProfile.img,
      email: updateProfile.email,
    };
    setUpdateProfile(updatedProfile);
  };

  //Update Handler
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    appleProfileUpdate({ id: id, data: { updateProfile } });
    // navigate(-1)
  };

  //Update effects
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
                  <label>
                    Name <span>*</span>
                  </label>
                  <input
                    required
                    onChange={handleNameChange}
                    value={updateProfile?.name}
                    type="text"
                    name="name"
                  />
                </div>
                <div className="col-md-6">
                  <label>Designation</label>
                  <select
                    onChange={handleDesignationChange}
                    value={updateProfile?.desgination}
                    name="designation"
                  >
                    <option value="Software QA Engineer">
                      Software QA Engineer
                    </option>
                    <option value="Software Engineer">Software Engineer</option>

                    <option value="Junior Software QA Engineer">
                      Junior Software QA Engineer
                    </option>

                    <option value="Junior Software Engineer">
                      Junior Software Engineer
                    </option>
                    <option value="Senior Software QA Engineer">
                      Senior Software QA Engineer
                    </option>
                    <option value="Senior Software Engineer">
                      Senior Software Engineer
                    </option>
                    <option value="Technical Lead">Technical Lead</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Address</label>
                  <input
                    onChange={handleAddressChange}
                    value={updateProfile?.address}
                    type="text"
                    name="address"
                  />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input
                    onChange={handleMobileChange}
                    value={updateProfile?.mobile}
                    type="tel"
                    pattern="[0-9]{11}"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div
                  className={
                    registerUser?.role === "super admin"
                      ? "col-md-4"
                      : "col-md-6"
                  }
                >
                  <label>Joining Date</label>
                  <input
                    onChange={handleJoiningDateChange}
                    value={updateProfile?.joiningDate}
                    type="date"
                    name="date"
                    id=""
                  />
                </div>

                <div
                  className={
                    registerUser?.role === "super admin"
                      ? "col-md-4"
                      : "col-md-6"
                  }
                >
                  <label for="gender">Gender</label>
                  <select
                    onChange={handleGenderChange}
                    value={updateProfile?.gender}
                    name="gender"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                {registerUser?.role === "super admin" && (
                  <div className="col-md-4">
                    <label for="role">Role</label>
                    <select
                      onChange={handleRoleChange}
                      value={updateProfile?.role}
                      name="role"
                    >
                      <option value="super admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                )}

                <div className="col-md-12">
                  <button className="submit-btn">Update Profile</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default UpdateProfile;
