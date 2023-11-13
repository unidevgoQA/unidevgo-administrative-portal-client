import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
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
            <form >
              <div className="row">
                <div className="col-md-6">
                  <label>Name</label>
                  <input defaultValue={updateProfile?.name} type="text" name="name" />
                </div>
                <div className="col-md-6">
                  <label>Designation</label>
                  <input defaultValue={updateProfile?.desgination} type="text" name="designation" />
                </div>
                <div className="col-md-6">
                  <label>Joining Date</label>
                  <input defaultValue={updateProfile?.joiningDate} type="date" name="date" id="" />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input defaultValue={updateProfile?.mobile} type="text" name="mobile" />
                </div>
                <div className="col-md-6">
                  <label>Upload Image</label>
                  <input
                    name="img"
                    className="file"
                    type="file"
                    required
                    accept="image/*"
                  />
                </div>

                <div className="col-md-6">
                  <label for="gender">Gender</label>
                  <select defaultValue={updateProfile?.gender} name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label>Address</label>
                  <input defaultValue={updateProfile?.address} type="text" name="address" />
                </div>

                <div className="col-md-6">
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
