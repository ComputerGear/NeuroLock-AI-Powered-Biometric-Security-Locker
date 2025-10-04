import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to manage a WebSocket connection.
 * @param {string | null} socketUrl - The URL of the WebSocket server to connect to.
 * @returns {{
 * lastMessage: MessageEvent | null,
 * readyState: number,
 * sendMessage: (message: string) => void
 * }}
 */
const useWebSocket = (socketUrl) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const socketRef = useRef(null);

  useEffect(() => {
    // Don't connect if the URL is not provided
    if (!socketUrl) {
      return;
    }

    // Create the WebSocket instance
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setReadyState(WebSocket.OPEN);
    };

    socket.onmessage = (event) => {
      setLastMessage(event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setReadyState(WebSocket.CLOSED);
    };

    // Cleanup function: close the socket when the component unmounts
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socketUrl]); // Reconnect if the URL changes

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return { lastMessage, readyState, sendMessage };
};

export default useWebSocket;