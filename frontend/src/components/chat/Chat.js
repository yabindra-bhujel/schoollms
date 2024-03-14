import React, { useEffect, useState } from "react";
import Layout from "../navigations/Layout";
import ChatList from "./chatList";
import ChatDetils from "./ChatDetils";
import "./style/Chat.css";
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";
import { useWebSocket } from "../../WebSocketContext";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = getUserInfo().username;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
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
  
  //   // If socket is not available, you can handle it here (optional)
    console.warn("Socket object not available");
  
  }, [userId, groupName, socket]);
  

  


  const handleChatSelect = (user, type = "user") => {
    setSelectedUser(user, type);
    setSelectedUserMessages([]);
  };
  
  const handleGroupSelect = (group, type = "group") =>{
    setSelectGroup(group, type);
  }

  const getall = async () => {
    try {
      const endpoint = `/realtimeapi/getalluser/`;
      const response = await instance.get(endpoint);
      const userData = response.data.users;

      // Filter out the currently logged-in user
      const filteredUserList = userData.filter(
        (user) => user.username !== userId
      );

      setUserList(filteredUserList);
    } catch (e) {
      console.log("error");
    }
  };

  const get_Group_data = async () => {
    try {
      const endpoint = `/realtimeapi/get_group_list/${userId}`;
      const response = await instance.get(endpoint);
      const groupData = response.data.groups;
      const groupName = groupData.map(group => group.name); // Extracting group names
      setGroupList(groupData);
      setGroupName(groupName); // Setting the groupName state
    } catch (e) {
      console.log("error");
    }
  };



  useEffect(() => {
    getall();
    // Fetch unread messages and update the user list
    // haveunreadData();
    get_Group_data();
  }, []);

  return (
    <Layout>
      <div className="chat">

      <div className="chat__system">
        <div className="chat__list">
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
        <div className="chat__details">
          <ChatDetils
            selectedChat={selectedUser}
            socket={socket}
            setUnreadMessages={setUnreadMessages}
            setHasUnreadMessages={setHasUnreadMessages}
            // haveunreadData = {haveunreadData}
            selectGroup = {selectGroup}
            onlineUsers = {onlineUsers}
          />
        </div>
      </div>

      </div>
    </Layout>
  );
};

export default Chat;
