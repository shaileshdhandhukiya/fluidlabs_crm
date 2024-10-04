import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import bgImage from "@/assets/images/all-img/page-bg.png";
import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";

const login3 = () => {
  const [isDark] = useDarkMode();
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login3;
