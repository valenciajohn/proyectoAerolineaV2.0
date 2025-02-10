import { NextApiRequest, NextApiResponse } from 'next';
import { sendVerificationSMS } from '@/services/twilioService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { phone, name } = req.body;
  if (!phone || !name) return res.status(400).json({ error: 'Faltan datos' });

  const verificationLink = `http://localhost:3000/verify?phone=${phone}`; //cambiar una vez este en produccion
  const result = await sendVerificationSMS(phone, name, verificationLink);

  if (result.success) {
    res.status(200).json({ message: 'SMS enviado correctamente' });
  } else {
    res.status(500).json({ error: 'Error enviando SMS', details: result.error });
  }
}

