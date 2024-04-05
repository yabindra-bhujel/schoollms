import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import ChatList from "./chatList";
import ChatDetils from "./ChatDetils";
import "./style/Chat.css";
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";
import { useWebSocket } from "../../WebSocketContext";

const Chat = ({sidebarWidth}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = getUserInfo().username;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unread, setUnread] = useState(false)
  const [selectGroup, setSelectGroup] = useState(null)
  const [groupName, setGroupName] = useState([])
  const { socket } = useWebSocket();


  useEffect(() => {
    if (socket) {
      
  
      socket.on("all-user", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });
  
      return () => {
        
      };
    }
  
    console.warn("Socket object not available");
  
  }, [userId, groupName, socket]);

  const handleChatSelect = (user, type = "user") => {
    setSelectedUser(user, type);
  };
  
  const handleGroupSelect = (group, type = "group") =>{
    setSelectGroup(group, type);
  }

  const getall = async () => {
    try {
      const endpoint = `socials/user_list/`;
      const response = await instance.get(endpoint);
      const userData = response.data.users;

      const filteredUserList = userData.filter(
        (user) => user.username !== userId
      );

      setUserList(filteredUserList);
    } catch (e) {
    }
  };

  const get_Group_data = async () => {
    try {
      const endpoint = `groups/group_list/`;
      const response = await instance.get(endpoint);
      const groupData = response.data.groups;
      const groupName = groupData.map(group => group.name); 
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

  return (
    <Layout>
      <div className="chat__system">
        <div className="chat__list" style={{ 
          flex: sidebarWidth ? "25%" : "20%"
          }}>
          <ChatList
            unreadMessages={unreadMessages}
            socket={socket}
            onlineUsers={onlineUsers}
            userList={userList}
            onChatSelect={handleChatSelect}
            selectedChat={selectedUser}
            groupList={groupList}
            unread = {unread}
            onselectGroup = {handleGroupSelect}
            selectGroup = {selectGroup}
            get_Group_data = {get_Group_data}
          />
        </div>
        <div className="chat__details" style={{ 
          flex: sidebarWidth ? "75%" : "90%" 
          }}>
          <ChatDetils
            selectedChat={selectedUser}
            socket={socket}
            setUnreadMessages={setUnreadMessages}
            setHasUnreadMessages={setHasUnreadMessages}
            selectGroup = {selectGroup}
            onlineUsers = {onlineUsers}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
