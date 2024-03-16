import React, { useState } from "react";
import "./style/chatlist.css";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiSolidBellRing } from "react-icons/bi";
import Modal from "react-modal";
import CreatGroup from "./CreatGroup";
import Badge from '@mui/material/Badge';


Modal.setAppElement("#root");

const ChatList = ({
  socket,
  onlineUsers,
  userList,
  onChatSelect,
  selectedChat,
  unread,
  groupList,
  get_Group_data

}) => {
  const [filteruser, setFilteruser] = useState("");
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  const filteredUsers = filteruser
    ? userList.filter((user) =>
      user.username.toLowerCase().includes(filteruser.toLowerCase())
    )
    : userList;

  const openCreateGroupModal = () => {
    setOpenCreateGroup(true);
  };

  const closeCreateGroupModal = () => {
    setOpenCreateGroup(false);
  };

  console.log("userList", userList);



  return (
    <>
      <Modal
        isOpen={openCreateGroup}
        onRequestClose={closeCreateGroupModal}
        className="create-group-modal"
        overlayClassName="create-group-modal-overlay"
      >
        <div className="create-group-model_content">
          <CreatGroup
            closeMethod={closeCreateGroupModal}
            allusers={userList}
            socket={socket}
            get_Group_data={get_Group_data}
          />
        </div>
      </Modal>

      <div className="chat__list__header">
        <h2>Chats</h2>
        <button className="create_group_btn" onClick={openCreateGroupModal}>
          <AiOutlineUsergroupAdd className="group_icon" />
        </button>
      </div>
      <div className="chat__list__search">
        <input
          value={filteruser}
          onChange={(e) => setFilteruser(e.target.value)}
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="chat__list__body">
        <div className="group-section">
          {groupList.map((group, index) => {
            const unreadmessage =
              Array.isArray(unread) &&
              unread.some((unread) => unread.receiver === group.id.toString());

            return (
              <div
                key={index}
                className={`chat_list_items ${selectedChat === group ? "seleteduser" : ""
                  }`}
                onClick={() => onChatSelect(group, "user")}
              >
                <div className="icon-container">
              
                  {group.image ? (
                    <img src={group.image} alt={group.name} />
                  ) : (
                    <FaUserCircle className="default-profile-icon" />
                  )}

                </div>
                <div className="chat__list__item__details">
                  <div className="user__info">
                    <h4>{group.name}</h4>
                    {group.last_message &&
                      <strong className="last-message">
                        {group.last_message.sender}: {group.last_message.message}
                      </strong>
                    }
                  </div>
                  <div className="chat__list__item__unread">
                    {unreadmessage && (
                      <span className="unread-indicator">
                        <BiSolidBellRing />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        <div className="user-section">
          {filteredUsers.map((user, index) => {
            const isOnline = onlineUsers.some(onlineUser => onlineUser.userId === user.username);
            const unreadmessage =
              Array.isArray(unread) &&
              unread.some((unread) => unread.sender === user.username);

            return (
              <div
                key={index}
                className={`chat_list_items ${selectedChat === user ? "seleteduser" : ""
                  } ${isOnline ? "online" : ""}`}

                onClick={() => onChatSelect(user, "user")}>
                <div className="icon-container">
                  {isOnline ? (
                    <Badge
                      color="secondary"
                      overlap="circular"
                      variant="dot"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}

                    >
                      {user.image ? (
                        <img src={user.image} alt={user.username} />
                      ) : (
                        <FaUserCircle className="default-profile-icon" />
                      )}
                    </Badge>
                  ) : (
                    user.image ? (
                      <img src={user.image} alt={user.username} />
                    ) : (
                      <FaUserCircle className="default-profile-icon" />
                    )
                  )}
                </div>
                <div className="chat__list__item__details">
                  <div className="user__info">
                    <h4>{user.username}</h4>
                    <small>
                      {user.first_name} {user.last_name}
                    </small>
                  </div>
                  <div className="chat__list__item__unread">
                    {unreadmessage && (
                      <span className="unread-indicator">
                        <BiSolidBellRing />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatList;
