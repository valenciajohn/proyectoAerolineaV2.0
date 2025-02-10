import mongoose, { Schema, Document } from "mongoose";

export interface ISuscriptor extends Document {
  email: string;
}

const SuscriptorSchema = new Schema<ISuscriptor>({
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Suscriptor || mongoose.model<ISuscriptor>("suscriptors", SuscriptorSchema);

