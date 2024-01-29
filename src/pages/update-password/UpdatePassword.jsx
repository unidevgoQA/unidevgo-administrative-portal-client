import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders";
// import './login.scss';

const UpdatePassword = () => {
  const { UpdatePassword } = useContext(AuthContext);

  const [showError, setShowError] = useState("");

  //State
  const navigate = useNavigate();

  const { handleSubmit, register, reset } = useForm();

  const onSubmit = ({ email }) => {
    console.log(email)
    UpdatePassword(email)
      .then((result) => {
        toast.success("Email Send Successfully", {id:'update-password'});
        navigate("/")
       
      })
      .catch((err) => {
        toast.error(err.message , {id:'update-password'});
      });
  };

  useEffect(() => {
    if (showError) {
      toast.error(showError);
    }
  }, [showError]);

  return (
    <div className="login-register login-wrapper-main">
      <div className="container">
        <div className="row g-0 login-regsiter-content-wrapper">
         
          <div className="col-lg-12 col-md-12">
            <div className="login-regsiter-right-content">
              <h4>Update Password</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Your Email"
                    {...register("email")}
                  />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                
                {/* {showError && (
                  <div
                    className={
                      disableErrorArea === true
                        ? "hide-error-message"
                        : "error-message"
                    }
                  >
                    <>
                      <span>{showError}</span>
                      <i
                        onClick={() => setDisableErrorArea(true)}
                        class="fa-solid fa-xmark"
                      ></i>
                    </>
                  </div>
                )} */}

                <button className="login-register-btn" type="submit">
                  <span>Send Email</span> <i class="fa-solid fa-arrow-right"></i>
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
