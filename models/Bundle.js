
import mongoose from "mongoose";
const BundleSchema = new mongoose.Schema({
  bundle: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  createdBy: String
});
export default mongoose.models.StoredBundle || mongoose.model("StoredBundle", BundleSchema);
