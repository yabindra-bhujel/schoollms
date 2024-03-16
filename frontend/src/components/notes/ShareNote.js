import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import instance from '../../api/axios';
import getUserInfo from '../../api/user/userdata';
import UserInfoDialog from './UserInfo';
import Avatar from '@mui/material/Avatar';
import { updateNoteCollaborator } from './NotesService';

const ShareDialog = ({ open, handleClose, noteid, onUsersAdded, fetchData }) => {
  const [userInput, setUserInput] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loginuserData, setLoginuserData] = useState({});
  const username = getUserInfo().username;

  useEffect(() => {
    getAllUsers();
    getLoginUserData();
  }, []);

  const getLoginUserData = async () => {
    try {
      const endpoint = `/get_user_profile/`;
      const response = await instance.get(endpoint);
      setLoginuserData(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getAllUsers = async () => {
    const endpoint = `/realtimeapi/getalluser/${username}`;
    try {
      const res = await instance.get(endpoint);
      const userData = res.data.users;
      setUserList(userData);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const handleShareClick = async () => {
    if (selectedUsers.length > 0) {
      const selectedUsernames = selectedUsers.map(user => user.username);
      if(selectedUsernames.length === 0){
        return;
      }
      try {
        await updateNoteCollaborator(noteid, selectedUsernames);
        setUserInput('');
        setSelectedUsers([]);
        handleClose();
        fetchData();
        onUsersAdded('Collaborators added successfully')
      } catch (error) {
        console.error("Error fetching notes data: ", error);
        throw error;
      }
     
    }
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);
    setSelectedUsers(updatedUsers);
  };



  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Collaborators</DialogTitle>
      <DialogContent>
        <UserInfoDialog loginuserData={loginuserData} />
        <Autocomplete
          id="user-search"
          options={userList.filter(user => !selectedUsers.some(selectedUser => selectedUser.username === user.username))}
          style={{ marginTop: 20 }}
          value={null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedUsers(prevUsers => [...prevUsers, newValue]);
              setUserInput('');
            }
          }}
          inputValue={userInput}
          onInputChange={(event, newInputValue) => {
            setUserInput(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Users" variant="outlined" />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Avatar src={option.image} alt={option.username} style={{ marginRight: 10 }} />
              {option.first_name} {option.last_name} ({option.username})
            </li>
          )}
          fullWidth
        />

        {selectedUsers.map((user, index) => (
          <div key={user.username} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <Avatar src={user.image} alt={user.username} style={{ marginRight: 10 }} />
            <div>
              {user.first_name} {user.last_name} ({user.username})
            </div>
            <Button onClick={() => handleRemoveUser(index)}>Remove</Button>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleShareClick}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
