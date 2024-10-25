import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState("");
  const navigate = useNavigate();

  const { handleSubmit, register, reset } = useForm();

  const onSubmit = async ({ email, oldPassword, newPassword }) => {
    const updateConfirm = window.confirm("Do you want to update your password?");
    
    if (updateConfirm) {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}auth/update-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, oldPassword, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Password updated successfully", { id: "update-password" });
          reset();
          navigate('/');
        } else {
          toast.error(data.message || "Failed to update password", { id: "update-password" });
        }
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Server error. Please try again later.", { id: "update-password" });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (showError) {
      toast.error(showError);
    }
  }, [showError]);

  useEffect(() => {
    if (loading) {
      toast.loading("Loading", { id: "update-password" });
    }
  }, [loading]);

  return (
    <div className="login-register login-wrapper-main">
      <div className="container">
        <div className="row g-0 login-regsiter-content-wrapper">
          <div className="col-lg-6 col-md-12">
            <div className="login-regsiter-left-content">
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="login-regsiter-right-content">
              <h4>Update Password</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-wrapper">
                  <input
                    type="email"
                    required
                    placeholder="Enter Your Email"
                    {...register("email")}
                  />
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input
                    type="password"
                    required
                    placeholder="Enter Old Password"
                    {...register("oldPassword")}
                  />
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="input-wrapper">
                  <input
                    type="password"
                    required
                    placeholder="Enter New Password"
                    {...register("newPassword")}
                  />
                  <i className="fa-solid fa-lock"></i>
                </div>
                <button className="login-register-btn" type="submit" disabled={loading}>
                  <span>Update Password</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
