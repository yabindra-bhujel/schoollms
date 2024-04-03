import React, { useState, useEffect, useRef } from "react";
import "./style/chatdetailse.css";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import NotSeleteChat from "./NotSeleteChat";
import NoImage from "../images/group.png";
import UserNoImage from "../images/usernoimage.jpeg";
import { BiImageAdd } from "react-icons/bi";
import { formatTimeDifference } from "./Helper";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Popover from '@mui/material/Popover';
import Snackbar from "@mui/material/Snackbar";
import Button from '@mui/material/Button';


const ChatDetails = ({ selectedChat, socket, onlineUsers }) => {
  const [newmessage, setNewmessage] = useState("");
  const [groupnewmessage, setGroupnewmessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageRef = useRef(null);
  const groupmessageRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const isGroupChat = selectedChat?.type === "group";
  const imageRef = useRef(null);
  const [groupMessage, setGroupMessage] = useState([]);
  const [image, setImage] = useState([]);
  let receriver_userId;
  const groupImage = useRef(null);
  const [groupIconImage, setGroupIconImage] = useState(null);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const isOnline = selectedChat 
  ? onlineUsers.some(user => user.userId === selectedChat.username) 
  : false;

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

  const handleFileButtonClick = () => {
    imageRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };

  const sendGroupMessage = () => {
    const trimmedMessage = groupnewmessage.trim();

    if (!isGroupChat || !trimmedMessage) {
      return;
    }

    const messageData = {
      receriver_groupID: selectedChat.id,
      receiver_group: selectedChat.name,
      sender_userId: getUserInfo().username,
      message: groupnewmessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-group-message", messageData);

    setGroupnewmessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("receive-group-message", (messageData) => {
        setGroupMessage((prevMessages) => [...prevMessages, messageData]);
      });
    }
  }, [socket]);

  const fatch_group_message = async () => {
    if (!selectedChat && !isGroupChat) {
      return;
    }

    const groupID = selectedChat ? selectedChat.id : ""; 

    const endpoint = `groups/group_message/${groupID}/`;

    try {
      const res = await instance.get(endpoint);
      const messages = res.data; 
      setGroupMessage(messages);
    } catch (err) {
    }
  };

  useEffect(() => {
    if (isGroupChat) {
      fatch_group_message();
    }
  }, [selectedChat, isGroupChat]);

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [messageList]);

  useEffect(() => {
    groupmessageRef.current?.scrollIntoView();
  }, [groupMessage]);

  if (selectedChat) {
    receriver_userId = selectedChat.username;
  }
  const sender_userId = getUserInfo().username;

  const handleClick = () => {};

  const fetchMessages = async () => {
    if (!isGroupChat) {
      const endpoint = `/socials/message/${receriver_userId}/${sender_userId}/`;
      try {
        const res = await instance.get(endpoint);
        setMessageList((prevMessages) => [
          ...prevMessages,
          ...res.data.messages,
        ]);
        setChatHistory(res.data.messages);
      } catch (err) {
        setMessage("メッセージの取得に失敗しました");
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setMessage("");
        }, 3000);
      }
    }
  };

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

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const Send = () => {
    const trimmedMessage = newmessage.trim();

    if (!selectedChat || (trimmedMessage === "" && image.length === 0)) {
      return;
    }

    const messageData = {
      receiver_userId: receriver_userId,
      sender_userId: sender_userId,
      message: trimmedMessage,
      image: image,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-message", messageData);
    setNewmessage("");
    setImage([]);
    setMessageList((prevMessages) => [...prevMessages, messageData]);
  };

  const receive_Message = (message) => {
    setMessageList((prevMessages) => [...prevMessages, message]);

    fetchMessages();
  };

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (messageData) => {
        receive_Message(messageData);
      });
    }
  }, [socket]);

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
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
  <div style={{ padding: '20px' }}>
  <Button 
  onClick={leaveGroup}
  variant="text">Leave Group</Button>
  </div>

  <div style={{ padding: '20px' }}>
  <Button 
  onClick={deleteGroup}
  variant="text">Delete Group</Button>
  </div>

</Popover>
      <Snackbar
        open={snackbaropen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}


      />
        <div className="do_chat_header">
          <div className="do__chat__left">
            <div className="profile__pic">
            <button
              onClick={() => groupImage.current && groupImage.current.click()}
            >
              <label htmlFor="profile-image">
                <input
                  ref={groupImage}
                  onChange={handleGroupImageChange}
                  type="file"
                  id="profile-image"
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </label>
              {selectedChat.image ? (
                 <img
                 alt="プロフィール画像"
                 src={groupIconImage || selectedChat.image}
               />
              ) : (
                <img
                alt="プロフィール画像"
                src={groupIconImage || NoImage}
              />
              )}
             
            </button>
            </div>

            <div className="chat_details">
              <h4>{selectedChat.name}</h4>
              <strong>Admin: {selectedChat.admin}</strong> <br />
              
            </div>
          </div>

          <div className="do__chat__right">
          <IconButton onClick={handleClicks}>
  <MoreHorizIcon />
</IconButton>

          </div>
        </div>

        <div className="messages__container">
          <div className="chat_body">
            {Array.isArray(groupMessage) && groupMessage
              .filter((message) => message.receiver_group === selectedChat.name)
              .map((message) => (
                <div
                  key={message.timestamp}
                  className={
                    message.sender_userId === getUserInfo().username
                      ? "message_sender"
                      : "message_receive"
                  }
                >
                  <p>{message.message}</p>
                  <small>{formatTimeDifference(message.timestamp)}</small>
                </div>
              ))}
            <div ref={groupmessageRef} />
          </div>
        </div>
        <div className="write_message">
          <button className="file_add_btn">
            <IoIosAdd className="file_add" />
          </button>
          <textarea
            value={groupnewmessage}
            onChange={(e) => setGroupnewmessage(e.target.value)}
            className="textarea__message"
            placeholder="Write a message"
            onKeyPress={(event) => {
              event.key === "Enter" && sendGroupMessage();
            }}
          ></textarea>

          <div className="write__message__button">
            <button className="emoji-btn">
              <BsEmojiSmile className="emoji" />
            </button>
            <button className="send" onClick={sendGroupMessage}>
              <BsSend className="send_btn" />
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!isGroupChat) {
    return (
      <>
        <div className="do_chat_header">
          <div className="do__chat__left">
            <div className="profile__pic">
              {selectedChat.image ? (
                <img src={selectedChat.image} alt="Profile" />
              ) : (
                <img src={UserNoImage} alt="Profile" />
              )}
            </div>
            <div className="chat_details">
              <h4>{selectedChat.username}</h4>
              <strong>
                {selectedChat.first_name} {selectedChat.last_name}
              </strong>{" "}
              <br />
              <small>
                {isOnline ? "Active now" : ""}
              </small>
            </div>
          </div>

          <div className="do__chat__right">
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>

        <div className="messages__container">
          <div className="chat_body">
            {chatHistory.map((message) => (
              <div
                key={message.timestamp}
                className={
                  message.sender === sender_userId
                    ? "message_sender"
                    : "message_receive"
                }
              >
                {message.image && <img src={message.image} alt="Sent" />}
                <p>{message.message}</p>
                <small>{formatTimeDifference(message.timestamp)}</small>
              </div>
            ))}
            <div ref={messageRef} />
          </div>
          <div className="chat_body">
            {messageList

              .filter(
                (message) =>
                  (message.sender_userId === selectedChat.username &&
                    message.receiver_userId === sender_userId) || // Show sent messages to the selected user
                  (message.sender_userId === sender_userId &&
                    message.receiver_userId === selectedChat.username) // Show received messages from the selected user
              )

              .map((message) => (
                <div
                  key={message.timestamp}
                  className={
                    message.sender_userId === sender_userId
                      ? "message_sender"
                      : "message_receive"
                  }
                >
                  {message.image.length != 0 && <img src={message.image} />}
                  <p>{message.message}</p>
                  <small>{formatTimeDifference(message.timestamp)}</small>
                </div>
              ))}
            <div ref={messageRef} />
          </div>
        </div>

        <div className="write_message" onClick={handleClick}>
          <button className="file_add_btn">
            <IoIosAdd className="file_add" />
          </button>
          <textarea
            value={newmessage}
            onChange={(e) => setNewmessage(e.target.value)}
            className="textarea__message"
            placeholder="Write a message"
            onKeyPress={(event) => {
              event.key === "Enter" && Send();
            }}
          ></textarea>

          <div className="write__message__button">
            <button className="emoji-btn">
              <BsEmojiSmile className="emoji" />
            </button>
            <button onClick={handleFileButtonClick} className="emoji-btn">
              <BiImageAdd className="emoji" />
            </button>
            <input
              type="file"
              ref={imageRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button className="send" onClick={Send}>
              <BsSend className="send_btn" />
            </button>
          </div>
        </div>
      </>
    );
  }
};

export default ChatDetails;
