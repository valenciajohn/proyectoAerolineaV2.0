import mongoose, { Schema, Document } from "mongoose";

export interface IGenero extends Document {
  nombre: string;
}

const GeneroSchema = new Schema<IGenero>({
  nombre: { type: String, required: true, unique: true },
});

export default mongoose.models.Genero || mongoose.model<IGenero>("generos", GeneroSchema);

