import React, { useState } from "react";
import "./style/chatlist.css";
import {  AiFillCloseCircle } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { IoIosRemoveCircle } from "react-icons/io";
import getUserInfo from "../../api/user/userdata";






const CreatGroup = ({ closeMethod, allusers, socket }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filteruser, setFilteruser] = useState("");
    const username = getUserInfo().username;
  
    // Function to handle selecting a user
    const handleSelectUser = (user) => {
      const isUserAlreadySelected = selectedUsers.some(
        (selectedUser) => selectedUser.username === user.username
      );
      if (isUserAlreadySelected) {
        handleDeselectUser(user);
      } else {
        setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
      }
    };
  
    // Function to handle deselecting a user
    const handleDeselectUser = (user) => {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((prevSelectedUser) => prevSelectedUser !== user)
      );
    };
  
    // Filter the user list based on search input or show all users if no search input
    const filteredUsers = filteruser
      ? allusers.filter((user) =>
          user.username.toLowerCase().includes(filteruser.toLowerCase())
        )
      : allusers;
  
    const handleCreaetGroup = () => {
      const data = {
        group_name: groupName,
        users: selectedUsers.map((user) => user.username),
        admin: username,
      };
      socket.emit("create_group", data);
    };
  
    return (
      <>
        <div className="group___header">
          <h2></h2>
          <button onClick={closeMethod}>
            <AiFillCloseCircle className="btn-icon" />
          </button>
        </div>
  
        <div className="create__group_body">
          <div className="group__name">
            <label>Group Name</label>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
  
          <div className="group__members">
            <div className="all__user">
              <p>All Users</p>
  
              <div className="filter__bar">
                <input
                  type="text"
                  placeholder="Search"
                  value={filteruser}
                  onChange={(e) => setFilteruser(e.target.value)}
                />
              </div>
              {filteredUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <div className="user__side">
                    <div className="user-icon">
                      {/* Render user's image or a default icon */}
                      {user.image ? (
                        <img src={user.image} alt={user.username} />
                      ) : (
                        // You can replace this with your default icon
                        <FaUserCircle className="default-profile-icon" />
                      )}
                    </div>
                    <div className="user-details">
                      <h4>{user.username}</h4>
                      <small>
                        {user.first_name} {user.last_name}
                      </small>
                    </div>
                  </div>
  
                  <div className="button_side">
                    <button onClick={() => handleSelectUser(user)}>
                      <BsArrowRightCircleFill className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
  
            <div className="seleted__user">
              <p>Selected User</p>
              {selectedUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <div className="user__side">
                    <div className="user-icon">
                      {/* Render user's image or a default icon */}
                      {user.image ? (
                        <img src={user.image} alt={user.username} />
                      ) : (
                        // You can replace this with your default icon
                        <FaUserCircle className="default-profile-icon" />
                      )}
                    </div>
                    <div className="user-details">
                      <h4>{user.username}</h4>
                      <small>
                        {user.first_name} {user.last_name}
                      </small>
                    </div>
                  </div>
  
                  <div className="button_side">
                    <button onClick={() => handleDeselectUser(user)}>
                      <IoIosRemoveCircle className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="create_group_footer">
            <button
              onClick={() => {
                handleCreaetGroup();
                closeMethod();
              }}
            >
              Create
            </button>
          </div>
        </div>
      </>
    );
  };
  

  export default CreatGroup