import React, { useEffect, useState, useRef } from "react";
import { InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Checkbox, Button } from "@mui/material";
import "./style/style.css";
import SearchIcon from "@mui/icons-material/Search";
import AdminLayout from "../navigation/NavigationLayout";
import { Link } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { getUserList } from "./UserService";

const User = () => {
	const [userlist, setUserlist] = useState([]);

	useEffect(() => {
		const fatchData = async () => {
			try {
				const response = await getUserList();
				setUserlist(response);
			} catch (error) {}
		};

		fatchData();
	}, []);

	return (
		<AdminLayout>
			<div className='admin-teacher'>
				<div className='admin-teacher-header'>
					<h2>All Users</h2>
				</div>

				<div className='admin-student-table'>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>Username</TableCell>
									<TableCell>email</TableCell>
									<TableCell>First Name</TableCell>
									<TableCell>Last Name</TableCell>
									<TableCell>Is_superuser</TableCell>
									<TableCell>Is_staff</TableCell>
									<TableCell>Is_Teacher</TableCell>
									<TableCell>Is_Student</TableCell>
									<TableCell>Is_active</TableCell>
									<TableCell>Date joined</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{userlist.map((user) => (
									<TableRow key={user.username}>
										<TableCell></TableCell>
										<TableCell>{user.username}</TableCell>
										<TableCell>
											<p>{user.email}</p>
										</TableCell>
										<TableCell>{user.first_name}</TableCell>
										<TableCell>{user.last_name}</TableCell>
										<TableCell style={{ color: user.is_superuser ? "green" : "red" }}>{user.is_superuser ? "Yes" : "No"}</TableCell>
										<TableCell style={{ color: user.is_staff ? "green" : "red" }}>{user.is_staff ? "Yes" : "No"}</TableCell>
										<TableCell style={{ color: user.is_teacher ? "green" : "red" }}>{user.is_teacher ? "Yes" : "No"}</TableCell>
										<TableCell style={{ color: user.is_student ? "green" : "red" }}>{user.is_student ? "Yes" : "No"}</TableCell>
										<TableCell style={{ color: user.is_active ? "green" : "red" }}>{user.is_active ? "Yes" : "No"}</TableCell>
										<TableCell>
											{new Date(user.date_joined).toLocaleDateString("en-US")} {new Date(user.date_joined).toLocaleTimeString("en-US")}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
		</AdminLayout>
	);
};
export default User;
