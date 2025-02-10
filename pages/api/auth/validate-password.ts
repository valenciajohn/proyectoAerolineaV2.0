import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../src/lib/bdConnect';
import PrefijoModel from '@/models/prefijo';
import Usuario from '../../../src/models/usuario'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  try {
    if (!mongoose.models["prefijos"]) {
        console.log("Registrando manualmente el modelo 'prefijos'...");
        mongoose.model("prefijos", PrefijoModel.schema);
    }

    console.log("Modelos registrados en Mongoose:", mongoose.modelNames());
    console.log("Buscando usuario...");
    const usuario = await Usuario.findOne({ email }).populate("prefijo");
    console.log("Usuario encontrado:", usuario);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    console.log("Verificando contraseña...");
    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log("Contraseña correcta, generando JWT...");
    const fullPhone = `${usuario.prefijo.prefijo}${usuario.celular}`;

    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email, name: usuario.nombre, phone: fullPhone },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Autenticación exitosa', token, phone: fullPhone, name: usuario.nombre });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}


