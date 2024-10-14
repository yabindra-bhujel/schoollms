import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/sidebar.css";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { RiCalendarTodoLine } from "react-icons/ri";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from "@mui/material";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import TextField from "@mui/material/TextField";

const AdminSideBar = () => {
	const location = useLocation();
	const [passwordChange, setPasswordChange] = useState(false);
	const [password, setPassword] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [snackbar, setSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const username = getUserInfo().username;

	const handlePasswordChange = () => {
		setPasswordChange(true);
	};

	const handlePasswordChangeClose = () => {
		setPasswordChange(false);
	};

	const ChangePassword = async (data) => {
		try {
			const endpoint = `password/chnage_password/`;
			const response = await instance.post(endpoint, data);
			return response;
		} catch (error) {
			throw error;
		}
	};

	const handlePasswordChangeSubmit = async () => {
		setErrors({});
		if (password.oldPassword === "") {
			setErrors({ oldPassword: "Old Password is required" });
			return;
		}

		if (password.newPassword === "") {
			setErrors({ newPassword: "New Password is required" });
			return;
		}

		if (password.confirmPassword === "") {
			setErrors({ confirmPassword: "Confirm Password is required" });
			return;
		}

		if (password.newPassword !== password.confirmPassword) {
			setErrors({ confirmPassword: "Passwords do not match" });
			return;
		}

		const data = {
			old_password: password.oldPassword,
			new_password: password.newPassword,
			confirm_password: password.confirmPassword,
		  };

		try {
			const response = await ChangePassword(data);
			if (response.status === 200) {
				setSnackbar(true);
				setSnackbarMessage("Password Changed Successfully");
				setPasswordChange(false);
				setTimeout(() => {
					handleLogout();
				}, 30000);
			}
		} catch (error) {
			setSnackbar(true);
			if (error.response) {
				const errorMessage = error.response.data.error || "There was an error processing your request.";
				setSnackbarMessage(errorMessage);
			} else {
				setSnackbarMessage("An unexpected error occurred. Please try again later.");
			}
			setPasswordChange(false);
		}
	};

	const handlePasswordChangeCancel = () => {
		setPasswordChange(false);
	};

	const handleChange = (event) => {
		setPassword({
			...password,
			[event.target.name]: event.target.value,
		});
	};

	const handleLogout = async () => {
		try {
			const endpoint = "/logout/";
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData && userData.refresh) {
				const response = await instance.post(endpoint, { refresh: userData.refresh });
				if (response.status === 200) {
					localStorage.removeItem("userData");
					window.location.href = "/login";
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Snackbar open={snackbar} autoHideDuration={6000} onClose={() => setSnackbar(false)} message={snackbarMessage} />

			<Dialog open={passwordChange} onClose={handlePasswordChangeClose} fullWidth>
				<DialogTitle>パスワードの変更</DialogTitle>

				<DialogContent>
					<div className='password-change-form'>
						<TextField label='Old Password' type='password' name='oldPassword' value={password.oldPassword} onChange={handleChange} variant='outlined' fullWidth margin='normal' error={!!errors.oldPassword} helperText={errors.oldPassword} />

						<TextField label='New Password' type='password' name='newPassword' value={password.newPassword} onChange={handleChange} variant='outlined' fullWidth margin='normal' error={!!errors.newPassword} helperText={errors.newPassword} />

						<TextField
							label='Confirm Password'
							type='password'
							name='confirmPassword'
							value={password.confirmPassword}
							onChange={handleChange}
							variant='outlined'
							fullWidth
							margin='normal'
							error={!!errors.confirmPassword}
							helperText={errors.confirmPassword}
						/>
					</div>
				</DialogContent>

				<DialogActions>
					<Button variant='contained' color='primary' onClick={handlePasswordChangeSubmit}>
						送信
					</Button>
					<Button variant='outlined' color='secondary' onClick={handlePasswordChangeCancel}>
						キャンセル
					</Button>
				</DialogActions>
			</Dialog>

			<div className='admin-nav-bar'>
				<div className='logo'>
				<h1>尾崎ゼミー 卒研</h1>
				<div className='welcome'>
						<p>Welcome {username}</p>
					</div>

				</div>
				

				<div className='nav-bar-menu'>
					<div className='chnage-password'>
						<p onClick={handlePasswordChange}>Change Password</p>
					</div>

					<div className='logout'>
						<IoMdLogOut onClick={handleLogout} size={30} />
					</div>
				</div>
			</div>
			<div className='admin-sidebar'>
				<div className='menu-item'>
					<ul>
						<li>
							<Link to='/admin/student' className={location.pathname === "/admin/student" || location.pathname === "/admin/student/add" || location.pathname === "/admin/student/edit" ? "active" : ""}>
								<PiStudentFill size={20} />
								<span>Student</span>
							</Link>
						</li>

						<li>
							<Link to='/admin/teacher' className={location.pathname === "/admin/teacher" || location.pathname === "/admin/teacher/add" || location.pathname === "/admin/teacher/edit" ? "active" : ""}>
								<GiTeacher size={20} />
								<span>Teacher</span>
							</Link>
						</li>

						<li>
							<Link to='/admin/user' className={location.pathname === "/admin/user" || location.pathname === "/admin/user/add" || location.pathname === "/admin/user/edit" ? "active" : ""}>
								<FaRegUserCircle size={20} />
								<span>User</span>
							</Link>
						</li>

						<li>
							<Link to='/admin/department' className={location.pathname === "/admin/department" || location.pathname === "/admin/department/add" || location.pathname === "/admin/department/edit" ? "active" : ""}>
								<FaBookOpen size={20} />
								<span>Department</span>
							</Link>
						</li>

						<li>
							<Link
								to='/admin/course'
								className={location.pathname === "/admin/course" || location.pathname === "/admin/course/add" || location.pathname.startsWith("/admin/course/") || location.pathname === "/admin/course/edit" ? "active" : ""}
							>
								<SiGoogleclassroom size={20} />

								<span>Subject</span>
							</Link>
						</li>

						<li>
							<Link to='/admin/enroll' className={location.pathname === "/admin/enroll" || location.pathname === "/admin/enroll/add" || location.pathname === "/admin/enroll/edit" ? "active" : ""}>
								<RiCalendarTodoLine size={20} />

								<span>Enroll Student</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default AdminSideBar;
