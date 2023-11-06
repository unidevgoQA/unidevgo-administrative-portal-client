import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../providers/AuthProviders";

const Register = () => {
  const {createUser} = useContext(AuthContext);
  //State
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  //Register Handler
  const handleRegister = (e) => {
    e.preventDefault();

    createUser(email,password)
    .then(result =>{
      console.log(result.user)
    })
    .catch(err => console.log(err))
    console.log(email,password)
  }

  return (
    <div className="login-register">
      <div className="container">
        <div className="row g-0 login-regsiter-content-wrapper">
          <div className="col-md-6">
            <div className="login-regsiter-right-content">
              <h4>Register Your Account</h4>
              <form onSubmit={handleRegister}>
                <div className="input-wrapper">
                  <input onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Your Email" />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Your Password" />
                  <i class="fa-solid fa-lock"></i>
                </div>

                <button className="login-register-btn" type="submit">
                  Register <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
                <h4>Or Register With</h4>

                <button className="login-register-btn">
                  {" "}
                  Google
                  <i class="fa-brands fa-google"></i> 
                </button>
                <hr />
                <div className="login-register-navigation">
                  <h4>Already have account ?</h4>
                  <Link to={"/"}>
                    Login <i class="fa-solid fa-arrow-right"></i>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-regsiter-left-content">
              <img src={logo} alt="logo" />
              <h2>
                Administrative <br /> Portal
              </h2>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
