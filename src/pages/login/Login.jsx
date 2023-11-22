import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../providers/AuthProviders";

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const [showError, setShowError] = useState("");
  const [disableErrorArea, setDisableErrorArea] = useState(false);

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
      .catch((err) => setShowError(err.message));
  };

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
                    type="password"
                    placeholder="Your Password"
                    {...register("password")}
                  />
                  <i class="fa-solid fa-lock"></i>
                </div>
                {showError && (
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
                )}

                <button className="login-register-btn" type="submit">
                  <span>Login</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
                {/* <h4>Or Login With</h4>

                <button
                  className="login-register-btn"
                  onClick={handleGoogleLogin}
                >
                  {" "}
                  Google
                  <i class="fa-brands fa-google"></i>
                </button> */}
                {/* <hr /> */}
                <div className="login-register-navigation">
                  <h4>Dont have account ?</h4>
                  <Link to={"/register"}>
                    Register <i class="fa-solid fa-arrow-right"></i>{" "}
                  </Link>
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
