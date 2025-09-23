import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
  resourceType: { type: String, default: "Condition" },
  code: {
    coding: [
      {
        system: String,
        code: String,
        display: String,
      },
    ],
    text: String,
  },
  subject: { type: String }, // Patient reference
  clinicalStatus: String,
  verificationStatus: String,
  recordedDate: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Condition ||
  mongoose.model("Condition", conditionSchema);
