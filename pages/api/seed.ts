import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../src/lib/bdConnect";
import Usuario from "../../src/models/usuario";
import Genero from "../../src/models/genero";
import Prefijo from "../../src/models/prefijo";
import Pais from "../../src/models/pais";
import Rol from "../../src/models/rol";
import bcrypt from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await dbConnect();

    console.log("🚀 Iniciando seed...");

    // Insertar Géneros
    const generos = await Genero.insertMany([
      { nombre: "Femenino" },
      { nombre: "Masculino" },
      { nombre: "Otro" },
    ]);
    console.log("✅ Géneros insertados");

    // Insertar Países
    const paises = await Pais.insertMany([
      { nombre: "Colombia" },
      { nombre: "México" },
      { nombre: "Argentina" },
      { nombre: "España" },
      { nombre: "Estados Unidos" },
    ]);
    console.log("✅ Países insertados");

    // Insertar Prefijos Telefónicos
    const prefijos = await Prefijo.insertMany([
      { prefijo: "+57", nombre_pais: paises[0]._id }, // Colombia
      { prefijo: "+52", nombre_pais: paises[1]._id }, // México
      { prefijo: "+54", nombre_pais: paises[2]._id }, // Argentina
      { prefijo: "+34", nombre_pais: paises[3]._id }, // España
      { prefijo: "+1", nombre_pais: paises[4]._id }, // Estados Unidos
    ]);
    console.log("✅ Prefijos insertados");

    // Insertar Roles
    const roles = await Rol.insertMany([
      { nombre: "Superadmin" },
      { nombre: "Vendedor" },
      { nombre: "Mantenimiento" },
      { nombre: "Azafata" },
      { nombre: "Conductor" },
    ]);
    console.log("✅ Roles insertados");

    // Insertar Usuarios de Prueba
    const passwordHash = await bcrypt.hash("contraseña123", 10);
    const usuarios = await Usuario.insertMany([
          {
          nombre: "Juan",
          apellido: "Pérez",
          email: "juan.perez@example.com",
          contraseña: passwordHash,
          fecha_nacimiento: new Date("1990-05-15"),
          genero: generos[1]._id, // Masculino
          prefijo: prefijos[0]._id, // Colombia
          celular: "3001234567",
          pais_nacimiento: paises[0]._id, // Colombia
          rol: roles[0]._id, // Superadmin
        },
        {
          nombre: "Ana",
          apellido: "Gómez",
          email: "ana.gomez@example.com",
          contraseña: passwordHash,
          fecha_nacimiento: new Date("1995-07-20"),
          genero: generos[0]._id, // Femenino
          prefijo: prefijos[1]._id, // México
          celular: "5512345678",
          pais_nacimiento: paises[1]._id, // México
          rol: roles[1]._id, // Vendedor
        },
        {
          nombre: "Carlos",
          apellido: "Díaz",
          email: "carlos.diaz@example.com",
          contraseña: passwordHash,
          fecha_nacimiento: new Date("1985-12-10"),
          genero: generos[1]._id, // Masculino
          prefijo: prefijos[2]._id, // Argentina
          celular: "1123456789",
          pais_nacimiento: paises[2]._id, // Argentina
          rol: roles[2]._id, // Mantenimiento
        },
        {
          nombre: "Laura",
          apellido: "Fernández",
          email: "laura.fernandez@example.com",
          contraseña: passwordHash,
          fecha_nacimiento: new Date("1993-03-05"),
          genero: generos[0]._id, // Femenino
          prefijo: prefijos[3]._id, // España
          celular: "612345678",
          pais_nacimiento: paises[3]._id, // España
          rol: roles[3]._id, // Azafata
        },
        {
          nombre: "Miguel",
          apellido: "Torres",
          email: "miguel.torres@example.com",
          contraseña: passwordHash,
          fecha_nacimiento: new Date("2000-09-25"),
          genero: generos[1]._id, // Masculino
          prefijo: prefijos[4]._id, // Estados Unidos
          celular: "1234567890",
          pais_nacimiento: paises[4]._id, // Estados Unidos
          rol: roles[4]._id, // Conductor
        },
    ]);

    console.log("✅ Usuarios insertados");
    console.log("🎉 Seed completado con éxito.");

    return res.status(200).json({ message: "Seed completado con éxito" });

  } catch (error: any) {
    console.error("❌ Error ejecutando seed:", error);
    return res.status(500).json({ message: "Error ejecutando seed", error: error.message });
  }
};

export default handler;
