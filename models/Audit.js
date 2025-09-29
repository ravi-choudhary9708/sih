import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  code: { type: String,  },     // ICD entity URI
  display: { type: String, },  // ICD title
  system: { type: String,  }, // which linearization
});
 

export default mongoose.models.Audit || mongoose.model("Audit", AuditSchema);
