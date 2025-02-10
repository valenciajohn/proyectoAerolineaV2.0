import { NextApiRequest, NextApiResponse } from "next";
import UsuarioModel from "@/models/usuario";
import { getSocket } from "@/services/socket";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { phone, accepted } = req.body;
  if (!phone) return res.status(400).json({ error: "Faltan datos" });

  const usuario = await UsuarioModel.findOne({ celular: phone });
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  if (usuario.mfaExpires && usuario.mfaExpires < new Date()) {
    return res.status(400).json({ error: "El enlace ha expirado" });
  }

  usuario.mfaVerified = accepted;
  usuario.mfaExpires = null;
  await usuario.save();

  // 📢 Notificar a los clientes conectados
  const io = getSocket();
  io.emit("mfaVerified", { phone, accepted });

  res.status(200).json({ message: "MFA actualizado" });
}

