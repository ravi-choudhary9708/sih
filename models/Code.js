import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  system: { type: String, enum: ["NAMASTE", "ICD11"], required: true },
  code: { type: String, required: true, index: true },
  display: { type: String, required: true },
  description: String,
  version: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Code || mongoose.model("Code", CodeSchema);
