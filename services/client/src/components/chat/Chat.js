import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import ChatList from "./chatList";
import ChatDetils from "./ChatDetils";
import "./style/Chat.css";
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";

const Chat = ({ sidebarWidth }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatDetails, setShowChatDetails] = useState(false); // For small screens
  const [isMobileView, setIsMobileView] = useState(false); // Track screen size
  const userId = getUserInfo().username;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unread, setUnread] = useState(false);
  const [selectGroup, setSelectGroup] = useState(null);
  const [groupName, setGroupName] = useState([]);

  // Track window size to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
        setShowChatDetails(false); // Always show both on large screens
      }
    };

    // Initialize window size check
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const handleChatSelect = (user, type = "user") => {
    setSelectedUser(user);
    if (isMobileView) setShowChatDetails(true); // Show chat details on small screen
  };

  const handleGroupSelect = (group, type = "group") => {
    setSelectGroup(group, type);
    if (isMobileView) setShowChatDetails(true); // Show chat details on small screen
  };

  const getall = async () => {
    try {
      const endpoint = `socials/user_list/`;
      const response = await instance.get(endpoint);
      const userData = response.data.users;

      const filteredUserList = userData.filter(
        (user) => user.username !== userId
      );

      setUserList(filteredUserList);
    } catch (e) {}
  };

  const get_Group_data = async () => {
    try {
      const endpoint = `groups/group_list/`;
      const response = await instance.get(endpoint);
      const groupData = response.data.groups;
      const groupName = groupData.map((group) => group.name);
      setGroupList(groupData);
      setGroupName(groupName);
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(() => {
    getall();
    get_Group_data();
  }, []);

  const handleBackToList = () => {
    setShowChatDetails(false); // Go back to chat list on small screen
  };

  return (
    <Layout>
      <div className="chat__system">
        {/* Chat List: Only show on small screens when `showChatDetails` is false */}
        {!isMobileView || !showChatDetails ? (
          <div
            className="chat__list"
            style={{
              flex: sidebarWidth ? "50%" : "40%",
            }}
          >
            <ChatList
              unreadMessages={unreadMessages}
              onlineUsers={onlineUsers}
              userList={userList}
              onChatSelect={handleChatSelect}
              selectedChat={selectedUser}
              groupList={groupList}
              unread={unread}
              onselectGroup={handleGroupSelect}
              selectGroup={selectGroup}
              get_Group_data={get_Group_data}
            />
          </div>
        ) : null}

        {/* Chat Details: Only show on small screens when `showChatDetails` is true */}
        {!isMobileView || showChatDetails ? (
          <div
            className="chat__details"
            style={{
              flex: sidebarWidth ? "50%" : "60%",
            }}
          >
            <ChatDetils
              selectedChat={selectedUser}
              setUnreadMessages={setUnreadMessages}
              setHasUnreadMessages={setHasUnreadMessages}
              selectGroup={selectGroup}
              onlineUsers={onlineUsers}
              isMobileView={isMobileView}
              handleBackToList={handleBackToList}
            />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Chat;
