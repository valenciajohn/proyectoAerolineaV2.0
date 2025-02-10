import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function authMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token

    if (!token) {
      return res.status(401).json({ message: "Acceso no autorizado. Token requerido." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verificar el token
      req.user = decoded; // Agregar datos del usuario al request
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }
  };
}

