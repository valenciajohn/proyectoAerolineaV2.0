import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/bdConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ message: "Conexión a MongoDB exitosa" });
  } catch (error) {
    res.status(500).json({ message: "Error al conectar con MongoDB" });
  }
}

