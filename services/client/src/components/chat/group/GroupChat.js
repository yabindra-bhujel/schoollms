import React, { useState, useEffect, useRef } from "react";
import "../style/chatdetailse.css";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import NotSeleteChat from "../NotSeleteChat";
import Popover from '@mui/material/Popover';
import Snackbar from "@mui/material/Snackbar";
import Button from '@mui/material/Button';
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import WriteMessage from "./MessageInput";

const GroupChat = ({ selectedChat, onlineUsers, handleBackToList, isMobileView }) => {
  const [groupnewmessage, setGroupnewmessage] = useState("");
  const groupmessageRef = useRef(null);
  const isGroupChat = selectedChat?.type === "group";
  const [groupMessage, setGroupMessage] = useState([]);
  const [groupIconImage, setGroupIconImage] = useState(null);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState(0)

  useEffect(() => {
    if (selectedChat) {
      const userId = getUserInfo().username;

      selectedChat.name = selectedChat.name.replace(/\s/g, "");
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/group_chat/${selectedChat.name}/${userId}/`);

      setCurrentGroupName(selectedChat.name);
      setCurrentUser(userId);
      setCurrentGroupId(selectedChat.id);

      ws.onopen = () => {
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "group_message") {
          const newMessage = {
            id: data.id,
            sender_userId: data.sender_userId,
            message: data.message,
            timestamp: data.timestamp,
            receiver_group: selectedChat.name,
          };

          const messageExists = groupMessage.some((msg) => msg.id === newMessage.id);

          if (!messageExists) {
            setGroupMessage((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      };


      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [selectedChat]);


  const [anchorEl, setAnchorEl] = useState(null);


  const handleGroupImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setGroupIconImage(file);
      if (file) {
        handleGroupImageUpload(file);
      }
    }
  };

  const handleGroupImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("group_image", file);
    formData.append("group_id", selectedChat.id);
    const endpoint = `groups/update_group_image/`;
    try {
      const res = await instance.put(endpoint, formData);
      if (res.status === 200) {
        setSnackbarOpen(true);
        setMessage("画像をアップロードしました");
        setGroupIconImage(null);
        setTimeout(() => {
          setSnackbarOpen(false);
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      setSnackbarOpen(true);
      setMessage("画像のアップロードに失敗しました");
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage("");
      }, 3000);
    }
  }


  const handleClicks = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const sendGroupMessage = () => {
    const trimmedMessage = groupnewmessage.trim();

    if (!isGroupChat || !trimmedMessage) {
      return;
    }

    const group_message_data = {
      receiver_group_Id: currentGroupId,
      receiver_group_name: currentGroupName,
      sender_user_Id: currentUser,
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "group_message",
        ...group_message_data,
      }));
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }

    setGroupnewmessage("");
  };

  const fatch_group_message = async () => {
    if (!selectedChat || !isGroupChat) {
      return;
    }

    const groupID = selectedChat ? selectedChat.id : "";

    const endpoint = `groups/group_message/${groupID}/`;

    try {
      const res = await instance.get(endpoint);
      const messages = res.data.messages;

      const seenMessageIds = new Set(groupMessage.map((msg) => msg.id));

      const filteredMessages = messages.filter((message) => !seenMessageIds.has(message.id));

      setGroupMessage((prevMessages) => [
        ...prevMessages,
        ...filteredMessages
      ]);
    } catch (err) {
      console.error("Error fetching group messages:", err);
    }
  };


  useEffect(() => {
    if (isGroupChat) {
      fatch_group_message();
    }
  }, [selectedChat, isGroupChat]);


  useEffect(() => {
    groupmessageRef.current?.scrollIntoView();
  }, [groupMessage]);


  const leaveGroup = async () => {
    const endpoint = `/groups/leave_group/${selectedChat.id}/`;
    try {
      const res = await instance.put(endpoint);
      if (res.status === 200) {
        setMessage("グループから退出しました");
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setMessage("");
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      setMessage("グループから退出に失敗しました");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage("");
      }, 3000);
    }
  }

  const deleteGroup = async () => {
    const endpoint = `/groups/delete_group/${selectedChat.id}/`;
    try {
      const res = await instance.delete(endpoint);
      if (res.status === 204) {
        setMessage("グループを削除しました");
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setMessage("");
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      setMessage("グループの削除に失敗しました");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage("");
      }, 3000);
    }

  }

  if (!selectedChat) {
    return (
      <div className="not__seleted_chat">
        <div className="not_select">
          <NotSeleteChat />
        </div>
      </div>
    );
  }

  if (isGroupChat) {
    return (
      <>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{vertical: 'bottom',horizontal: 'left'}}>
          <div style={{ padding: '20px' }}>
            <Button onClick={leaveGroup}variant="text">Leave Group</Button>
          </div>
          <div style={{ padding: '20px' }}>
            <Button onClick={deleteGroup} variant="text">Delete Group</Button>
          </div>
        </Popover>

        <Snackbar
          open={snackbaropen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          Sidebar
        />
        <ChatHeader
          handleGroupImageChange={handleGroupImageChange}
          groupIconImage={groupIconImage}
          selectedChat={selectedChat}
          open={open}
          anchorEl={anchorEl}
          handleClicks={handleClicks}
          isMobileView={isMobileView}
          handleBackToList={handleBackToList}
        />
        <div className="messages__container">
          <div className="chat_body">
            <MessageList
              messages={groupMessage}
              groupmessageRef={groupmessageRef}
              currentUser={currentUser}
            />
          </div>
        </div>
        <WriteMessage
          groupnewmessage={groupnewmessage}
          setGroupnewmessage={setGroupnewmessage}
          sendGroupMessage={sendGroupMessage}
        />
      </>
    );
  }
};

export default GroupChat;