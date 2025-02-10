import mongoose, { Schema, Document } from "mongoose";

export interface IRol extends Document {
  nombre: string;
}

const RolSchema = new Schema<IRol>({
  nombre: { type: String, required: true, unique: true },
});

export default mongoose.models.Rol || mongoose.model<IRol>("rols", RolSchema);

