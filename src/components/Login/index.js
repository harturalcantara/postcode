import React from "react";
import { auth, provider } from "../../services/firebase";
import "./css/main.css";
import "./css/util.css";

const Login = () => {
  const handleSignin = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <center> <h3> Postcode </h3> </center>
            <form className="login100-form validate-form flex-sb flex-w">
              <div className="p-t-31 p-b-9">
                <span className="txt1">Username</span>
              </div>
              <div
                className="wrap-input100 validate-input"
                data-validate="Username is required"
              >
                <input className="input100" type="text" name="username" />
                <span className="focus-input100"></span>
              </div>

              <div className="p-t-13 p-b-9">
                <span className="txt1">Password</span>

                <a href="https://www.example.com" className="txt2 bo1 m-l-5">
                  Forgot?
                </a>
              </div>
              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input className="input100" type="password" name="pass" />
                <span className="focus-input100"></span>
              </div>

              <div className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn">Sign In</button>
              </div>

              <span className="login100-form-title p-b-30 m-t-30"><center> <h4> Sign In With </h4> </center></span>
              

              <a href="https://www.example.com" className="btn-face m-b-20">
                <i className="fa fa-facebook-official"></i>
                Facebook
              </a>

              <a
                href="https://www.example.com"
                className="btn-google m-b-20"
                onClick={(e) => {
                  e.preventDefault(); // Evita a ação padrão de seguir o link
                  handleSignin(); // Chama a função handleSignin
                }}
              >
                <i className="fa fa-google"></i>
                <div className="m-l-20"> Google </div>
              </a>

              <div className="w-full text-center p-t-55">
                <span className="txt2">Not a member?</span>

                <a href="https://www.example.com" className="txt2 bo1 m-l-5">
                   Sign up now
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="dropDownSelect1"></div>
    </>
    /*<C.Container>
      <C.Button onClick={handleSignin}>Login com Google</C.Button>
    </C.Container>*/
  );
};

export default Login;
