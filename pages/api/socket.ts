import { NextApiRequest, NextApiResponse } from "next";
import { initializeSocket } from "@/server/socket";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket?.server?.io) {
    console.log("Inicializando Socket.IO...");
    res.socket.server.io = initializeSocket(res.socket.server);
  }
  res.end();
}
