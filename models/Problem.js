import mongoose from "mongoose";

const CodingSchema = new mongoose.Schema(
  {
    system: String,   // e.g. NAMASTE, ICD11-TM2, ICD11-MMS
    code: String,
    display: String,
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema({
   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  codes: [CodingSchema],  // multiple codings for dual coding
  clinicalStatus: { type: String, default: "active" }, // FHIR Condition.clinicalStatus
  onsetDateTime: { type: Date, default: Date.now },    // when diagnosis was recorded
  recordedBy: { type: String }, // clinician/user id
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  mappings: [
    {
      code: String,
      display: String,
      system: String, // ICD11-MMS or ICD11-TM2
    }
  ],
   consent: {
    given: { type: Boolean, default: false }, // patient consent
    givenAt: { type: Date },
    givenBy: { type: String }, // patient ID / representative
    purpose: { type: String, default: "treatment" }, // e.g., treatment, insurance, research
  },
  onsetDateTime: { type: Date, default: Date.now },
});

export default mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
