import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../providers/AuthProviders";
// import './login.scss';

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const [showError, setShowError] = useState("");
  //State
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { handleSubmit, register, reset } = useForm();

  const onSubmit = ({ email, password }) => {
    loginUser(email, password)
      .then((result) => {
        if (result.user) {
          toast.success("Login Successfully", { id: "login" });
          navigate("/dashboard/profile");
          reset();
        }
      })
      .catch((err) => {
        setShowError(err.message);
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
          <div className="col-lg-6 col-md-12">
            <div className="login-regsiter-left-content">
              <img src={logo} alt="logo" />
              <h2>
                Administrative <br /> Portal
              </h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="login-regsiter-right-content">
              <h4>Login Into Your Account</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Your Email"
                    {...register("email")}
                  />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    {...register("password")}
                  />
                  <i
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                    class="fa-solid fa-eye"
                  ></i>
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
                  <span>Login</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
                <div className="login-register-navigation">
                  <h4>Dont have account ?</h4>
                  <div className="btn-wrapper d-flex justify-content-between">
                  <Link to={"/register"}>
                  <i class="fa-solid fa-arrow-right"></i>{" "}Register 
                  </Link>
                  {/* <Link to={"/update-password"}>
                    Update Password <i class="fa-solid fa-key"></i>
                  </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
