import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Falta la variable de entorno MONGO_URI");
}

let isConnected = false; // Evita múltiples conexiones

const dbConnect = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "aerolinea", // Nombre de la base de datos
    });

    isConnected = !!db.connections[0].readyState;
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default dbConnect; // Cambié a exportación por defecto
