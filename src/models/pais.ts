import mongoose, { Schema, Document } from "mongoose";

export interface IPais extends Document {
  nombre: string;
}

const PaisSchema = new Schema<IPais>({
  nombre: { type: String, required: true, unique: true },
});

export default mongoose.models.Pais || mongoose.model<IPais>("pais", PaisSchema);

