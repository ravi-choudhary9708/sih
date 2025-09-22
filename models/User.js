import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  abhaId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["clinician", "admin"], default: "clinician" },
  password: { type: String, required: true }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
