import React, { createContext, useContext, useEffect, useState } from 'react';
import getUserInfo from './api/user/userdata';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};


export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectedUserList, setConnectedUserList] = useState([]);

  useEffect(() => {
    const userId = getUserInfo().username;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "broadcast_connected_users":
          setConnectedUserList(data.notification.connected_users);
          break;
        default:
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, connectedUserList }}>
      {children}
    </WebSocketContext.Provider>
  );
};
