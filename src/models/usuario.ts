import mongoose, { Schema, Document } from "mongoose";

export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  fecha_nacimiento: Date;
  genero: mongoose.Types.ObjectId;
  prefijo: mongoose.Types.ObjectId;
  celular: string;
  pais_nacimiento: mongoose.Types.ObjectId;
  rol: mongoose.Types.ObjectId;
}

const UsuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  genero: { type: Schema.Types.ObjectId, ref: "generos", required: true },
  prefijo: { type: Schema.Types.ObjectId, ref: "prefijos", required: true },
  celular: { type: String, required: true },
  pais_nacimiento: { type: Schema.Types.ObjectId, ref: "pais", required: true },
  rol: { type: Schema.Types.ObjectId, ref: "rols", required: true },
}, { timestamps: true });

const UsuarioModel = mongoose.models.usuarios || mongoose.model<IUsuario>("usuarios", UsuarioSchema);

export default UsuarioModel;
