import mongoose from "mongoose";

const ConceptMapSchema = new mongoose.Schema({
  sourceSystem: { type: String, default: "NAMASTE" },
  sourceCode: String,
  targetSystem: { type: String, default: "ICD11" },
  targetCode: String,
  equivalence: { type: String, enum: ["equivalent", "narrower", "broader", "related"], default: "related" },
  confidence: Number,
  note: String,
  provenance: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ConceptMap || mongoose.model("ConceptMap", ConceptMapSchema);
