import { Server } from "socket.io";

let io: Server | null = null;

export function initializeSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: { origin: "*" }, // Permitir conexiones desde cualquier origen
    });

    io.on("connection", (socket) => {
      console.log("🔌 Nuevo cliente conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("🔌 Cliente desconectado:", socket.id);
      });
    });
  }
  return io;
}

export function getSocket() {
  if (!io) throw new Error("Socket.IO no ha sido inicializado.");
  return io;
}

