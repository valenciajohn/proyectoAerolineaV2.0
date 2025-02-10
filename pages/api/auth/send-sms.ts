import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationSMS } from '@/services/twilioService';
import mongoose from 'mongoose';
import dbConnect from '@/lib/bdConnect';
import UsuarioModel from '@/models/usuario';
import PrefijoModel from '@/models/prefijo';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { phone, name } = req.body;
  if (!phone || !name) return res.status(400).json({ error: 'Faltan datos' });

  try {
    await dbConnect(); 

    console.log('📞 Buscando usuario con celular:', phone);

    const prefijoCodigo = phone.slice(0, 3); // Extrae el prefijo (ejemplo: +57)
    const numero = phone.slice(3); // Extrae el número real (ejemplo: 3232988653)

    if (!mongoose.models["prefijos"]) {
        console.log("Registrando manualmente el modelo 'prefijos'...");
        mongoose.model("prefijos", PrefijoModel.schema);
    }

    const usuario = await UsuarioModel.findOne({ celular: numero }).populate('prefijo');

    if (!usuario) {
      console.log('❌ Usuario no encontrado en la base de datos');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.prefijo.codigo !== prefijoCodigo) {
        return res.status(404).json({ error: 'Prefijo incorrecto' });
    }

    console.log('✅ Usuario encontrado:', usuario);

    const token = jwt.sign({ phone }, process.env.JWT_SECRET!, { expiresIn: '5m' });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?phone=${phone}&origin=loading`; //cambiar en producción

    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

    await UsuarioModel.updateOne({ celular: phone }, { $set: { mfaExpires: expirationTime } });

    const result = await sendVerificationSMS(phone, name, verificationLink);

    if (result.success) {
      res.status(200).json({ message: 'SMS enviado correctamente' });
    } else {
      res.status(500).json({ error: 'Error enviando SMS', details: result.error });
    }
  } catch (error) {
    console.error('Error en el envío de SMS:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

