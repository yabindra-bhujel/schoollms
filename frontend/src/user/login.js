import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./login.css";
import instance from "../api/axios";
import Alert from "@mui/material/Alert";
import logo from "../components/images/unv_logo.png";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setMessage("Please enter username and password");
      // time out in 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    try {
      const endpoint = "/api/token/";
      const response = await instance.post(endpoint, { username, password,
        
       });
      const { access, refresh, username: loggedInUsername } = response.data;

      // Store user data in localStorage only if OTP is not required
      const decodeData = jwtDecode(access);

        const userData = {
          access,
          refresh,
          isTeacher: decodeData.is_teacher,
          isStudent: decodeData.is_student,
          is_staff: decodeData.is_staff,
          is_superuser: decodeData.is_superuser,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        // Always navigate to the root path
        if (decodeData.is_student || decodeData.is_teacher) {
          navigate("/");
        } else if (decodeData.is_staff || decodeData.is_superuser) {
          navigate("/admin/student");
        }
    } catch (e) {
      setMessage(
        "Unable to authenticate your account. Please check your credentials and try again."
      );
      setPassword("");
      setUsername("");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <div className="univerity-info">
            <img src={logo} alt="Logo" />
            <h2>四国大学</h2>
          </div>

          <div className="user-form">
            {message && (
              <Alert
                severity="error"
                style={{ width: "50%", margin: "10px auto" }}
              >
                {message}
              </Alert>
            )}

            <input
              type="text"
              placeholder="User ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

              <div className="forgot-password-login">
                <button type="button" onClick={handleLogin}>
                  Login
                </button>
                
                <Link to="/resetpassword">Forgot password?</Link>
              </div>
              <div className="terms-of-use">
            <p>Term of use | Privacy policy</p>
            </div>

            </div>
        </div>

        <div className="other-image">
          <div className="help-button">
            <button>Need Help ?</button>
          </div>
        </div>
      </div>
     
    </>
  );
}

export default Login;
