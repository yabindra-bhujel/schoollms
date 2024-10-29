import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import Collaborators from "./Collaborators";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import "./style/Collaborator.css";
import {
  updateNoteCollaborator,
  getCollaborator,
  deleteCollaborator,
  chnageNoteType,
} from "./NotesService";

const ShareDialog = ({
  open,
  handleClose,
  noteid,
  isPrivateNote,
  fetchData,
  setIsPrivateNote,
}) => {
  const [userInput, setUserInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loginuserData, setLoginuserData] = useState({});
  const username = getUserInfo().username;
  const [collaborators, setCollaborators] = useState([]);
  const [deleteUserList, setDeleteUserList] = useState([]);

  const handleDeleteCollaborato = (username) => {
    if (deleteUserList.includes(username)) {
      return;
    }
    setDeleteUserList([...deleteUserList, username]);

    // Remove user from collaborators list
    const updatedCollaborators = collaborators.filter(
      (collaborator) => collaborator.username !== username
    );
    setCollaborators(updatedCollaborators);
  };

  useEffect(() => {
    getCollaborators();
    getShareableUsers();
  }, [noteid]);

  const getCollaborators = async () => {
    getCollaborator(noteid)
      .then((res) => {
        setCollaborators(res.data);
      })
      .catch((error) => {});
  };

  const getShareableUsers = async () => {
    const endpoint = `notes/shareable_user_list/${noteid}/`;
    try {
      const res = await instance.get(endpoint);
      const userData = res.data;

      const loggedInUserData = userData.find(
        (user) => user.username === username
      );
      setLoginuserData(loggedInUserData);

      const index = userData.findIndex((user) => user.username === username);
      if (index > -1) {
        userData.splice(index, 1);
      }

      setUserList(userData);
    } catch (error) {}
  };

  const handleShareClick = async () => {
    if (selectedUsers.length > 0) {
      const selectedUsernames = selectedUsers.map((user) => user.username);
      if (selectedUsernames.length === 0) {
        return;
      }
      try {
        await updateNoteCollaborator(noteid, selectedUsernames);
        setUserInput("");
        setSelectedUsers([]);
        handleClose();
        fetchData();
        getCollaborators(noteid);
        getShareableUsers();
      } catch (error) {
        throw error;
      }
    }

    // Delete collaborators if not empty
    if (deleteUserList.length > 0) {
      try {
        await deleteCollaborator(noteid, deleteUserList);
        setDeleteUserList([]);
        handleClose();
        fetchData();
        getCollaborators(noteid);
        getShareableUsers();
      } catch (error) {
        throw error;
      }
    }
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);
    setSelectedUsers(updatedUsers);
  };

  const handleUpdateNoteMode = async () => {
    try {
      await chnageNoteType(noteid);
      fetchData();
      setIsPrivateNote(!isPrivateNote);
      getShareableUsers();
      getCollaborators(noteid);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <DialogTitle>
        <div className="dialog-title">
          <h3 className="h3_col">共有</h3>
          <div>
            <small>ノートを共有または共有を解除する</small>
            <Switch
              color="primary"
              checked={!isPrivateNote}
              onChange={handleUpdateNoteMode}
            />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        {!isPrivateNote && (
          <>
            <Collaborators
              adminUserdata={loginuserData}
              collaborators={collaborators}
              handleRemoveUser={handleDeleteCollaborato}
            />
            <Autocomplete
              id="user-search"
              options={
                userList
                  ? userList.filter(
                      (user) =>
                        !selectedUsers.some(
                          (selectedUser) =>
                            selectedUser.username === user.username
                        )
                    )
                  : []
              }
              style={{ marginTop: 20 }}
              value={null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedUsers((prevUsers) => [...prevUsers, newValue]);
                  setUserInput("");
                }
              }}
              inputValue={userInput}
              onInputChange={(event, newInputValue) => {
                setUserInput(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Users"
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Avatar
                    src={option.profile_image}
                    alt={option.username}
                    style={{ marginRight: 10 }}
                  />
                  {option.fullname} ({option.username})
                </li>
              )}
              fullWidth
            />

            {selectedUsers.map((user, index) => (
              <div
                key={user.username}
                style={{ display: "flex", alignItems: "center", marginTop: 10 }}
              >
                <Avatar
                  src={user.profile_image}
                  alt={user.username}
                  style={{ marginRight: 10 }}
                />
                <div>
                  {user.fullname} ({user.username})
                </div>
                <Button onClick={() => handleRemoveUser(index)}>Remove</Button>
              </div>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {!isPrivateNote && <Button onClick={handleShareClick}>Save</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
