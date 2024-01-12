import React, { useState, useEffect, useId } from "react";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

const ChangePassword = () => {
  const userid = getUserInfo();
  const user = userid.user_id;

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState("");

  // Use useEffect to perform validation when form inputs change
  useEffect(() => {
    // Reset password error message
    setPasswordError("");

    // Validate email only if it's not empty
    if (
      email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setPasswordError("Please enter a valid email address.");
    }

    // Validate new password (e.g., minimum length)
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    }

    // Validate password confirmation if both new password and confirm password have values
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    }
  }, [email, newPassword, confirmPassword]);

  const clearData = () => {
    setEmail("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setResponseMessage("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform the form submission only if there are no password errors
    if (!passwordError) {
      const endpoint = `/change_password`;
      const data = {
        user_id: user,
        email: email,
        old_password: oldPassword,
        confirm_password: confirmPassword,
      };
      try {
        const response = await instance.post(endpoint, data);
        setResponseMessage(response.data.message);
        setSuccess(response.data.success);
        console.log(response)
        clearData();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <div className="setting-profile">
        <div className="profile-header">
          <h3>Change Password</h3>
          <p>Change your password.</p>
        </div>

        <div className="update-button">
          <button onClick={handleSubmit}>Change Password</button>
        </div>
      </div>

      <div className="form">
        <div className="password-email">
          <div className="error-message-list">
            {passwordError && <p className="error-message">{passwordError}</p>}
            {responseMessage && (
              <p className="success-message">{responseMessage}</p>
            )}
            {success && <p className="success">{success}</p>}
          </div>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Enter Old Password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <br />
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          {/* {passwordError && <p className="error-message">{passwordError}</p>} */}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
