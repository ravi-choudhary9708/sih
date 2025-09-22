// src/models/Audit.js
import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  action: String,
  user: String,
  details: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.models.Audit || mongoose.model("Audit", AuditSchema);
