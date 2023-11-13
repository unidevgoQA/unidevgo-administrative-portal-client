import React from "react";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();

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
                  <input type="text" name="name" />
                </div>
                <div className="col-md-6">
                  <label>Desgination</label>
                  <input type="text" name="designation" />
                </div>
                <div className="col-md-6">
                  <label>Joining Date</label>
                  <input type="date" name="date" id="" />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input type="text" name="mobile" />
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
                  <select name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label>Address</label>
                  <input type="text" name="address" />
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
