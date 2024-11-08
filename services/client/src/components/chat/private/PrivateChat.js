import React, { useState, useEffect, useRef } from "react";
import "../style/chatdetailse.css";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import NotSeleteChat from "../NotSeleteChat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import WriteMessage from "./MessageInput";

const PrivateChat = ({ selectedChat, onlineUsers, handleBackToList, isMobileView}) => {
  const [newmessage, setNewmessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageRef = useRef(null);
  const imageRef = useRef(null);
  const [image, setImage] = useState([]);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const sender_userId = getUserInfo().username;

  useEffect(() => {
    // Cleanup existing WebSocket if any
    if (socket) {
      socket.close();
    }

    if (selectedChat) {
      const receiver_userId = selectedChat.username;
      const currentUser = sender_userId;

      // Initialize WebSocket connection
      // get domain

      const host = window.location.hostname;
      const ws = new WebSocket(`wss://bhuj-le.tech/ws/private_chat/${receiver_userId}/${currentUser}/`);

      // const ws = new WebSocket(`ws://127.0.0.1:8000/ws/private_chat/${receiver_userId}/${currentUser}/`);
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "private_message") {
          const newMessage = {
            receiver: data.receiver,
            sender: data.sender,
            message: data.message,
            image: data.image,
            timestamp: data.timestamp,
          };
          const messageExists = messageList.some((msg) => msg.id === newMessage.id);
          if(!messageExists) {
            setMessageList((prevMessages) => [...prevMessages, newMessage]);
          }

        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
      };

      return () => {
        ws.close();
      };
    }
  }, [selectedChat, sender_userId]);

  const selectedChatUsername = selectedChat ? selectedChat.username : null;
  const isOnline = selectedChatUsername && onlineUsers.includes(selectedChatUsername);

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

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [messageList]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    const receiver_userId = selectedChat.username;
    const endpoint = `/socials/message/${receiver_userId}/${sender_userId}/`;
    try {
      const res = await instance.get(endpoint);

      setMessageList(res.data.messages);
    } catch (err) {
      setMessage("メッセージの取得に失敗しました");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage("");
      }, 3000);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const Send = () => {
    const trimmedMessage = newmessage.trim();
    const receiver_userId = selectedChat ? selectedChat.username : null;

    if (!selectedChat || (trimmedMessage === "" && image.length === 0)) {
      return;
    }

    const messageData = {
      receiver_user_id: receiver_userId,
      sender_user_id: sender_userId,
      message: trimmedMessage,
      image: image,
      timestamp: new Date().toISOString(),
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "private_message",
        ...messageData,
      }));
    } 

    setNewmessage("");
    setImage([]);
  };

  if (!selectedChat) {
    return (
      <div className="not__seleted_chat">
        <div className="not_select">
          <NotSeleteChat />
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatHeader
        selectedChat={selectedChat}
        isOnline={isOnline}
        handleBackToList={handleBackToList}
        isMobileView={isMobileView}
      />

      <div className="messages__container">
        <div className="chat_body">
          <MessageList
            messages={messageList}
            messageRef={messageRef}
            sender_userId={sender_userId}
          />
        </div>
      </div>
      <WriteMessage
        newmessage={newmessage}
        setNewmessage={setNewmessage}
        handleFileButtonClick={handleFileButtonClick}
        Send={Send}
        imageRef={imageRef}
        handleFileChange={handleFileChange}
      />
    </>
  );
};

export default PrivateChat;
