import React, { useState, useEffect, useRef } from "react";
import "./style/chatdetailse.css";
import { AiOutlinePhone } from "react-icons/ai";
import { BiSolidVideo } from "react-icons/bi";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import NoteSeleteChat from "./NoteSeleteChat";
import NoImage from "../images/group.png";
import { BiImageAdd } from "react-icons/bi";
import { formatLastActiveTime, formatTimeDifference } from "./Helper";
import Snackbar from "@mui/material/Snackbar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Popover from '@mui/material/Popover';


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
  const [snackbarState, setSnackbarState] = useState({
    isOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const { vertical, horizontal, isOpen, message } = snackbarState;

  const [anchorEl, setAnchorEl] = useState(null);
  const isOnline = selectedChat 
  ? onlineUsers.some(user => user.userId === selectedChat.username) 
  : false;



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

    const groupName = selectedChat ? selectedChat.name : ""; 

    const endpoint = `/realtimeapi/get_group_message_by_groupName/${groupName}/`;

    try {
      const res = await instance.get(endpoint);
      const messages = res.data; // Assuming res.data is an array of messages
      setGroupMessage(messages);

      // setGroupMessage((prevMessages) => [...prevMessages, ...messages]);
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
      const endpoint = `/realtimeapi/get_all_messages/${receriver_userId}/${sender_userId}/`;
      try {
        const res = await instance.get(endpoint);
        setMessageList((prevMessages) => [
          ...prevMessages,
          ...res.data.messages,
        ]);
        setChatHistory(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const Send = () => {
    const trimmedMessage = newmessage.trim();

    // Check if there's no selected chat, or both message and image are empty
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
          <NoteSeleteChat />
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
  {/* Add your popup content here */}
  <div style={{ padding: '20px' }}>
    {/* Example content */}
    <p>Popover Content</p>
  </div>
</Popover>

        <div className="do_chat_header">
          <div className="do__chat__left">
            <div className="profile__pic">
              {selectedChat.image ? (
                <img src={selectedChat.image} alt="Profile" />
              ) : (
                <img src={NoImage} />
              )}
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
            {groupMessage
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
            {/* if select user chat show  */}

            <div className="profile__pic">
              <img src={selectedChat.image} alt="Profile" />
            </div>
            <div className="chat_details">
              <h4>{selectedChat.username}</h4>
              <strong>
                {selectedChat.first_name} {selectedChat.last_name}
              </strong>{" "}
              <br />
              <small>
                {isOnline ? "Active now" : "Last seen 2 hours ago"}
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
