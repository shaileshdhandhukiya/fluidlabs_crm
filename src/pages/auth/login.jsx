import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
import Button from "@/components/ui/Button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import bgImage from "@/assets/images/all-img/page-bg.png";
import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLogin } from "./common/store";
import { useSelector, useDispatch } from "react-redux";

const Login3 = () => {

  const dispatch = useDispatch();

  const [isDark] = useDarkMode();
  const navigate = useNavigate();


  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      try {
        // Send access_token to your backend Laravel API for Google login
        const response = await axios.post(
          'https://phplaravel-1340915-4916922.cloudwaysapps.com/api/auth/google/callback',
          { access_token } // Send the access_token in the request body
        );

        // Handle successful login and store the token
        const { data } = response;

        dispatch(handleLogin(true));
        // Store the token returned by the API for future authenticated requests
        localStorage.setItem('auth_token', data.data.token);

        localStorage.setItem('userData', data.data);

        window.localStorage.setItem("isAuth", true);

        // Redirect to a dashboard or authenticated page after successful login
        // window.location.href = "/dashboard";

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);


      } catch (error) {

        dispatch(handleLogin(false));

        toast.error("Invalid credentials", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // console.error('Google login failed:', error.response ? error.response.data : error);
      }
    },
    onError: (error) => {

      dispatch(handleLogin(false));

      console.error('Google Login Failed', error);

      toast.error("Google Login Failed", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  return (
    <>
      <ToastContainer />
      <div
        className="loginwrapper bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="lg-inner-column">
          <div className="left-columns lg:w-1/2 lg:block hidden">
            <div className="logo-box-3">
              <Link to="/" className="">
                <img src={LogoWhite} alt="" />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
            <div className="auth-box-3">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium">Sign In</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  Sign in to your account to start using Fluidlabs CRM
                </div>
              </div>
              <LoginForm />
              <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div>
              </div>
              <div className="mx-auto mt-8 w-full">
                <Button
                  text="Login With Google"
                  className="btn-secondary btn btn-dark block w-full text-center"
                  onClick={() => googleLogin()} // Trigger Google login on click
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login3;
