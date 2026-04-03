/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function connectSocket(token: string) {
  socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    auth: { token },
  });

  return socket;
}

export function getSocket() {
  if (!socket) {
    if(localStorage.getItem("accessToken")) {
      // If there's a token in localStorage, try to connect the socket
      connectSocket(localStorage.getItem("accessToken")!);
      return socket;
    } else {
      throw new Error("Socket not connected");
    }
  } else {
    return socket;
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = undefined as any;
  }
}