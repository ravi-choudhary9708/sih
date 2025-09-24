import mongoose from "mongoose";

const TargetSchema = new mongoose.Schema({
  code: { type: String, required: true },     // ICD entity URI
  display: { type: String, required: true },  // ICD title
  system: { type: String, enum: ["ICD11-TM2", "ICD11-MMS"], required: true }, // which linearization
});

const ConceptMapSchema = new mongoose.Schema({
  sourceSystem: { type: String, enum: ["NAMASTE"], required: true },
  sourceCode: { type: String, required: true, index: true },
  sourceDisplay: { type: String, required: true },
  targets: [TargetSchema],                    // multiple mappings (TM2 + MMS)
  updatedAt: { type: Date, default: Date.now },
  
});

export default mongoose.models.ConceptMap ||
  mongoose.model("ConceptMap", ConceptMapSchema);
