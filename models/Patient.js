import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    
    abhaId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["clinician", "admin"], default: "clinician" },
  password: { type: String, required: true },
  name: { type: String, required: true }, // full name
  gender: { type: String, enum: ["male", "female", "other", "unknown"], default: "unknown" },
  birthDate: { type: Date },
  identifier: {
    type: String, // e.g. ABHA ID or hospital MRN
    unique: true,
    sparse: true,
  },
  contact: {
    phone: String,
    email: String,
  },
  address: {
    line: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);
