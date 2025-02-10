import mongoose, { Schema, Document } from "mongoose";

export interface IPrefijo extends Document {
  prefijo: string;
  nombre_pais: mongoose.Types.ObjectId;
}

const PrefijoSchema = new Schema<IPrefijo>({
  prefijo: { type: String, required: true, unique: true },
  nombre_pais: { type: Schema.Types.ObjectId, ref: "pais", required: true },
});

const PrefijoModel = mongoose.models.prefijos || mongoose.model<IPrefijo>("prefijos", PrefijoSchema);
export default PrefijoModel;

