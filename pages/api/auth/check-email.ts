import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/bdConnect";
import Usuario from "../../../src/models/usuario"; 
import Suscriptor from "../../../src/models/suscriptor";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Método no permitido" });

  console.log("🔹 Recibida petición con:", req.body);

  await dbConnect();

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("❌ Correo inválido:", email);
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    console.log("🔍 Buscando usuario en la BD...");
    const usuarioExistente = await Usuario.findOne({ email });
    console.log("✅ Usuario encontrado:", usuarioExistente);
    
    if (usuarioExistente) {
      console.log("✅ Usuario encontrado:", usuarioExistente.nombre);
      return res.status(200).json({ exists: true, message: "Usuario encontrado", name: usuarioExistente.nombre, phone: usuarioExistente.celular});
    }

    // 📌 Verificar si ya está en la colección de suscriptores antes de agregarlo
    const suscriptorExistente = await Suscriptor.findOne({ email });

    if (!suscriptorExistente) {
      console.log("➕ Agregando a suscriptores:", email);
      const nuevoSuscriptor = new Suscriptor({ email });
      await nuevoSuscriptor.save();
      console.log("✅ Suscriptor agregado");

      // 📧 Enviar correo de bienvenida
      await enviarCorreoBienvenida(email);
      console.log("📧 Correo enviado");
      return res.status(200).json({ exists: false, message: "Correo agregado a suscriptores. Revisa tu email." });
    } else {
      console.log("ℹ️ El usuario ya está suscrito, no se agregará nuevamente.");
      return res.status(200).json({ exists: false, message: "Correo ya registrado, no se agregará nuevamente." });
    }

    return res.status(200).json({ exists: false, message: "Correo agregado a suscriptores" });
  } catch (error) {
    console.error("❌ Error en check-email:", error);

    let errorMessage = "Error en el servidor";

    // Si el error es de autenticación de correo
    if (error.code === "EAUTH") {
        errorMessage = "Error al enviar el correo. Verifica las credenciales.";
    }

    return res.status(500).json({ message: errorMessage });
    }
}

// 📧 Función para enviar el correo con Nodemailer
async function enviarCorreoBienvenida(email: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Configurar en .env.local
      pass: process.env.EMAIL_PASS, // Configurar en .env.local
    },
  });

  await transporter.sendMail({
    from: `"OneFly Airlines" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Gracias por suscribirte a OneFly!",
    html: `
      <h2>¡Bienvenido a OneFly!</h2>
      <p>Gracias por mostrar interés en nuestra aerolínea.</p>
      <p>Pronto recibirás más información sobre nuestros servicios y ofertas.</p>
      <br/>
      <p>Atentamente,</p>
      <p><strong>OneFly Airlines</strong></p>
    `,
  });
}

